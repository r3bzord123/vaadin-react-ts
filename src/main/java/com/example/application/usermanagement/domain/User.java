package com.example.application.usermanagement.domain;

import com.example.application.base.domain.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.jspecify.annotations.Nullable;

import java.time.Instant;

@Entity
@Table(name = "users")
public class User extends AbstractEntity<Long> {

    public static final int USERNAME_MAX_LENGTH = 50;
    public static final int EMAIL_MAX_LENGTH = 100;
    public static final int FIRST_NAME_MAX_LENGTH = 50;
    public static final int LAST_NAME_MAX_LENGTH = 50;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @JsonProperty
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = USERNAME_MAX_LENGTH)
    @NotBlank
    @Size(max = USERNAME_MAX_LENGTH)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = EMAIL_MAX_LENGTH)
    @NotBlank
    @Email
    @Size(max = EMAIL_MAX_LENGTH)
    private String email;

    @Column(name = "first_name", nullable = false, length = FIRST_NAME_MAX_LENGTH)
    @NotBlank
    @Size(max = FIRST_NAME_MAX_LENGTH)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = LAST_NAME_MAX_LENGTH)
    @NotBlank
    @Size(max = LAST_NAME_MAX_LENGTH)
    private String lastName;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "created_date", nullable = false)
    private Instant createdDate;

    @Column(name = "last_login_date")
    @Nullable
    private Instant lastLoginDate;

    @Override
    public @Nullable Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public @Nullable Instant getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(@Nullable Instant lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
} 