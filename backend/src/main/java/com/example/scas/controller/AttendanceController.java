package com.example.scas.controller;

import com.example.scas.dto.AttendanceMarkRequest;
import com.example.scas.dto.AttendanceSummaryDto;
import com.example.scas.entity.Attendance;
import com.example.scas.service.AttendanceService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/session")
    public ResponseEntity<Map<String, Object>> createSession(@RequestParam Long subjectId,
                                                             Authentication authentication) {
        String email = authentication.getName();
        Attendance session = attendanceService.createSession(subjectId, email);
        return ResponseEntity.ok(Map.of("id", session.getId()));
    }

    @GetMapping(value = "/session/{id}/qr", produces = MediaType.IMAGE_PNG_VALUE)
    public void qr(@PathVariable Long id, HttpServletResponse response) throws IOException {
        byte[] png = attendanceService.generateQr(id);
        response.setContentType(MediaType.IMAGE_PNG_VALUE);
        response.getOutputStream().write(png);
    }

    @PostMapping("/mark")
    public ResponseEntity<Void> mark(@Valid @RequestBody AttendanceMarkRequest request) {
        attendanceService.markBulk(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/scan")
    public ResponseEntity<Void> scan(@RequestParam Long attendanceId,
                                     @RequestParam String token,
                                     Authentication authentication) {
        String email = authentication.getName();
        attendanceService.scan(attendanceId, token, email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<AttendanceSummaryDto> summary(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(attendanceService.summaryForStudent(email));
    }
}

