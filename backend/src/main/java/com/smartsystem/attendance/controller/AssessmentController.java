package com.smartsystem.attendance.controller;

import com.smartsystem.attendance.entity.Assessment;
import com.smartsystem.attendance.entity.Subject;
import com.smartsystem.attendance.repository.UserRepository;
import com.smartsystem.attendance.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;
    private final UserRepository userRepository;

    @GetMapping("/assessments")
    public ResponseEntity<List<Assessment>> getAssessments() {
        return ResponseEntity.ok(assessmentService.getAllAssessments());
    }

    @PostMapping("/assessments")
    public ResponseEntity<Assessment> createAssessment(@RequestBody Assessment assessment) {
        Assessment savedAssessment = assessmentService.saveAssessment(assessment);
        return ResponseEntity.ok(savedAssessment);
    }

    @GetMapping("/assessments/student/{userId}")
    public ResponseEntity<List<Assessment>> getStudentAssessments(@PathVariable Long userId) {
        try {
            return userRepository.findByIdWithSubjects(userId).map(user -> {
                List<Subject> userSubjects = user.getSubjects();
                if (userSubjects == null || userSubjects.isEmpty()) {
                    return ResponseEntity.ok(List.<Assessment>of());
                }
                List<Long> subjectIds = userSubjects.stream().map(Subject::getId).toList();
                return ResponseEntity.ok(assessmentService.getAssessmentsBySubjects(subjectIds));
            }).orElse(ResponseEntity.ok(List.of()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
