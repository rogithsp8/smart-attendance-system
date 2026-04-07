package com.smartsystem.attendance.service;

import com.smartsystem.attendance.entity.Assessment;
import com.smartsystem.attendance.entity.Subject;
import com.smartsystem.attendance.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final SubjectService subjectService;

    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    public Assessment getAssessmentById(Long id) {
        return assessmentRepository.findById(id).orElse(null);
    }

    public Assessment saveAssessment(Assessment assessment) {
        if (assessment.getSubjectId() == null) {
            throw new IllegalArgumentException("Subject ID is required");
        }
        
        Subject subject = subjectService.getSubjectById(assessment.getSubjectId());
        if (subject == null) {
            throw new IllegalArgumentException("Subject not found with ID: " + assessment.getSubjectId());
        }
        
        return assessmentRepository.save(assessment);
    }

    public void deleteAssessment(Long id) {
        assessmentRepository.deleteById(id);
    }

    public List<Assessment> getAssessmentsBySubject(Long subjectId) {
        return assessmentRepository.findBySubjectId(subjectId);
    }

    public List<Assessment> getAssessmentsBySubjects(List<Long> subjectIds) {
        return assessmentRepository.findBySubjectIdIn(subjectIds);
    }
}
