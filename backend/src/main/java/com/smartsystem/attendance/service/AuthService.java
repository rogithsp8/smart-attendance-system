package com.smartsystem.attendance.service;

import com.smartsystem.attendance.entity.User;
import com.smartsystem.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    
    public User registerUser(String name, String email, String password, User.UserRole role) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(name != null ? name.trim() : "");
        user.setEmail(normalizedEmail);
        user.setPassword(password);
        user.setRole(role);

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        return userRepository.findByEmailIgnoreCase(normalizedEmail)
                .filter(user -> user.getPassword() != null && user.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }

    private static String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase();
    }
}
