package com.smartsystem.attendance.controller;

import com.smartsystem.attendance.entity.Attendance;
import com.smartsystem.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/attendance")
    public ResponseEntity<List<Attendance>> getAttendance(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        if (subjectId != null && date != null) {
            List<Attendance> attendance = attendanceService.getAttendanceBySubjectAndDate(subjectId, date);
            return ResponseEntity.ok(attendance);
        }
        
        List<Attendance> allAttendance = attendanceService.getAllAttendance();
        return ResponseEntity.ok(allAttendance);
    }

    @GetMapping("/attendance/student/{studentId}")
    public ResponseEntity<List<Attendance>> getStudentAttendance(@PathVariable Long studentId) {
        List<Attendance> attendance = attendanceService.getAttendanceByStudent(studentId);
        return ResponseEntity.ok(attendance);
    }

    @PostMapping("/attendance/mark")
    public ResponseEntity<Attendance> markAttendance(@RequestBody Attendance attendance) {
        Attendance savedAttendance = attendanceService.markAttendance(attendance);
        return ResponseEntity.ok(savedAttendance);
    }

    @PostMapping("/attendance/qr-session")
    public ResponseEntity<Map<String, Object>> createQRSession(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", UUID.randomUUID().toString());
        response.put("subjectId", request.get("subjectId"));
        response.put("expiryTime", System.currentTimeMillis() + 300000); // 5 minutes
        return ResponseEntity.ok(response);
    }
}
