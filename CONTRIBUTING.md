# Contributing to E-commerce Admin Dashboard

Thank you for your interest in contributing to the E-commerce Admin Dashboard! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites
- Java 19 or higher
- Node.js 18 or higher
- Maven 3.6 or higher
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/vaadin-react-ts.git
   cd vaadin-react-ts
   ```

2. **Set up your development environment**
   ```bash
   mvn clean install
   ```

3. **Start the development server**
   ```bash
   mvn spring-boot:run
   ```

## Development Guidelines

### Code Style

#### Java
- Follow Java naming conventions
- Use meaningful variable and method names
- Add Javadoc comments for public methods
- Keep methods small and focused
- Use proper exception handling

#### TypeScript/React
- Use TypeScript interfaces from `src/main/frontend/types.ts`
- Follow React functional component patterns
- Use Vaadin components consistently
- Implement proper error handling
- Add proper TypeScript types

### Project Structure

```
src/main/
├── frontend/
│   ├── components/          # Reusable UI components
│   ├── views/              # Page components
│   ├── types.ts            # TypeScript interfaces
│   └── security/           # Authentication utilities
└── java/
    └── com/example/application/
        ├── ecommerce/      # E-commerce domain and services
        ├── usermanagement/ # User management
        ├── taskmanagement/ # Task management
        └── security/       # Security configuration
```

### Adding New Features

1. **Create the backend service** (if needed)
   - Add domain entities in appropriate package
   - Create repository interface
   - Implement service class with proper annotations
   - Add security configuration if needed

2. **Create the frontend view**
   - Add new view file in `src/main/frontend/views/`
   - Use proper TypeScript interfaces
   - Implement CRUD operations
   - Add proper error handling

3. **Update navigation**
   - Add menu configuration in view config
   - Update layout if needed

### Database Changes

1. **Entity modifications**
   - Update JPA entities with proper annotations
   - Add migration scripts if needed
   - Update sample data in `DataInitializationService`

2. **Repository methods**
   - Add custom query methods if needed
   - Use proper Spring Data JPA patterns

### Testing

1. **Backend tests**
   - Add unit tests for services
   - Add integration tests for repositories
   - Test security configurations

2. **Frontend tests**
   - Test component rendering
   - Test user interactions
   - Test error scenarios

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Provide a clear description of changes
   - Include screenshots if UI changes
   - Reference any related issues

### Commit Message Format

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Issue Reporting

When reporting issues, please include:

1. **Environment details**
   - Java version
   - Node.js version
   - Operating system
   - Browser (if frontend issue)

2. **Steps to reproduce**
   - Clear, step-by-step instructions
   - Expected vs actual behavior

3. **Additional context**
   - Screenshots if applicable
   - Error messages
   - Console logs

## Code Review Process

1. **Review checklist**
   - Code follows style guidelines
   - Proper error handling
   - Tests included
   - Documentation updated
   - No security vulnerabilities

2. **Review comments**
   - Be constructive and helpful
   - Suggest improvements
   - Ask clarifying questions

## Security Guidelines

1. **Authentication**
   - All management features require admin access
   - Use proper Spring Security annotations
   - Validate user input

2. **Data validation**
   - Validate all user inputs
   - Use proper JPA constraints
   - Implement proper error handling

## Release Process

1. **Version bump**
   - Update version in `pom.xml`
   - Update CHANGELOG.md

2. **Testing**
   - Run all tests
   - Test in different environments
   - Verify database migrations

3. **Documentation**
   - Update README.md if needed
   - Update API documentation

## Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check README.md and inline code comments

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to the E-commerce Admin Dashboard! 🚀 