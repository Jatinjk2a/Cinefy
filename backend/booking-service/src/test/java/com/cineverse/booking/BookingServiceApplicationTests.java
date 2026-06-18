package com.cineverse.booking;

import com.cineverse.booking.model.Booking;
import com.cineverse.booking.model.BookingStatus;
import com.cineverse.booking.repository.BookingRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class BookingServiceApplicationTests {

    @Autowired
    BookingRepository bookingRepository;

    @Test
    void contextLoads() {
        assertThat(bookingRepository).isNotNull();
    }

    @Test
    void saveAndFindBooking() {
        Booking booking = Booking.builder()
                .userId("user-1")
                .showId("show-1")
                .movieId("movie-1")
                .seatIds(List.of("A1", "A2"))
                .status(BookingStatus.CONFIRMED)
                .totalPrice(20.0)
                .build();

        Booking saved = bookingRepository.save(booking);
        assertThat(saved.getId()).isNotNull();

        List<Booking> byUser = bookingRepository.findByUserId("user-1");
        assertThat(byUser).hasSize(1);
        assertThat(byUser.get(0).getSeatIds()).containsExactly("A1", "A2");
    }
}
