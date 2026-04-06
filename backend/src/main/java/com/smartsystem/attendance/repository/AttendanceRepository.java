package com.smartsystem.attendance.repository;

import com.smartsystem.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    @Query("SELECT a FROM Attendance a WHERE a.subjectId = :subjectId AND a.date = :date")
    List<Attendance> findBySubjectIdAndDate(@Param("subjectId") Long subjectId, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Attendance a WHERE a.studentId = :studentId")
    List<Attendance> findByStudentId(@Param("studentId") Long studentId);
    
    List<Attendance> findBySubjectId(Long subjectId);
}
