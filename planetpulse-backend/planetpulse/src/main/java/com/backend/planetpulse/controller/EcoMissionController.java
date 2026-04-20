package com.backend.planetpulse.controller;

import com.backend.planetpulse.model.EcoMission;
import com.backend.planetpulse.security.JwtUtil;
import com.backend.planetpulse.service.EcoMissionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/missions")
@CrossOrigin
public class EcoMissionController {

    private final EcoMissionService missionService;
    private final JwtUtil jwtUtil;

    public EcoMissionController(EcoMissionService missionService,
                                JwtUtil jwtUtil) {
        this.missionService = missionService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/daily")
    public EcoMission getDailyMission() {
        return missionService.getDailyMission();
    }

    @PostMapping("/complete/{id}")
    public String completeMission(@PathVariable Long id,
                                  @RequestHeader("Authorization") String header) {

        String token = header.substring(7);
        String email = jwtUtil.extractEmail(token);

        missionService.completeMission(id, email);

        return "Mission completed successfully";
    }
}