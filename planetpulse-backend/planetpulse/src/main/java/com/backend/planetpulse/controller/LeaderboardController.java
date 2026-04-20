package com.backend.planetpulse.controller;

import com.backend.planetpulse.model.User;
import com.backend.planetpulse.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin
public class LeaderboardController {

    private final UserRepository userRepository;

    public LeaderboardController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<LeaderboardUserDTO> leaderboard() {
        return userRepository.findTop10ByOrderByEcoPointsDesc()
                .stream()
                .map(user -> new LeaderboardUserDTO(
                        user.getName(),
                        user.getEcoPoints()
                ))
                .collect(Collectors.toList());
    }

    static class LeaderboardUserDTO {
        public String name;
        public int ecoPoints;

        public LeaderboardUserDTO(String name, int ecoPoints) {
            this.name = name;
            this.ecoPoints = ecoPoints;
        }
    }
}