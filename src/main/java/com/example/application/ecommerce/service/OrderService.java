package com.example.application.ecommerce.service;

import com.example.application.ecommerce.domain.Order;
import com.example.application.ecommerce.domain.OrderRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@BrowserCallable
@AnonymousAllowed
@PreAuthorize("hasRole('ADMIN')")
public class OrderService {

    private final OrderRepository orderRepository;
    private final Clock clock;

    OrderService(OrderRepository orderRepository, Clock clock) {
        this.orderRepository = orderRepository;
        this.clock = clock;
    }

    @Transactional
    public void createOrder(Long customerId, BigDecimal totalAmount, String shippingAddress, 
                          String billingAddress, String notes) {
        var order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomerId(customerId);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setNotes(notes);
        order.setOrderDate(clock.instant());
        orderRepository.saveAndFlush(order);
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setStatus(status);
        
        // Update relevant dates based on status
        if ("SHIPPED".equals(status)) {
            order.setShippedDate(clock.instant());
        } else if ("DELIVERED".equals(status)) {
            order.setDeliveredDate(clock.instant());
        }
        
        orderRepository.saveAndFlush(order);
    }

    @Transactional
    public void updateOrder(Long orderId, String status, String shippingAddress, 
                          String billingAddress, String notes) {
        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setStatus(status);
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setNotes(notes);
        
        // Update relevant dates based on status
        if ("SHIPPED".equals(status)) {
            order.setShippedDate(clock.instant());
        } else if ("DELIVERED".equals(status)) {
            order.setDeliveredDate(clock.instant());
        }
        
        orderRepository.saveAndFlush(order);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        orderRepository.delete(order);
    }

    @Transactional(readOnly = true)
    public List<Order> list(Pageable pageable) {
        return orderRepository.findAllBy(pageable).toList();
    }

    @Transactional(readOnly = true)
    public List<Order> searchOrders(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return list(pageable);
        }
        return orderRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByDateRange(Instant startDate, Instant endDate) {
        return orderRepository.findByOrderDateBetween(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public long getOrderCountByStatus(String status) {
        return orderRepository.countByStatus(status);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalRevenue() {
        var revenue = orderRepository.getTotalRevenue();
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
} 