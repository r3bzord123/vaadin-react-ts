# E-commerce Admin Dashboard

A modern web application built with Vaadin, Spring Boot, and React TypeScript for managing an e-commerce business.

## Features

### 🛍️ E-commerce Management
- **Dashboard**: Overview with revenue analytics, pending orders, and low stock alerts
- **Product Management**: CRUD operations for products with category assignment
- **Category Management**: Hierarchical category system with parent-child relationships
- **Customer Management**: Complete customer database with contact information
- **Order Management**: Order lifecycle management with status tracking

### 👥 User Management
- **User Administration**: Create, edit, and manage user accounts
- **Role-based Access**: Admin-only access to all management features
- **Authentication**: Secure login system with session management

### 📋 Task Management
- **Task List**: Simple task tracking with due dates
- **Task Creation**: Quick task entry with description and due date

## Technology Stack

### Frontend
- **Vaadin 24**: Modern web framework with React TypeScript
- **React 18**: Component-based UI development
- **TypeScript**: Type-safe JavaScript development
- **Vaadin Components**: Rich UI component library

### Backend
- **Spring Boot 3.5**: Java-based application framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database access layer
- **SQLite**: Lightweight, file-based database
- **Hibernate**: Object-relational mapping

### Database
- **SQLite**: File-based database for easy deployment
- **Auto-schema**: Automatic table creation and updates
- **Sample Data**: Pre-populated with sample categories, products, customers, and orders

## Project Structure

```
src/
├── main/
│   ├── frontend/
│   │   ├── components/          # Reusable UI components
│   │   ├── views/              # Page components
│   │   │   ├── ecommerce-dashboard.tsx
│   │   │   ├── product-management.tsx
│   │   │   ├── category-management.tsx
│   │   │   ├── customer-management.tsx
│   │   │   ├── order-management.tsx
│   │   │   ├── user-management.tsx
│   │   │   └── task-list.tsx
│   │   ├── types.ts            # TypeScript interfaces
│   │   └── security/           # Authentication utilities
│   └── java/
│       └── com/example/application/
│           ├── ecommerce/      # E-commerce domain and services
│           ├── usermanagement/ # User management
│           ├── taskmanagement/ # Task management
│           └── security/       # Security configuration
```

## Getting Started

### Prerequisites
- Java 19 or higher
- Node.js 18 or higher
- Maven 3.6 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vaadin-react-ts
   ```

2. **Start the application**
   ```bash
   mvn spring-boot:run
   ```

3. **Access the application**
   - Open your browser to `http://localhost:8080`
   - Login with admin credentials (see below)

### Default Login
- **Username**: `admin`
- **Password**: `admin`

## Database

The application uses SQLite with automatic schema generation. The database file (`vaadin-demo.db`) will be created automatically in the project root directory.

### Sample Data
The application includes sample data for testing:
- **Categories**: Electronics, Clothing, Books with subcategories
- **Products**: Sample products with pricing and stock information
- **Customers**: Sample customer records
- **Orders**: Sample orders with different statuses

## Development

### Frontend Development
- **TypeScript**: All components use proper TypeScript interfaces
- **Vaadin Components**: Rich UI components with consistent styling
- **React Hooks**: Modern React patterns with signals for state management

### Backend Development
- **Spring Boot**: RESTful services with Hilla integration
- **JPA Entities**: Properly mapped database entities
- **Service Layer**: Business logic separated from controllers
- **Security**: Role-based access control

### Code Quality
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error handling throughout
- **Clean Code**: Removed all `@ts-ignore` and `@ts-nocheck` directives
- **Proper Imports**: Cleaned up unused imports

## Deployment

### Development
```bash
mvn spring-boot:run
```

### Production
```bash
mvn clean package
java -jar target/vaadin-react-ts-1.0-SNAPSHOT.jar
```

## Configuration

### Application Properties
- **Database**: SQLite with auto-schema generation
- **Security**: Admin-only access to management features
- **UI**: Vaadin components with modern styling

### Customization
- **Branding**: Update application name and logo in `@layout.tsx`
- **Database**: Modify `application.properties` for different database
- **Security**: Configure authentication in security package

## Contributing

1. Follow the existing code structure
2. Use proper TypeScript interfaces from `types.ts`
3. Maintain consistent error handling
4. Test all CRUD operations
5. Update documentation as needed

## License

This project is licensed under the MIT License.
