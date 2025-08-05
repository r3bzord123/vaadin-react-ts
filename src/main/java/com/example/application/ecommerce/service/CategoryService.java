package com.example.application.ecommerce.service;

import com.example.application.ecommerce.domain.Category;
import com.example.application.ecommerce.domain.CategoryRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.List;

@BrowserCallable
@AnonymousAllowed
@PreAuthorize("hasRole('ADMIN')")
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final Clock clock;

    CategoryService(CategoryRepository categoryRepository, Clock clock) {
        this.categoryRepository = categoryRepository;
        this.clock = clock;
    }

    @Transactional
    public void createCategory(String name, String description, @Nullable Long parentCategoryId) {
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category name already exists: " + name);
        }

        var category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setParentCategoryId(parentCategoryId);
        category.setActive(true);
        category.setCreatedDate(clock.instant());
        categoryRepository.saveAndFlush(category);
    }

    @Transactional
    public void updateCategory(Long categoryId, String name, String description, 
                            @Nullable Long parentCategoryId, boolean active) {
        var category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));

        // Check if name is already taken by another category
        var existingCategoryWithName = categoryRepository.findByName(name);
        if (existingCategoryWithName.isPresent() && !existingCategoryWithName.get().getId().equals(categoryId)) {
            throw new RuntimeException("Category name already exists: " + name);
        }

        category.setName(name);
        category.setDescription(description);
        category.setParentCategoryId(parentCategoryId);
        category.setActive(active);
        category.setUpdatedDate(clock.instant());
        categoryRepository.saveAndFlush(category);
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        var category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public List<Category> list(Pageable pageable) {
        return categoryRepository.findAllBy(pageable).toList();
    }

    @Transactional(readOnly = true)
    public List<Category> searchCategories(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return list(pageable);
        }
        return categoryRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }

    @Transactional(readOnly = true)
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
    }

    @Transactional(readOnly = true)
    public List<Category> getSubcategories(Long parentCategoryId) {
        return categoryRepository.findByParentCategoryId(parentCategoryId);
    }

    @Transactional(readOnly = true)
    public List<Category> getActiveCategories() {
        return categoryRepository.findByActive(true);
    }
} 