package com.cineverse.movie.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class MovieRequest {
    @NotBlank private String imdbId;
    @NotBlank private String title;
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
    private List<RatingDto> ratings;

    @Data
    public static class RatingDto {
        private String source;
        private String value;
    }
}
