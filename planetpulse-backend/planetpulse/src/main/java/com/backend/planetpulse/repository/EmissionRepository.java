package com.backend.planetpulse.repository;

import com.backend.planetpulse.model.EmissionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmissionRepository extends JpaRepository<EmissionRecord, Long> {

    List<EmissionRecord> findByUserId(Long userId);
}