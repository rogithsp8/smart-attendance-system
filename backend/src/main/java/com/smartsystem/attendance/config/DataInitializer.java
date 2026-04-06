package com.smartsystem.attendance.config;

import com.smartsystem.attendance.entity.User;
import com.smartsystem.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (!userRepository.findByEmailIgnoreCase("admin@test.com").isPresent()) {
            // Create test admin user
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@test.com");
            admin.setPassword("123456");
            admin.setRole(User.UserRole.ADMIN);
            userRepository.save(admin);
            System.out.println("Created admin user: admin@test.com");
        }

        // Check if test student user already exists
        if (!userRepository.findByEmailIgnoreCase("student@test.com").isPresent()) {
            User student = new User();
            student.setName("Test Student");
            student.setEmail("student@test.com");
            student.setPassword("123456");
            student.setRole(User.UserRole.STUDENT);
            userRepository.save(student);
            System.out.println("Created student user: student@test.com");
        }

        if (!userRepository.findByEmailIgnoreCase("faculty@test.com").isPresent()) {
            User faculty = new User();
            faculty.setName("Test Faculty");
            faculty.setEmail("faculty@test.com");
            faculty.setPassword("123456");
            faculty.setRole(User.UserRole.FACULTY);
            userRepository.save(faculty);
            System.out.println("Created faculty user: faculty@test.com");
        }
    }
}
