package com.example.application.ecommerce.domain;

import com.example.application.base.domain.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.jspecify.annotations.Nullable;

import java.time.Instant;

@Entity
@Table(name = "categories")
public class Category extends AbstractEntity<Long> {

    public static final int NAME_MAX_LENGTH = 100;
    public static final int DESCRIPTION_MAX_LENGTH = 500;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    @JsonProperty
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = NAME_MAX_LENGTH)
    @NotBlank
    @Size(max = NAME_MAX_LENGTH)
    private String name;

    @Column(name = "description", length = DESCRIPTION_MAX_LENGTH)
    @Size(max = DESCRIPTION_MAX_LENGTH)
    private String description;

    @Column(name = "parent_category_id")
    @Nullable
    private Long parentCategoryId;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public @Nullable Long getParentCategoryId() {
        return parentCategoryId;
    }

    public void setParentCategoryId(@Nullable Long parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
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
} 