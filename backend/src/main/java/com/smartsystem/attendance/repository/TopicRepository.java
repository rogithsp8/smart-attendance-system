package com.smartsystem.attendance.repository;

import com.smartsystem.attendance.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    
    @Query("SELECT t FROM Topic t WHERE t.subject.id = :subjectId")
    List<Topic> findBySubjectId(Long subjectId);
}
