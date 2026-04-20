package com.backend.planetpulse.repository;

import com.backend.planetpulse.model.EcoMission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EcoMissionRepository extends JpaRepository<EcoMission, Long> {
}