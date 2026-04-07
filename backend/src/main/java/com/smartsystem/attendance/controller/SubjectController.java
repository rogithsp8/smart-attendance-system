package com.smartsystem.attendance.controller;

import com.smartsystem.attendance.entity.Subject;
import com.smartsystem.attendance.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getSubjects() {
        List<Subject> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }

    @PostMapping("/subjects")
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject) {
        try {
            System.out.println("Creating subject...");
            System.out.println("Subject name: " + subject.getName());
            System.out.println("Subject code: " + subject.getCode());
            System.out.println("Subject facultyId: " + subject.getFacultyId());
            
            Subject savedSubject = subjectService.saveSubject(subject);
            System.out.println("Subject saved successfully with ID: " + savedSubject.getId());
            return ResponseEntity.ok(savedSubject);
        } catch (Exception e) {
            System.out.println("Error creating subject: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
