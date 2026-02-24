package com.example.scas.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "curriculum")
public class Curriculum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Subject subject;

    @Column(nullable = false)
    private String topic;

    private String description;

    private LocalDate dateCovered;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
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

