package com.example.application.ecommerce.domain;

import com.example.application.base.domain.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.jspecify.annotations.Nullable;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "orders")
public class Order extends AbstractEntity<Long> {

    public static final int ORDER_NUMBER_MAX_LENGTH = 50;
    public static final int STATUS_MAX_LENGTH = 50;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    @JsonProperty
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = ORDER_NUMBER_MAX_LENGTH)
    @NotBlank
    @Size(max = ORDER_NUMBER_MAX_LENGTH)
    private String orderNumber;

    @Column(name = "customer_id", nullable = false)
    @NotNull
    private Long customerId;

    @Column(name = "total_amount", nullable = false)
    @NotNull
    @Positive
    private BigDecimal totalAmount;

    @Column(name = "status", nullable = false, length = STATUS_MAX_LENGTH)
    @NotBlank
    @Size(max = STATUS_MAX_LENGTH)
    private String status; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "billing_address")
    private String billingAddress;

    @Column(name = "notes")
    private String notes;

    @Column(name = "order_date", nullable = false)
    private Instant orderDate;

    @Column(name = "shipped_date")
    @Nullable
    private Instant shippedDate;

    @Column(name = "delivered_date")
    @Nullable
    private Instant deliveredDate;

    @Override
    public @Nullable Long getId() {
        return id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Instant getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Instant orderDate) {
        this.orderDate = orderDate;
    }

    public @Nullable Instant getShippedDate() {
        return shippedDate;
    }

    public void setShippedDate(@Nullable Instant shippedDate) {
        this.shippedDate = shippedDate;
    }

    public @Nullable Instant getDeliveredDate() {
        return deliveredDate;
    }

    public void setDeliveredDate(@Nullable Instant deliveredDate) {
        this.deliveredDate = deliveredDate;
    }
} 