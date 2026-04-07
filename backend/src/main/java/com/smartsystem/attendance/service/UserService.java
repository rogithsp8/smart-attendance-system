package com.smartsystem.attendance.service;

import com.smartsystem.attendance.entity.Subject;
import com.smartsystem.attendance.entity.User;
import com.smartsystem.attendance.repository.SubjectRepository;
import com.smartsystem.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getStudents() {
        return userRepository.findByRole(User.UserRole.STUDENT);
    }

    public List<User> getFaculty() {
        return userRepository.findByRole(User.UserRole.FACULTY);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User getUserByIdOrThrow(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public User assignSubject(Long userId, Long subjectId) {
        User user = userRepository.findByIdWithSubjects(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Subject subject = subjectRepository.findById(subjectId)
            .orElseThrow(() -> new IllegalArgumentException("Subject not found: " + subjectId));
        if (user.getSubjects() == null) {
            user.setSubjects(new ArrayList<>());
        }
        boolean alreadyAssigned = user.getSubjects().stream()
            .anyMatch(s -> s.getId().equals(subjectId));
        if (!alreadyAssigned) {
            user.getSubjects().add(subject);
            userRepository.save(user);
        }
        return user;
    }

    @Transactional
    public User removeSubject(Long userId, Long subjectId) {
        User user = userRepository.findByIdWithSubjects(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        if (user.getSubjects() != null) {
            user.getSubjects().removeIf(s -> s.getId().equals(subjectId));
            userRepository.save(user);
        }
        return user;
    }

    public List<Subject> getUserSubjects(Long userId) {
        return userRepository.findByIdWithSubjects(userId)
            .map(User::getSubjects)
            .orElse(List.of());
    }
}
