package com.backend.planetpulse.controller;

import com.backend.planetpulse.dto.EmissionRequest;
import com.backend.planetpulse.dto.EmissionResponse;
import com.backend.planetpulse.model.EmissionRecord;
import com.backend.planetpulse.service.EmissionService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/emissions")
public class EmissionController {

    private final EmissionService emissionService;

    public EmissionController(EmissionService emissionService) {
        this.emissionService = emissionService;
    }

    @PostMapping("/calculate")
    public EmissionResponse calculate(
            @Valid @RequestBody EmissionRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        EmissionRecord record =
                emissionService.calculateAndSave(
                        request.getActivity(),
                        request.getAmount(),
                        request.getUnit(),
                        email
                );

        return mapToResponse(record);
    }

//    @DeleteMapping("/{id}")
//    public void deleteEmission(@PathVariable Long id,
//                               Authentication authentication) {
//
//        String email = authentication.getName();
//        emissionService.deleteEmission(id, email);
//    }


    @GetMapping("/total")
    public Double total(Authentication authentication) {

        String email = authentication.getName();

        return emissionService.getTotalEmission(email);
    }

    @GetMapping("/history")
    public List<EmissionResponse> history(Authentication authentication) {

        String email = authentication.getName();

        return emissionService.getUserHistory(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 🔹 Helper method (cleaner controller)
    private EmissionResponse mapToResponse(EmissionRecord record) {
        return EmissionResponse.builder()
                .activity(record.getActivityType())
                .amount(record.getAmount())
                .unit(record.getUnit())
                .co2Emission(record.getCo2Emission())
                .createdAt(record.getCreatedAt())
                .build();
    }
}