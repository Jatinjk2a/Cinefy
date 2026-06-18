package com.cineverse.booking.repository;

import com.cineverse.booking.model.Booking;
import com.cineverse.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByShowId(String showId);
    List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);
    boolean existsByShowIdAndSeatIdsContainingAndStatusNot(String showId, String seatId, BookingStatus status);
}
