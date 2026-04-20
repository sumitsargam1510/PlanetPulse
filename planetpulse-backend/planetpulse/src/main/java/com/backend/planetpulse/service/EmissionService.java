package com.backend.planetpulse.service;

import com.backend.planetpulse.exception.BadRequestException;
import com.backend.planetpulse.exception.ResourceNotFoundException;
import com.backend.planetpulse.model.EmissionRecord;
import com.backend.planetpulse.model.User;
import com.backend.planetpulse.repository.EmissionRepository;
import com.backend.planetpulse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class EmissionService {

    private final EmissionRepository emissionRepository;
    private final UserRepository userRepository;

    private final Map<String, Double> emissionFactors = Map.of(
            "driving", 0.12,
            "electricity", 0.82,
            "flight", 0.15,
            "meat", 5.0
    );

    public EmissionService(EmissionRepository emissionRepository,
                           UserRepository userRepository) {
        this.emissionRepository = emissionRepository;
        this.userRepository = userRepository;
    }

    public EmissionRecord calculateAndSave(String activity,
                                           Double amount,
                                           String unit,
                                           String email) {

        if (activity == null || activity.isBlank()) {
            throw new BadRequestException("Activity type is required");
        }

        if (amount == null || amount <= 0) {
            throw new BadRequestException("Amount must be positive");
        }

        if (!emissionFactors.containsKey(activity)) {
            throw new BadRequestException("Unsupported activity type");
        }

        Double factor = emissionFactors.get(activity);
        Double co2 = factor * amount;

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        EmissionRecord record = EmissionRecord.builder()
                .activityType(activity)
                .amount(amount)
                .unit(unit)
                .co2Emission(co2)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        updateGamification(user);

        userRepository.save(user);

        return emissionRepository.save(record);
    }

    // 🔥 Streak + Eco Points Logic

    private void updateGamification(User user) {

        LocalDate today = LocalDate.now();

        LocalDate lastDate = user.getLastActivityDate();

        if (lastDate == null) {
            user.setStreakCount(1);
        }
        else if (lastDate.equals(today.minusDays(1))) {
            user.setStreakCount(user.getStreakCount() + 1);
        }
        else if (!lastDate.equals(today)) {
            user.setStreakCount(1);
        }

        user.setLastActivityDate(today);

        // +5 eco points per activity
        user.setEcoPoints(user.getEcoPoints() + 5);
    }

    public Double getTotalEmission(String email) {
        return getUserHistory(email)
                .stream()
                .mapToDouble(EmissionRecord::getCo2Emission)
                .sum();
    }


//    public void deleteEmission(Long id, String email) {
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        EmissionRecord record = emissionRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Emission not found"));
//
//        if (!record.getUser().getId().equals(user.getId())) {
//            throw new RuntimeException("Unauthorized");
//        }
//
//        emissionRepository.delete(record);
//    }

    public List<EmissionRecord> getUserHistory(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return emissionRepository.findByUserId(user.getId());
    }
}