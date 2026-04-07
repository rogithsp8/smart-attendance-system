package com.smartsystem.attendance.repository;

import com.smartsystem.attendance.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    
    List<Assessment> findBySubjectId(Long subjectId);
    
    List<Assessment> findBySubjectIdIn(List<Long> subjectIds);
}
