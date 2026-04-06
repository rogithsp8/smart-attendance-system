package com.smartsystem.attendance.controller;

import com.smartsystem.attendance.entity.User;
import com.smartsystem.attendance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        List<User> students = userService.getStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<User>> getFaculty() {
        List<User> faculty = userService.getFaculty();
        return ResponseEntity.ok(faculty);
    }
}
