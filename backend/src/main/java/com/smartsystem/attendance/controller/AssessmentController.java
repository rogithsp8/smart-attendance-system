package com.smartsystem.attendance.controller;

import com.smartsystem.attendance.entity.Assessment;
import com.smartsystem.attendance.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @GetMapping("/assessments")
    public ResponseEntity<List<Assessment>> getAssessments() {
        List<Assessment> assessments = assessmentService.getAllAssessments();
        return ResponseEntity.ok(assessments);
    }

    @PostMapping("/assessments")
    public ResponseEntity<Assessment> createAssessment(@RequestBody Assessment assessment) {
        Assessment savedAssessment = assessmentService.saveAssessment(assessment);
        return ResponseEntity.ok(savedAssessment);
    }
}
