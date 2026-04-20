package com.backend.planetpulse.service;

import com.backend.planetpulse.model.EcoMission;
import com.backend.planetpulse.model.User;
import com.backend.planetpulse.repository.EcoMissionRepository;
import com.backend.planetpulse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class EcoMissionService {

    private final EcoMissionRepository missionRepository;
    private final UserRepository userRepository;

    public EcoMissionService(EcoMissionRepository missionRepository,
                             UserRepository userRepository) {
        this.missionRepository = missionRepository;
        this.userRepository = userRepository;
    }

    // Return random mission
    public EcoMission getDailyMission() {
        List<EcoMission> missions = missionRepository.findAll();

        if (missions.isEmpty()) {
            return null;
        }

        Random random = new Random();
        return missions.get(random.nextInt(missions.size()));
    }

    // Complete mission and give points
    public void completeMission(Long missionId, String email) {

        User user = userRepository.findByEmail(email).orElseThrow();

        EcoMission mission = missionRepository.findById(missionId).orElseThrow();

        user.setEcoPoints(user.getEcoPoints() + mission.getPoints());

        userRepository.save(user);
    }
}