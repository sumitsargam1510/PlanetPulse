package com.backend.planetpulse.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private Integer age;

    // 🔥 Gamification fields
    private int ecoPoints = 0;

    private int streakCount = 0;

    private LocalDate lastActivityDate;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<EmissionRecord> emissions;
}