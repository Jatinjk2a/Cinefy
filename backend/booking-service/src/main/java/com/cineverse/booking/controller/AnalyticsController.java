package com.cineverse.booking.controller;

import com.cineverse.booking.model.Booking;
import com.cineverse.booking.model.BookingStatus;
import com.cineverse.booking.repository.BookingRepository;
import com.cineverse.booking.security.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final BookingRepository bookingRepository;
    private final RequestUserContext userCtx;

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        requireAdmin();
        List<Booking> all = bookingRepository.findAll();

        long confirmed  = all.stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
        long cancelled  = all.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();
        double revenue  = all.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .mapToDouble(Booking::getTotalPrice).sum();

        // Bookings per show
        Map<String, Long> bookingsPerShow = all.stream()
                .collect(Collectors.groupingBy(Booking::getShowId, Collectors.counting()));

        // Unique users
        long uniqueUsers = all.stream().map(Booking::getUserId).distinct().count();

        return Map.of(
                "totalBookings",    all.size(),
                "confirmedBookings", confirmed,
                "cancelledBookings", cancelled,
                "totalRevenue",     revenue,
                "uniqueUsers",      uniqueUsers,
                "bookingsPerShow",  bookingsPerShow
        );
    }

    @GetMapping("/revenue-by-show")
    public Map<String, Double> revenueByShow() {
        requireAdmin();
        return bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .collect(Collectors.groupingBy(
                        Booking::getShowId,
                        Collectors.summingDouble(Booking::getTotalPrice)
                ));
    }

    private void requireAdmin() {
        if (!userCtx.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }
}
