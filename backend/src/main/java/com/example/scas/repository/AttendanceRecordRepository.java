package com.example.scas.repository;

import com.example.scas.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {

    @Query("select count(ar) from AttendanceRecord ar where ar.student.id = :studentId")
    long countByStudent(@Param("studentId") Long studentId);

    @Query("select count(ar) from AttendanceRecord ar where ar.student.id = :studentId and ar.status = 'PRESENT'")
    long countPresentByStudent(@Param("studentId") Long studentId);
}

