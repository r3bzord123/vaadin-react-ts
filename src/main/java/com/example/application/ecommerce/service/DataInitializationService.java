package com.example.application.ecommerce.service;

import com.example.application.ecommerce.domain.Category;
import com.example.application.ecommerce.domain.CategoryRepository;
import com.example.application.ecommerce.domain.Product;
import com.example.application.ecommerce.domain.ProductRepository;
import com.example.application.ecommerce.domain.Customer;
import com.example.application.ecommerce.domain.CustomerRepository;
import com.example.application.ecommerce.domain.Order;
import com.example.application.ecommerce.domain.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;

@Component
public class DataInitializationService implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final Clock clock;

    public DataInitializationService(CategoryRepository categoryRepository,
                                   ProductRepository productRepository,
                                   CustomerRepository customerRepository,
                                   OrderRepository orderRepository,
                                   Clock clock) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.clock = clock;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Only initialize if no categories exist
        if (categoryRepository.count() == 0) {
            initializeSampleData();
        }
    }

    private void initializeSampleData() {
        // Create sample categories
        Category electronics = createCategory("Electronics", "Electronic devices and gadgets", null);
        Category clothing = createCategory("Clothing", "Apparel and fashion items", null);
        Category books = createCategory("Books", "Books and publications", null);
        
        Category smartphones = createCategory("Smartphones", "Mobile phones and accessories", electronics.getId());
        Category laptops = createCategory("Laptops", "Portable computers", electronics.getId());
        Category mensClothing = createCategory("Men's Clothing", "Clothing for men", clothing.getId());
        Category womensClothing = createCategory("Women's Clothing", "Clothing for women", clothing.getId());

        // Create sample products
        createProduct("iPhone 15", "Latest iPhone model", "IPHONE-15", new BigDecimal("999.99"), 50, electronics.getId());
        createProduct("MacBook Pro", "Professional laptop", "MACBOOK-PRO", new BigDecimal("1999.99"), 25, electronics.getId());
        createProduct("Samsung Galaxy", "Android smartphone", "SAMSUNG-GALAXY", new BigDecimal("799.99"), 30, electronics.getId());
        createProduct("Men's T-Shirt", "Cotton t-shirt for men", "TSHIRT-MEN", new BigDecimal("29.99"), 100, mensClothing.getId());
        createProduct("Women's Dress", "Elegant dress for women", "DRESS-WOMEN", new BigDecimal("89.99"), 75, womensClothing.getId());
        createProduct("Programming Book", "Learn Java programming", "BOOK-JAVA", new BigDecimal("49.99"), 200, books.getId());

        // Create sample customers
        Customer customer1 = createCustomer("John", "Doe", "john.doe@example.com", "+1234567890", 
            "123 Main St", "New York", "NY", "10001", "USA");
        Customer customer2 = createCustomer("Jane", "Smith", "jane.smith@example.com", "+0987654321", 
            "456 Oak Ave", "Los Angeles", "CA", "90210", "USA");

        // Create sample orders
        createOrder(customer1.getId(), new BigDecimal("1029.98"), 
            "123 Main St, New York, NY 10001", "123 Main St, New York, NY 10001", "First order");
        createOrder(customer2.getId(), new BigDecimal("119.98"), 
            "456 Oak Ave, Los Angeles, CA 90210", "456 Oak Ave, Los Angeles, CA 90210", "Second order");
    }

    private Category createCategory(String name, String description, Long parentCategoryId) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setParentCategoryId(parentCategoryId);
        category.setActive(true);
        category.setCreatedDate(clock.instant());
        return categoryRepository.saveAndFlush(category);
    }

    private void createProduct(String name, String description, String sku, BigDecimal price, 
                             Integer stockQuantity, Long categoryId) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setSku(sku);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setCategoryId(categoryId);
        product.setActive(true);
        product.setCreatedDate(clock.instant());
        productRepository.saveAndFlush(product);
    }

    private Customer createCustomer(String firstName, String lastName, String email, String phone,
                                  String address, String city, String state, String postalCode, String country) {
        Customer customer = new Customer();
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
        return customerRepository.saveAndFlush(customer);
    }

    private void createOrder(Long customerId, BigDecimal totalAmount, String shippingAddress, 
                           String billingAddress, String notes) {
        Order order = new Order();
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setCustomerId(customerId);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setNotes(notes);
        order.setOrderDate(clock.instant());
        orderRepository.saveAndFlush(order);
    }
} 