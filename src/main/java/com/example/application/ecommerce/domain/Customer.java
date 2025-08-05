package com.example.application.ecommerce.domain;

import com.example.application.base.domain.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.jspecify.annotations.Nullable;

import java.time.Instant;

@Entity
@Table(name = "customers")
public class Customer extends AbstractEntity<Long> {

    public static final int FIRST_NAME_MAX_LENGTH = 50;
    public static final int LAST_NAME_MAX_LENGTH = 50;
    public static final int EMAIL_MAX_LENGTH = 100;
    public static final int PHONE_MAX_LENGTH = 20;
    public static final int ADDRESS_MAX_LENGTH = 500;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    @JsonProperty
    private Long id;

    @Column(name = "first_name", nullable = false, length = FIRST_NAME_MAX_LENGTH)
    @NotBlank
    @Size(max = FIRST_NAME_MAX_LENGTH)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = LAST_NAME_MAX_LENGTH)
    @NotBlank
    @Size(max = LAST_NAME_MAX_LENGTH)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true, length = EMAIL_MAX_LENGTH)
    @NotBlank
    @Email
    @Size(max = EMAIL_MAX_LENGTH)
    private String email;

    @Column(name = "phone", length = PHONE_MAX_LENGTH)
    @Size(max = PHONE_MAX_LENGTH)
    private String phone;

    @Column(name = "address", length = ADDRESS_MAX_LENGTH)
    @Size(max = ADDRESS_MAX_LENGTH)
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "country")
    private String country;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_date", nullable = false)
    private Instant createdDate;

    @Column(name = "updated_date")
    @Nullable
    private Instant updatedDate;

    @Override
    public @Nullable Long getId() {
        return id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public @Nullable Instant getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(@Nullable Instant updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
} 