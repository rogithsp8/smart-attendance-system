package com.example.scas.service;

import com.example.scas.dto.CurriculumRequest;
import com.example.scas.entity.Curriculum;
import com.example.scas.entity.Subject;
import com.example.scas.exception.ResourceNotFoundException;
import com.example.scas.repository.CurriculumRepository;
import com.example.scas.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CurriculumService {

    private final CurriculumRepository curriculumRepository;
    private final SubjectRepository subjectRepository;

    public CurriculumService(CurriculumRepository curriculumRepository,
                             SubjectRepository subjectRepository) {
        this.curriculumRepository = curriculumRepository;
        this.subjectRepository = subjectRepository;
    }

    public Curriculum add(CurriculumRequest request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        Curriculum c = new Curriculum();
        c.setSubject(subject);
        c.setTopic(request.getTopic());
        c.setDescription(request.getDescription());
        c.setDateCovered(request.getDateCovered());
        return curriculumRepository.save(c);
    }

    public List<Curriculum> list() {
        return curriculumRepository.findAll();
    }
}

