package com.cineverse.movie.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "reviews")
@CompoundIndex(def = "{'movieId': 1, 'userId': 1}", unique = true)
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Review {

    @Id
    private String id;

    private String movieId;
    private String userId;
    private String userEmail;
    private int rating;      // 1–10
    private String comment;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
