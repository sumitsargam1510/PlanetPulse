package com.backend.planetpulse.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EmissionResponse {
    private String activity;
    private Double amount;
    private String unit;
    private Double co2Emission;
    private LocalDateTime createdAt;
}