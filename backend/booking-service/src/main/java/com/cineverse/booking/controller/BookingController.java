package com.cineverse.booking.controller;

import com.cineverse.booking.dto.BookingRequest;
import com.cineverse.booking.model.Booking;
import com.cineverse.booking.security.RequestUserContext;
import com.cineverse.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final RequestUserContext userCtx;

    @PostMapping
    public ResponseEntity<Booking> create(@Valid @RequestBody BookingRequest req,
                                          @RequestParam(defaultValue = "0") double pricePerSeat) {
        requireAuth();
        Booking booking = bookingService.create(req, userCtx.getUserId(), pricePerSeat);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping("/my")
    public List<Booking> myBookings() {
        requireAuth();
        return bookingService.getForUser(userCtx.getUserId());
    }

    @GetMapping("/{id}")
    public Booking getById(@PathVariable Long id) {
        requireAuth();
        return bookingService.getById(id, userCtx.getUserId(), userCtx.isAdmin());
    }

    @PostMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        requireAuth();
        return bookingService.cancel(id, userCtx.getUserId(), userCtx.isAdmin());
    }

    @PostMapping("/seats/check")
    public Map<String, Object> checkSeats(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<String> seatIds = (List<String>) body.get("seatIds");
        String showId = (String) body.get("showId");
        List<String> locked = bookingService.getLockedSeats(showId, seatIds);
        return Map.of("lockedSeats", locked, "available", locked.isEmpty());
    }

    private void requireAuth() {
        if (!userCtx.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
    }
}
