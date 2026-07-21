# School Assignment - Full-Stack Web Application

![Python](https://img.shields.io/badge/Python-3.x-blue?style=flat&logo=python)
![Django](https://img.shields.io/badge/Django-Web%20Framework-green?style=flat&logo=django)
![HTML/CSS/JavaScript](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-orange?style=flat&logo=html5)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)

## Project Title

**School Assignment Management System** - A comprehensive full-stack web application designed for academic management, combining Django backend with modern frontend technologies for an interactive student portal.

## Overview

School Assignment is a complete web application built with Django that provides a centralized platform for managing school-related tasks, profiles, authentication, and communication. The project implements a multi-page architecture with user authentication, admin dashboard, and various interactive features including profile management, contact functionality, and task organization. It serves as an educational project demonstrating best practices in full-stack web development.

## Features

- **User Authentication System** - Secure sign-up and login functionality with session management
- **User Profiles** - Personalized user profile pages with customizable information
- **Admin Dashboard** - Administrative interface for managing users and platform content
- **Contact System** - Contact page with messaging capabilities
- **Task Management** - Organized task assignment and tracking system
- **Responsive Design** - Mobile-friendly frontend with CSS styling
- **SQLite Database** - Persistent data storage with Django ORM
- **Multi-page Architecture** - Organized navigation across different sections

## Technologies Used

| Category | Technology |
|----------|-----------|
| **Backend** | Python 3.x, Django |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Database** | SQLite3 |
| **Server** | Django Development Server |
| **Package Manager** | pip |
| **Version Control** | Git |

## Project Structure

```
School_Assignment/
├── Backend/                 # Django project configuration
│   ├── settings.py         # Django settings and configuration
│   └── urls.py             # URL routing configuration
├── accounts/               # User authentication app
│   ├── models.py          # User-related database models
│   └── views.py           # Authentication views
├── HOME_PAGE/              # Landing page section
├── Profile Page/           # User profile section
├── Contact Us Page/        # Contact/messaging page
├── About_us/               # About page section
├── SignUp_Login/           # Authentication frontend
├── admin dashboard/        # Admin interface
├── Global.css              # Global stylesheet
├── manage.py              # Django management script
├── db.sqlite3             # SQLite database
├── starter.py             # Application startup script
└── venv/                  # Python virtual environment
```

## Installation

### Prerequisites

- Python 3.x installed on your system
- pip package manager
- Git for version control
- Virtual environment (venv) support

### Clone Instructions

```bash
git clone https://github.com/kenzy-mohamed66/School_Assignment.git
cd School_Assignment
```

### Dependency Installation

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install required dependencies:

```bash
pip install django
# Or from a requirements.txt if available
pip install -r requirements.txt
```

### Build Instructions

The application uses Django's built-in development server. No compilation is required:

```bash
python manage.py migrate       # Apply database migrations
python manage.py runserver    # Start development server
```

The application will be available at `http://127.0.0.1:8000/`

## Usage

### Running the Application

1. Ensure you are in the project root directory
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Run the development server:
   ```bash
   python manage.py runserver
   ```
4. Open your browser and navigate to `http://127.0.0.1:8000/`

### Example Workflows

**User Registration:**
- Navigate to the Sign Up page
- Enter your details (username, email, password)
- Submit the form to create a new account

**Accessing Your Profile:**
- Log in with your credentials
- Click on "Profile" in the navigation menu
- View and edit your profile information

**Contacting Support:**
- Navigate to "Contact Us" page
- Fill in the contact form with your message
- Submit to send inquiry

**Admin Dashboard:**
- Log in with admin credentials
- Access the admin dashboard to manage users and content

## Configuration

### Environment Variables

Currently, the application uses default Django settings. To be added as environment variables:

- `DEBUG` - Debug mode toggle (development/production)
- `SECRET_KEY` - Django secret key for security
- `ALLOWED_HOSTS` - Allowed hostnames/domains
- `DATABASE_URL` - Database connection string (if applicable)

### Configuration Files

- **Backend/settings.py** - Main Django configuration file
  - Database settings
  - Installed applications
  - Middleware configuration
  - Static files configuration

- **Global.css** - Global stylesheet for all pages
  - Color schemes and typography
  - Layout and responsive design

## Architecture Overview

The application follows a **Model-View-Template (MVT)** architecture provided by Django:

### Main Components

1. **Backend (Django)**
   - Handles HTTP requests and responses
   - Manages business logic and database operations
   - Provides API endpoints for frontend

2. **Frontend (HTML/CSS/JavaScript)**
   - User interface across multiple pages
   - Client-side form validation
   - Interactive elements and navigation

3. **Database (SQLite)**
   - Stores user account information
   - Persists profile data, messages, and tasks
   - Managed through Django ORM

### System Flow

```
User Browser
    ↓
Frontend (HTML/CSS/JS)
    ↓
Django URL Router
    ↓
Views (Business Logic)
    ↓
Models (Database Access)
    ↓
SQLite Database
```

## Development

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Implement your changes
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Submit a pull request

### Coding Standards

- Follow PEP 8 Python style guide
- Use meaningful variable and function names
- Add comments for complex logic
- Keep views and models organized
- Use Django's built-in features and conventions

### Testing Instructions

```bash
# Run Django tests
python manage.py test

# Check for syntax errors
python manage.py check

# Run specific test module
python manage.py test accounts
```

## To Be Added

The following items are pending implementation or documentation:

- [ ] Automated testing suite
- [ ] API documentation
- [ ] Deployment guide (production setup)
- [ ] User authentication with email verification
- [ ] Password reset functionality
- [ ] Permission and role-based access control
- [ ] Real-time notifications
- [ ] Mobile application integration
- [ ] Search and filter functionality
- [ ] Data export/import features

## Future Improvements

1. **Authentication Enhancements**
   - Implement email verification on signup
   - Add two-factor authentication (2FA)
   - OAuth integration (Google, GitHub)

2. **User Experience**
   - Implement real-time notifications
   - Add task deadline tracking
   - Create a mobile-responsive dashboard

3. **Performance**
   - Database query optimization
   - Implement caching mechanisms
   - API rate limiting

4. **Features**
   - Assignment submission and grading system
   - Discussion forums
   - File upload and storage
   - Calendar integration
   - Email notifications

5. **Infrastructure**
   - Docker containerization
   - CI/CD pipeline setup
   - PostgreSQL migration from SQLite
   - Cloud deployment (AWS, Heroku, Azure)

6. **Security**
   - CSRF protection enhancement
   - SQL injection prevention review
   - XSS protection implementation
   - Security headers configuration

---

**Last Updated:** May 18, 2026  
**Created:** February 27, 2026  
**Repository:** [School_Assignment](https://github.com/kenzy-mohamed66/School_Assignment)
