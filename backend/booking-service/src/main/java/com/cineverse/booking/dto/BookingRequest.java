package com.cineverse.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
    @NotBlank  private String showId;
    @NotEmpty  private List<String> seatIds;
    private String paymentId;
}
