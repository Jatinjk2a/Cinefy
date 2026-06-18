package com.cineverse.movie.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "shows")
@CompoundIndex(def = "{'movieId': 1, 'showTime': 1}", unique = true)
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Show {

    @Id
    private String id;

    private String movieId;
    private String theatreName;
    private String theatreOwnerId;
    private Instant showTime;
    private int totalSeats;
    private int availableSeats;
    private double price;
    private String hall;
    private List<String> bookedSeatIds;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
