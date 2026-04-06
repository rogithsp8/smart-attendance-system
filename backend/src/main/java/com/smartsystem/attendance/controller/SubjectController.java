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
        Subject savedSubject = subjectService.saveSubject(subject);
        return ResponseEntity.ok(savedSubject);
    }
}
