package com.example.application.ecommerce.service;

import com.example.application.ecommerce.domain.Customer;
import com.example.application.ecommerce.domain.CustomerRepository;
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
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final Clock clock;

    CustomerService(CustomerRepository customerRepository, Clock clock) {
        this.customerRepository = customerRepository;
        this.clock = clock;
    }

    @Transactional
    public void createCustomer(String firstName, String lastName, String email, String phone,
                             String address, String city, String state, String postalCode, String country) {
        if (customerRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        var customer = new Customer();
        customer.setFirstName(firstName);
        customer.setLastName(lastName);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setAddress(address);
        customer.setCity(city);
        customer.setState(state);
        customer.setPostalCode(postalCode);
        customer.setCountry(country);
        customer.setActive(true);
        customer.setCreatedDate(clock.instant());
        customerRepository.saveAndFlush(customer);
    }

    @Transactional
    public void updateCustomer(Long customerId, String firstName, String lastName, String email,
                             String phone, String address, String city, String state, 
                             String postalCode, String country, boolean active) {
        var customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));

        // Check if email is already taken by another customer
        var existingCustomerWithEmail = customerRepository.findByEmail(email);
        if (existingCustomerWithEmail.isPresent() && !existingCustomerWithEmail.get().getId().equals(customerId)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        customer.setFirstName(firstName);
        customer.setLastName(lastName);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setAddress(address);
        customer.setCity(city);
        customer.setState(state);
        customer.setPostalCode(postalCode);
        customer.setCountry(country);
        customer.setActive(active);
        customer.setUpdatedDate(clock.instant());
        customerRepository.saveAndFlush(customer);
    }

    @Transactional
    public void deleteCustomer(Long customerId) {
        var customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));
        customerRepository.delete(customer);
    }

    @Transactional(readOnly = true)
    public List<Customer> list(Pageable pageable) {
        return customerRepository.findAllBy(pageable).toList();
    }

    @Transactional(readOnly = true)
    public List<Customer> searchCustomers(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return list(pageable);
        }
        return customerRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }

    @Transactional(readOnly = true)
    public Customer getCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));
    }

    @Transactional(readOnly = true)
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + email));
    }

    @Transactional(readOnly = true)
    public List<Customer> getActiveCustomers() {
        return customerRepository.findByActive(true);
    }
} 