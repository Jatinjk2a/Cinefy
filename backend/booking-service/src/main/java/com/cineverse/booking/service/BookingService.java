package com.cineverse.booking.service;

import com.cineverse.booking.dto.BookingRequest;
import com.cineverse.booking.event.BookingEventPublisher;
import com.cineverse.booking.model.Booking;
import com.cineverse.booking.model.BookingStatus;
import com.cineverse.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatLockService seatLockService;
    private final BookingEventPublisher eventPublisher;

    @Transactional
    public Booking create(BookingRequest req, String userId, double pricePerSeat) {
        // 1. Acquire Redis locks (5-min TTL)
        boolean locked = seatLockService.lockSeats(req.getShowId(), req.getSeatIds(), userId);
        if (!locked) {
            throw new IllegalStateException("One or more seats are already reserved. Please select different seats.");
        }

        // 2. Double-check DB for confirmed bookings
        for (String seatId : req.getSeatIds()) {
            if (bookingRepository.existsByShowIdAndSeatIdsContainingAndStatusNot(
                    req.getShowId(), seatId, BookingStatus.CANCELLED)) {
                seatLockService.releaseSeats(req.getShowId(), req.getSeatIds());
                throw new IllegalStateException("Seat " + seatId + " is already booked.");
            }
        }

        Booking booking = Booking.builder()
                .userId(userId)
                .showId(req.getShowId())
                .movieId("")   // populated by caller or a follow-up lookup
                .seatIds(req.getSeatIds())
                .status(BookingStatus.CONFIRMED)
                .totalPrice(pricePerSeat * req.getSeatIds().size())
                .paymentId(req.getPaymentId())
                .build();

        Booking saved = bookingRepository.save(booking);

        // 3. Release locks — seats are now permanently booked in DB
        seatLockService.releaseSeats(req.getShowId(), req.getSeatIds());

        // 4. Publish event for notification-service
        eventPublisher.publishBookingCreated(saved);
        return saved;
    }

    @Transactional
    public Booking cancel(Long bookingId, String requesterId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NoSuchElementException("Booking not found: " + bookingId));

        if (!isAdmin && !booking.getUserId().equals(requesterId)) {
            throw new SecurityException("Access denied");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(Instant.now());
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishBookingCancelled(saved);
        return saved;
    }

    public List<Booking> getForUser(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getById(Long bookingId, String requesterId, boolean isAdmin) {
        Booking b = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NoSuchElementException("Booking not found"));
        if (!isAdmin && !b.getUserId().equals(requesterId)) {
            throw new SecurityException("Access denied");
        }
        return b;
    }

    public List<String> getLockedSeats(String showId, List<String> seatIds) {
        return seatIds.stream()
                .filter(s -> seatLockService.isSeatLocked(showId, s))
                .toList();
    }
}
