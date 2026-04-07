package com.smartsystem.attendance.controller;

import com.smartsystem.attendance.entity.Subject;
import com.smartsystem.attendance.entity.User;
import com.smartsystem.attendance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004"})
public class UserController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        return ResponseEntity.ok(userService.getStudents());
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<User>> getFaculty() {
        return ResponseEntity.ok(userService.getFaculty());
    }

    @GetMapping("/users/{userId}/subjects")
    public ResponseEntity<List<Subject>> getUserSubjects(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserSubjects(userId));
    }

    @PostMapping("/users/{userId}/subjects/{subjectId}")
    public ResponseEntity<?> assignSubject(
            @PathVariable Long userId,
            @PathVariable Long subjectId) {
        try {
            User user = userService.assignSubject(userId, subjectId);
            return ResponseEntity.ok(userService.getUserSubjects(user.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{userId}/subjects/{subjectId}")
    public ResponseEntity<?> removeSubject(
            @PathVariable Long userId,
            @PathVariable Long subjectId) {
        try {
            userService.removeSubject(userId, subjectId);
            return ResponseEntity.ok(userService.getUserSubjects(userId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
