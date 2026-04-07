package com.smartsystem.attendance.service;

import com.smartsystem.attendance.entity.Question;
import com.smartsystem.attendance.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Question> getQuestionsByAssessmentId(Long assessmentId) {
        return questionRepository.findByAssessmentId(assessmentId);
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    public Question saveQuestion(Question question) {
        if (question.getQuestionText() == null || question.getQuestionText().isBlank()) {
            throw new IllegalArgumentException("Question text is required");
        }
        if (question.getCorrectAnswer() == null || question.getCorrectAnswer().isBlank()) {
            throw new IllegalArgumentException("Correct answer is required");
        }
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
