package com.example.scas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CurriculumRequest {

    @NotNull
    private Long subjectId;

    @NotBlank
    private String topic;

    private String description;

    @NotNull
    private LocalDate dateCovered;

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateCovered() {
        return dateCovered;
    }

    public void setDateCovered(LocalDate dateCovered) {
        this.dateCovered = dateCovered;
    }
}

