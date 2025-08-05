package com.example.application.ecommerce.service;

import com.example.application.ecommerce.domain.Product;
import com.example.application.ecommerce.domain.ProductRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.util.List;

@BrowserCallable
@AnonymousAllowed
@PreAuthorize("hasRole('ADMIN')")
public class ProductService {

    private final ProductRepository productRepository;
    private final Clock clock;

    ProductService(ProductRepository productRepository, Clock clock) {
        this.productRepository = productRepository;
        this.clock = clock;
    }

    @Transactional
    public void createProduct(String name, String description, String sku, BigDecimal price, 
                           Integer stockQuantity, @Nullable Long categoryId, @Nullable String imageUrl) {
        if (productRepository.existsBySku(sku)) {
            throw new RuntimeException("SKU already exists: " + sku);
        }

        var product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setSku(sku);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setCategoryId(categoryId);
        product.setImageUrl(imageUrl);
        product.setActive(true);
        product.setCreatedDate(clock.instant());
        productRepository.saveAndFlush(product);
    }

    @Transactional
    public void updateProduct(Long productId, String name, String description, String sku, 
                           BigDecimal price, Integer stockQuantity, @Nullable Long categoryId, 
                           @Nullable String imageUrl, boolean active) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        // Check if SKU is already taken by another product
        var existingProductWithSku = productRepository.findBySku(sku);
        if (existingProductWithSku.isPresent() && !existingProductWithSku.get().getId().equals(productId)) {
            throw new RuntimeException("SKU already exists: " + sku);
        }

        product.setName(name);
        product.setDescription(description);
        product.setSku(sku);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setCategoryId(categoryId);
        product.setImageUrl(imageUrl);
        product.setActive(active);
        product.setUpdatedDate(clock.instant());
        productRepository.saveAndFlush(product);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        productRepository.delete(product);
    }

    @Transactional
    public void updateStock(Long productId, Integer newQuantity) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        product.setStockQuantity(newQuantity);
        product.setUpdatedDate(clock.instant());
        productRepository.saveAndFlush(product);
    }

    @Transactional(readOnly = true)
    public List<Product> list(Pageable pageable) {
        return productRepository.findAllBy(pageable).toList();
    }

    @Transactional(readOnly = true)
    public List<Product> searchProducts(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return list(pageable);
        }
        return productRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }

    @Transactional(readOnly = true)
    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Transactional(readOnly = true)
    public List<Product> getActiveProducts() {
        return productRepository.findByActive(true);
    }

    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts(Integer threshold) {
        return productRepository.findLowStockProducts(threshold);
    }
} 