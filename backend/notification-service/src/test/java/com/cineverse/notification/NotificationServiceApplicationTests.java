package com.cineverse.notification;

import com.cineverse.notification.model.Notification;
import com.cineverse.notification.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
@ActiveProfiles("test")
class NotificationServiceApplicationTests {

    @Autowired
    NotificationRepository notificationRepository;

    @Test
    void contextLoads() {
        assertThat(notificationRepository).isNotNull();
    }

    @Test
    void saveAndFindNotification() {
        Notification n = Notification.builder()
                .userId("user-1")
                .type("BOOKING_CONFIRMED")
                .title("Booking Confirmed")
                .message("Your booking is confirmed!")
                .read(false)
                .build();

        notificationRepository.save(n);

        List<Notification> results = notificationRepository.findByUserIdOrderByCreatedAtDesc("user-1");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getType()).isEqualTo("BOOKING_CONFIRMED");

        long unread = notificationRepository.countByUserIdAndRead("user-1", false);
        assertThat(unread).isEqualTo(1L);

        notificationRepository.deleteAll();
    }
}
