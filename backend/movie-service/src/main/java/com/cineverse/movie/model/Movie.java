package com.cineverse.movie.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "movies")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Movie {

    @Id
    private String id;

    @Indexed(unique = true)
    private String imdbId;

    private String title;
    private String year;
    private String genre;
    private String director;
    private String actors;
    private String plot;
    private String posterUrl;
    private String runtime;
    private String imdbRating;
    private String rated;
    private String language;
    private String country;
    private String awards;
    private String boxOffice;
    private List<Rating> ratings;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class Rating {
        private String source;
        private String value;
    }
}
