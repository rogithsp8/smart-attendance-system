package com.smartsystem.attendance.controller;

import com.smartsystem.attendance.entity.Topic;
import com.smartsystem.attendance.entity.Subject;
import com.smartsystem.attendance.service.TopicService;
import com.smartsystem.attendance.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;
    private final SubjectService subjectService;

    @GetMapping("/topics/subject/{subjectId}")
    public ResponseEntity<List<Topic>> getTopicsBySubject(@PathVariable Long subjectId) {
        List<Topic> topics = topicService.getTopicsBySubjectId(subjectId);
        return ResponseEntity.ok(topics);
    }

    @PostMapping("/topics")
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic) {
        try {
            System.out.println("Saving topic...");
            System.out.println("Topic title: " + topic.getTitle());
            System.out.println("Topic description: " + topic.getDescription());
            
            // Get subject ID from the topic object
            Long subjectId = null;
            if (topic.getSubject() != null && topic.getSubject().getId() != null) {
                subjectId = topic.getSubject().getId();
            }
            System.out.println("Subject ID: " + subjectId);
            
            if (subjectId == null) {
                System.out.println("Subject ID is required");
                return ResponseEntity.badRequest().build();
            }
            
            // 1. Fetch Subject from DB
            Subject subject = subjectService.getSubjectById(subjectId);
            if (subject == null) {
                System.out.println("Subject not found with ID: " + subjectId);
                return ResponseEntity.badRequest().build();
            }
            
            // 2. Set it into Topic
            topic.setSubject(subject);
            
            // 3. Then save
            Topic savedTopic = topicService.saveTopic(topic);
            System.out.println("Topic saved successfully with ID: " + savedTopic.getId());
            return ResponseEntity.ok(savedTopic);
        } catch (Exception e) {
            System.out.println("Error saving topic: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/topics")
    public ResponseEntity<List<Topic>> getAllTopics() {
        List<Topic> topics = topicService.getAllTopics();
        return ResponseEntity.ok(topics);
    }

    @PatchMapping("/topics/{id}/complete")
    public ResponseEntity<Topic> markComplete(@PathVariable Long id) {
        try {
            Topic topic = topicService.markComplete(id);
            return ResponseEntity.ok(topic);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
