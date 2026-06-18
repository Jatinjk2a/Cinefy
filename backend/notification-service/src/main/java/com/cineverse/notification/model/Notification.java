package com.cineverse.notification.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notifications")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Notification {

    @Id
    private String id;

    private String userId;
    private String type;      // BOOKING_CONFIRMED, BOOKING_CANCELLED, MOVIE_RELEASED, REVIEW_CREATED
    private String title;
    private String message;
    private boolean read;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
