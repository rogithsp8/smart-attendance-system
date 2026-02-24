package com.example.scas.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "attendance_record",
        uniqueConstraints = @UniqueConstraint(columnNames = {"attendance_id", "student_id"}))
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "attendance_id")
    private Attendance attendance;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private User student;

    @Column(nullable = false)
    private String status; // PRESENT, ABSENT

    private String markedVia; // QR, MANUAL

    private Instant markedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Attendance getAttendance() {
        return attendance;
    }

    public void setAttendance(Attendance attendance) {
        this.attendance = attendance;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMarkedVia() {
        return markedVia;
    }

    public void setMarkedVia(String markedVia) {
        this.markedVia = markedVia;
    }

    public Instant getMarkedAt() {
        return markedAt;
    }

    public void setMarkedAt(Instant markedAt) {
        this.markedAt = markedAt;
    }
}

