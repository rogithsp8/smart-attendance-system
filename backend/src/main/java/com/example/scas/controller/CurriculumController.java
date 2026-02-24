package com.example.scas.controller;

import com.example.scas.dto.CurriculumRequest;
import com.example.scas.entity.Curriculum;
import com.example.scas.service.CurriculumService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/curriculum")
@CrossOrigin
public class CurriculumController {

    private final CurriculumService curriculumService;

    public CurriculumController(CurriculumService curriculumService) {
        this.curriculumService = curriculumService;
    }

    @PostMapping
    public ResponseEntity<Curriculum> add(@Valid @RequestBody CurriculumRequest request) {
        return ResponseEntity.ok(curriculumService.add(request));
    }

    @GetMapping
    public ResponseEntity<List<Curriculum>> list() {
        return ResponseEntity.ok(curriculumService.list());
    }
}

