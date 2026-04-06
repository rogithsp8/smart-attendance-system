package com.smartsystem.attendance.service;

import com.smartsystem.attendance.entity.Assessment;
import com.smartsystem.attendance.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;

    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    public Assessment getAssessmentById(Long id) {
        return assessmentRepository.findById(id).orElse(null);
    }

    public Assessment saveAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    public void deleteAssessment(Long id) {
        assessmentRepository.deleteById(id);
    }

    public List<Assessment> getAssessmentsBySubject(Long subjectId) {
        return assessmentRepository.findBySubjectId(subjectId);
    }
}
