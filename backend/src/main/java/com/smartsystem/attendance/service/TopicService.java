package com.smartsystem.attendance.service;

import com.smartsystem.attendance.entity.Topic;
import com.smartsystem.attendance.entity.Subject;
import com.smartsystem.attendance.repository.TopicRepository;
import com.smartsystem.attendance.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final SubjectRepository subjectRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public List<Topic> getTopicsBySubjectId(Long subjectId) {
        return topicRepository.findBySubjectId(subjectId);
    }

    public Topic getTopicById(Long id) {
        return topicRepository.findById(id).orElse(null);
    }

    public Topic saveTopic(Topic topic) {
        // Validate that subject exists
        if (topic.getSubject() == null || topic.getSubject().getId() == null) {
            throw new IllegalArgumentException("Topic must have a valid subject");
        }
        
        Subject subject = subjectRepository.findById(topic.getSubject().getId()).orElse(null);
        if (subject == null) {
            throw new IllegalArgumentException("Subject not found with id: " + topic.getSubject().getId());
        }
        
        topic.setSubject(subject);
        return topicRepository.save(topic);
    }

    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }

    public Topic markComplete(Long id) {
        Topic topic = topicRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Topic not found: " + id));
        topic.setCompleted(true);
        return topicRepository.save(topic);
    }
}
