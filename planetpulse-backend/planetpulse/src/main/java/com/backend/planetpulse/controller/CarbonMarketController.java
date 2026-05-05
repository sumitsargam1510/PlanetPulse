package com.backend.planetpulse.controller;

import com.backend.planetpulse.model.CarbonCredit;
import com.backend.planetpulse.repository.CarbonCreditRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market")
@CrossOrigin
public class CarbonMarketController {

    private final CarbonCreditRepository repo;

    public CarbonMarketController(CarbonCreditRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<CarbonCredit> getAll() {
        return repo.findAll();
    }

    @PostMapping("/sell")
    public CarbonCredit sell(@RequestBody CarbonCredit credit) {
        credit.setSold(false);
        return repo.save(credit);
    }

    @PostMapping("/buy/{id}")
    public CarbonCredit buy(@PathVariable Long id) {
        CarbonCredit c = repo.findById(id).orElseThrow();
        c.setSold(true);
        return repo.save(c);
    }
}