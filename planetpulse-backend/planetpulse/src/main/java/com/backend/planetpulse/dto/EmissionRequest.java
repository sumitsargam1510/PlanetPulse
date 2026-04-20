package com.backend.planetpulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EmissionRequest {

    @NotBlank(message = "Activity is required")
    private String activity;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private Double amount;

    @NotBlank(message = "Unit is required")
    private String unit;
}