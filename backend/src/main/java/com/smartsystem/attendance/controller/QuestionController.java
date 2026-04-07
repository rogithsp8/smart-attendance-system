package com.smartsystem.attendance.controller;

import com.smartsystem.attendance.entity.Question;
import com.smartsystem.attendance.entity.Assessment;
import com.smartsystem.attendance.service.QuestionService;
import com.smartsystem.attendance.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004")
public class QuestionController {

    private final QuestionService questionService;
    private final AssessmentService assessmentService;

    @GetMapping("/questions/{assessmentId}")
    public ResponseEntity<List<Question>> getQuestionsByAssessment(@PathVariable Long assessmentId) {
        try {
            System.out.println("Fetching questions for assessment ID: " + assessmentId);
            List<Question> questions = questionService.getQuestionsByAssessmentId(assessmentId);
            System.out.println("Found " + questions.size() + " questions");
            for (Question q : questions) {
                System.out.println(" - Question ID: " + q.getId() + ", Text: " + q.getQuestionText());
            }
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            System.out.println("Error fetching questions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/questions/{assessmentId}")
    public ResponseEntity<Question> createQuestion(
            @PathVariable Long assessmentId,
            @RequestBody Question question) {
        try {
            System.out.println("Saving question...");
            System.out.println("Question text: " + question.getQuestionText());
            System.out.println("Question options: " + question.getOptions());
            System.out.println("Correct answer: " + question.getCorrectAnswer());
            System.out.println("Assessment ID from path: " + assessmentId);
            
            // 1. Fetch assessment from DB
            Assessment assessment = assessmentService.getAssessmentById(assessmentId);
            if (assessment == null) {
                System.out.println("Assessment not found with ID: " + assessmentId);
                return ResponseEntity.badRequest().build();
            }
            
            // 2. Set assessment into question
            question.setAssessment(assessment);
            
            // 3. Save question
            Question savedQuestion = questionService.saveQuestion(question);
            System.out.println("Question saved successfully with ID: " + savedQuestion.getId());
            return ResponseEntity.ok(savedQuestion);
        } catch (Exception e) {
            System.out.println("Error saving question: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }
}
