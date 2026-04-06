package com.smartsystem.attendance.repository;

import com.smartsystem.attendance.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    List<Subject> findByFacultyId(Long facultyId);
}
