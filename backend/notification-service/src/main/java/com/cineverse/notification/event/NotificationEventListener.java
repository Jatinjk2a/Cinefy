package com.cineverse.notification.event;

import com.cineverse.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = "${rabbitmq.queues.booking-created}")
    public void onBookingCreated(Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        Long bookingId = ((Number) payload.get("bookingId")).longValue();
        double total = ((Number) payload.get("totalPrice")).doubleValue();

        notificationService.create(
                userId,
                "BOOKING_CONFIRMED",
                "Booking Confirmed!",
                "Your booking #" + bookingId + " is confirmed. Total: $" + total
        );
        log.info("Processed BOOKING_CREATED for userId={}", userId);
    }

    @RabbitListener(queues = "${rabbitmq.queues.booking-cancelled}")
    public void onBookingCancelled(Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        Long bookingId = ((Number) payload.get("bookingId")).longValue();

        notificationService.create(
                userId,
                "BOOKING_CANCELLED",
                "Booking Cancelled",
                "Your booking #" + bookingId + " has been cancelled."
        );
        log.info("Processed BOOKING_CANCELLED for userId={}", userId);
    }

    @RabbitListener(queues = "${rabbitmq.queues.movie-released}")
    public void onMovieReleased(Map<String, Object> payload) {
        String title = (String) payload.get("title");
        String year  = (String) payload.get("year");
        // Broadcast — no specific userId; stored as system notification
        notificationService.create(
                "system",
                "MOVIE_RELEASED",
                "New Movie: " + title,
                title + " (" + year + ") is now available on CineVerse!"
        );
        log.info("Processed MOVIE_RELEASED: {}", title);
    }

    @RabbitListener(queues = "${rabbitmq.queues.review-created}")
    public void onReviewCreated(Map<String, Object> payload) {
        String userId  = (String) payload.get("userId");
        String movieId = (String) payload.get("movieId");
        int rating     = ((Number) payload.get("rating")).intValue();

        notificationService.create(
                userId,
                "REVIEW_CREATED",
                "Review Submitted",
                "Your " + rating + "/10 review for movie #" + movieId + " was saved."
        );
        log.info("Processed REVIEW_CREATED userId={} movieId={}", userId, movieId);
    }
}
