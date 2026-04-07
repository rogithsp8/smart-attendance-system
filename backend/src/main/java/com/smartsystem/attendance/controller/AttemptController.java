package com.smartsystem.attendance.controller;

import com.smartsystem.attendance.entity.Attempt;
import com.smartsystem.attendance.service.AttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;

    @GetMapping("/attempts/user/{userId}")
    public ResponseEntity<List<Attempt>> getAttemptsByUser(@PathVariable Long userId) {
        List<Attempt> attempts = attemptService.getAttemptsByUserId(userId);
        return ResponseEntity.ok(attempts);
    }

    @PostMapping("/attempts/submit")
    public ResponseEntity<Attempt> submitAttempt(@RequestBody Map<String, Object> submission) {
        try {
            System.out.println("Received submission: " + submission);
            
            Long userId = Long.valueOf(submission.get("userId").toString());
            Long assessmentId = Long.valueOf(submission.get("assessmentId").toString());
            
            // Handle answers map properly
            Map<Long, String> answers = new HashMap<>();
            Object answersObj = submission.get("answers");
            System.out.println("Answers object: " + answersObj);
            
            if (answersObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, String> stringMap = (Map<String, String>) answersObj;
                for (Map.Entry<String, String> entry : stringMap.entrySet()) {
                    answers.put(Long.valueOf(entry.getKey()), entry.getValue());
                }
            }
            
            System.out.println("Processed answers: " + answers);
            
            Attempt attempt = attemptService.submitAttempt(userId, assessmentId, answers);
            return ResponseEntity.ok(attempt);
        } catch (Exception e) {
            System.out.println("Error in submitAttempt: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/attempts/{attemptId}")
    public ResponseEntity<Attempt> getAttemptById(@PathVariable Long attemptId) {
        Attempt attempt = attemptService.getAttemptById(attemptId);
        if (attempt == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(attempt);
    }
}
