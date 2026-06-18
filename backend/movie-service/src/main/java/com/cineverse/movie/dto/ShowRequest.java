package com.cineverse.movie.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class ShowRequest {
    @NotBlank private String movieId;
    @NotBlank private String theatreName;
    @NotNull  private Instant showTime;
    @Min(1)   private int totalSeats;
    @Min(0)   private double price;
    private String hall;
}
