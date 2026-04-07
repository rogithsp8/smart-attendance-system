package com.smartsystem.attendance.repository;

import com.smartsystem.attendance.entity.Attempt;
import com.smartsystem.attendance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    
    List<Attempt> findByUserId(Long userId);
    
    List<Attempt> findByUserIdAndAssessmentId(Long userId, Long assessmentId);
    
    Optional<Attempt> findByUserIdAndAssessmentIdAndStatus(Long userId, Long assessmentId, Attempt.AttemptStatus status);
}
