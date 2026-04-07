package com.smartsystem.attendance.service;

import com.smartsystem.attendance.entity.Attempt;
import com.smartsystem.attendance.entity.Question;
import com.smartsystem.attendance.entity.User;
import com.smartsystem.attendance.entity.Assessment;
import com.smartsystem.attendance.repository.AttemptRepository;
import com.smartsystem.attendance.repository.QuestionRepository;
import com.smartsystem.attendance.repository.UserRepository;
import com.smartsystem.attendance.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;

    public List<Attempt> getAttemptsByUserId(Long userId) {
        return attemptRepository.findByUserId(userId);
    }

    public Attempt getAttemptById(Long id) {
        return attemptRepository.findById(id).orElse(null);
    }

    public Attempt submitAttempt(Long userId, Long assessmentId, Map<Long, String> answers) {
        // Get all questions for this assessment
        List<Question> questions = questionRepository.findByAssessmentId(assessmentId);
        
        int totalQuestions = questions.size();
        int correctAnswers = 0;
        
        // Calculate score
        for (Question question : questions) {
            String userAnswer = answers.get(question.getId());
            String correctAnswer = question.getCorrectAnswer();
            
            if (userAnswer != null && userAnswer.equals(correctAnswer)) {
                correctAnswers++;
            }
        }
        
        // Calculate percentage score
        int score = totalQuestions > 0 ? (correctAnswers * 100) / totalQuestions : 0;
        
        // Create attempt
        Attempt attempt = new Attempt();
        
        // Fetch user and assessment entities
        User user = userRepository.findById(userId).orElseThrow(() -> 
            new RuntimeException("User not found with id: " + userId));
        Assessment assessment = assessmentRepository.findById(assessmentId).orElseThrow(() -> 
            new RuntimeException("Assessment not found with id: " + assessmentId));
        
        attempt.setUser(user);
        attempt.setAssessment(assessment);
        attempt.setScore(score);
        attempt.setStatus(Attempt.AttemptStatus.COMPLETED);
        
        return attemptRepository.save(attempt);
    }

    public void deleteAttempt(Long id) {
        attemptRepository.deleteById(id);
    }
}
