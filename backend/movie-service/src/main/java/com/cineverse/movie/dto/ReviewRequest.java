package com.cineverse.movie.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewRequest {
    @Min(1) @Max(10) private int rating;
    @NotBlank        private String comment;
}
