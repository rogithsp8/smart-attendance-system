package com.example.scas.service;

import com.example.scas.dto.AttendanceMarkRequest;
import com.example.scas.dto.AttendanceSummaryDto;
import com.example.scas.entity.Attendance;
import com.example.scas.entity.AttendanceRecord;
import com.example.scas.entity.Subject;
import com.example.scas.entity.User;
import com.example.scas.exception.ResourceNotFoundException;
import com.example.scas.repository.AttendanceRecordRepository;
import com.example.scas.repository.AttendanceRepository;
import com.example.scas.repository.SubjectRepository;
import com.example.scas.repository.UserRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             AttendanceRecordRepository attendanceRecordRepository,
                             SubjectRepository subjectRepository,
                             UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public Attendance createSession(Long subjectId, String facultyEmail) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        User faculty = userRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
        Attendance attendance = new Attendance();
        attendance.setSubject(subject);
        attendance.setFaculty(faculty);
        attendance.setDate(LocalDate.now());
        attendance.setQrToken("S" + System.currentTimeMillis());
        attendance.setQrExpiresAt(Instant.now().plusSeconds(300));
        return attendanceRepository.save(attendance);
    }

    public byte[] generateQr(Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        String text = attendance.getId() + ":" + attendance.getQrToken();
        try {
            BitMatrix matrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, 250, 250);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("QR generation failed", e);
        }
    }

    @Transactional
    public void markBulk(AttendanceMarkRequest request) {
        Attendance attendance = attendanceRepository.findById(request.getAttendanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        for (Long studentId : request.getStudentIds()) {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
            AttendanceRecord record = new AttendanceRecord();
            record.setAttendance(attendance);
            record.setStudent(student);
            record.setStatus(request.getStatus());
            record.setMarkedVia("MANUAL");
            record.setMarkedAt(Instant.now());
            attendanceRecordRepository.save(record);
        }
    }

    public void scan(Long attendanceId, String token, String studentEmail) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        if (!token.equals(attendance.getQrToken()) || attendance.getQrExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("QR expired or invalid");
        }
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        AttendanceRecord record = new AttendanceRecord();
        record.setAttendance(attendance);
        record.setStudent(student);
        record.setStatus("PRESENT");
        record.setMarkedVia("QR");
        record.setMarkedAt(Instant.now());
        attendanceRecordRepository.save(record);
    }

    public AttendanceSummaryDto summaryForStudent(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        long total = attendanceRecordRepository.countByStudent(student.getId());
        long present = attendanceRecordRepository.countPresentByStudent(student.getId());
        AttendanceSummaryDto dto = new AttendanceSummaryDto();
        dto.setTotal(total);
        dto.setPresent(present);
        if (total == 0) {
            dto.setPercentage(100.0);
        } else {
            dto.setPercentage(present * 100.0 / total);
        }
        return dto;
    }
}

