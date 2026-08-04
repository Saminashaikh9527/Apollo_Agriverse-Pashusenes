# AgroLens PLF
## Software Requirements Specification (SRS)

**Project Name:** AgroLens PLF (Precision Livestock Farming)

**Version:** 1.0

**Prepared By:** Team AgroLens PLF

**Project Duration:** 4 Weeks

---

# 1. Introduction

## 1.1 Purpose

AgroLens PLF (Precision Livestock Farming) is an AI-powered livestock management platform designed specifically for small and medium-scale Indian farmers. The system integrates Artificial Intelligence (AI), Machine Learning (ML), Computer Vision (CNN/YOLO), Internet of Things (IoT), and cloud technologies to monitor livestock health, automate farm management, improve productivity, and assist farmers in making data-driven decisions.

The platform aims to digitize livestock farming by replacing manual record keeping with an intelligent management system capable of monitoring animal behaviour, predicting production, generating alerts, and providing analytics.

---

## 1.2 Problem Statement

Livestock farmers in India face several challenges:

- Manual farm record management
- Delayed disease detection
- Lack of continuous animal monitoring
- Low productivity due to poor health management
- Difficulty tracking milk, egg, and wool production
- No centralized system for vaccination records
- Limited access to production analytics
- Uncertainty in market prices
- Inefficient feed management
- Financial losses due to late decision-making

Most existing solutions focus only on dairy farming or poultry farming. Very few platforms provide a unified AI-based management system for multiple livestock species suitable for small-scale Indian farmers.

---

## 1.3 Proposed Solution

AgroLens PLF is a smart livestock management platform that combines AI-powered animal monitoring, machine learning predictions, IoT sensor integration, and farm management tools into a single web-based application.

The system will support livestock such as:

- Cows
- Buffaloes
- Goats
- Sheep
- Chickens

### Key Features

- Animal identification
- Animal counting
- Behaviour monitoring
- Health record management
- Vaccination tracking
- Milk production management
- Egg production management
- Wool production management
- Feed management
- Market price monitoring
- AI-powered production prediction
- Reports and analytics

---

## 1.4 Vision

To become an affordable and intelligent livestock management platform that empowers Indian farmers through AI-driven decision making, improved animal welfare, increased productivity, and sustainable farming practices.

---

## 1.5 Mission

Our mission is to build an intelligent digital ecosystem that enables farmers to monitor livestock, improve farm efficiency, predict production, reduce operational losses, and simplify daily farm management using modern technologies.

---

## 1.6 Objectives

The primary objectives of AgroLens PLF are:

- Digitize livestock farm management.
- Detect and identify livestock using AI and Computer Vision.
- Monitor animal behaviour continuously.
- Improve disease detection and health monitoring.
- Predict milk, egg, and wool production.
- Maintain vaccination schedules and medical records.
- Track feed consumption and inventory.
- Generate intelligent reports and analytics.
- Support market-based decision making.
- Increase farmer productivity and profitability.

---

## 1.7 Scope

The AgroLens PLF system includes the following major modules.

### Farm Management

- Farm registration
- Farm profile management
- Multiple farms under one account
- Farm location and shed management

### Animal Management

- Animal registration
- Animal identification
- Breed management
- Animal profile
- Animal lifecycle history

### Health Management

- Health records
- Disease history
- Vaccination schedules
- Veterinary visits
- Treatment records

### Production Management

- Milk production management
- Egg production management
- Wool production management

### Feed Management

- Feed inventory
- Feed schedules
- Feed consumption tracking
- Feed cost analysis

### AI Module

- Animal detection
- Animal counting
- Behaviour recognition
- Health anomaly detection

### Machine Learning Module

- Milk production prediction
- Egg production prediction
- Wool production prediction
- Disease risk prediction
- Feed requirement prediction
- Market trend prediction

### Market Intelligence

- Milk market prices
- Egg market prices
- Wool market prices
- Livestock market trends

### Reports & Analytics

- Daily reports
- Weekly reports
- Monthly reports
- Productivity analysis
- Financial analysis
- Dashboard visualization

---

## 1.8 Expected Benefits

The proposed system is expected to provide the following benefits:

- Reduce manual paperwork.
- Improve livestock health monitoring.
- Increase production efficiency.
- Support data-driven farm management.
- Reduce operational losses.
- Provide early alerts for health issues.
- Improve decision making using AI and ML.
- Enhance farmer profitability.
- Encourage sustainable livestock farming.

---

## 1.9 Technologies Used

| Category | Technology |
|----------|------------|
| Frontend | React + Vite |
| Backend | FastAPI |
| Database | PostgreSQL |
| AI | YOLOv11, OpenCV |
| Machine Learning | Scikit-learn, XGBoost |
| Deep Learning | PyTorch |
| Authentication | JWT |
| Charts | Chart.js |
| Version Control | Git & GitHub |
| Deployment | Docker (Future) |

---

## 1.10 Document Overview

This Software Requirements Specification (SRS) defines the functional and non-functional requirements of AgroLens PLF. It serves as the primary reference document for system design, database development, backend APIs, frontend implementation, AI and ML integration, testing, deployment, and future enhancements.

# 2. Overall Description

## 2.1 Product Perspective

AgroLens PLF (Precision Livestock Farming) is an AI-powered livestock management platform developed to support small and medium-scale livestock farmers in India. The platform integrates Artificial Intelligence (AI), Machine Learning (ML), Computer Vision (CNN/YOLO), Internet of Things (IoT), and cloud-based technologies to provide a complete digital solution for farm management.

The system enables farmers to monitor livestock health, production, feeding, vaccinations, and farm operations through a centralized dashboard. AI models analyze images and videos captured from cameras to identify animals, monitor behaviour, count livestock, and detect abnormal activities. Machine Learning models provide production predictions, health risk assessments, and market trend analysis.

The platform is designed as a modular and scalable system so that new livestock species, sensors, AI models, and services can be integrated in future versions.

---

## 2.2 Product Functions

AgroLens PLF provides the following core functionalities:

### User Management
- User registration and login
- Secure authentication
- Farmer profile management
- Role-based access control

### Farm Management
- Farm registration
- Multiple farm support
- Shed and location management
- Farm information management

### Animal Management
- Animal registration
- Animal identification
- Breed management
- Animal profile management
- Animal lifecycle records

### Health Management
- Disease history
- Vaccination management
- Veterinary visit records
- Medical treatment records
- Health alerts

### Production Management
- Milk production tracking
- Egg production tracking
- Wool production tracking
- Daily production reports

### Feed Management
- Feed inventory
- Feed schedules
- Feed consumption monitoring
- Feed cost management

### AI Monitoring
- Animal detection
- Animal counting
- Behaviour recognition
- Activity monitoring
- Health anomaly detection

### Machine Learning
- Milk production prediction
- Egg production prediction
- Wool production prediction
- Disease risk prediction
- Feed requirement prediction
- Market price prediction

### Market Intelligence
- Milk market prices
- Egg market prices
- Wool market prices
- Livestock market trends

### Reports & Analytics
- Dashboard
- Daily reports
- Weekly reports
- Monthly reports
- Productivity analysis
- Financial reports

---

## 2.3 User Classes and Characteristics

### Farmer
Primary user of the system responsible for managing farms, livestock, production records, and daily activities.

### Farm Manager
Manages multiple farms and supervises farm operations, workers, and production reports.

### Veterinarian
Maintains health records, vaccinations, disease diagnosis, treatment recommendations, and medical history.

### Administrator
Manages users, system configuration, permissions, master data, and overall platform administration.

### Researcher (Future Scope)
Uses anonymized livestock data for research, AI model improvement, and agricultural analytics.

---

## 2.4 Operating Environment

The AgroLens PLF system will operate in the following environment:

### Client Side
- Windows 10/11
- Android smartphones
- Modern web browsers (Chrome, Edge, Firefox)

### Server Side
- Ubuntu Linux
- Windows Server
- Docker containers (future deployment)

### Backend
- FastAPI
- Python 3.11+

### Frontend
- React
- Vite
- JavaScript

### Database
- PostgreSQL

### AI Frameworks
- YOLOv11
- OpenCV
- PyTorch

### Machine Learning
- Scikit-learn
- XGBoost

---

## 2.5 Design and Implementation Constraints

The following constraints are considered during development:

- Four-week development timeline
- Small development team (4 members)
- Limited computing resources
- Limited availability of livestock datasets
- Internet connectivity may be unreliable in rural areas
- Initial deployment will be web-based
- IoT devices are optional for the first version
- AI accuracy depends on dataset quality
- Market data availability depends on external sources

---

## 2.6 User Needs

The system should help farmers to:

- Reduce manual paperwork.
- Monitor livestock efficiently.
- Improve milk, egg, and wool production.
- Detect abnormal animal behaviour.
- Receive vaccination reminders.
- Maintain digital farm records.
- Predict future production.
- Track expenses and income.
- Access reports from anywhere.
- Improve overall farm productivity.

---

## 2.7 Assumptions and Dependencies

### Assumptions

- Farmers have access to smartphones or computers.
- Internet connectivity is available for synchronization.
- Users provide accurate livestock information.
- AI models are trained using quality datasets.
- Cameras are positioned correctly for animal monitoring.

### Dependencies

- PostgreSQL database
- FastAPI backend services
- React frontend
- AI models (YOLO/OpenCV)
- Machine Learning models
- External market price APIs (future)
- IoT sensors (optional)
- Camera devices

---

## 2.8 Future Scope

Future versions of AgroLens PLF may include:

- Mobile application (Android & iOS)
- Real-time IoT sensor integration
- RFID and QR code animal identification
- Drone-based livestock monitoring
- Voice assistant in regional languages
- WhatsApp notification system
- Veterinary teleconsultation
- Disease outbreak prediction
- Carbon footprint monitoring
- Livestock insurance integration
- Government scheme integration
- Marketplace for buying and selling livestock
- Blockchain-based livestock traceability

---

## 2.9 System Overview

AgroLens PLF follows a modular architecture where different components work together.

```
Farmer
   │
   ▼
React Web Application
   │
REST API
   │
FastAPI Backend
   │
├── PostgreSQL Database
├── AI Module (YOLO/OpenCV)
├── ML Module
├── Report Module
└── Notification Module
```

Each module communicates through secure REST APIs. The backend manages business logic, stores data in PostgreSQL, processes AI and ML requests, and provides responses to the frontend dashboard.

# 3. Functional Requirements

## 3.1 Overview

This chapter describes the functional requirements of AgroLens PLF. Each functional requirement specifies the services and operations that the system must provide to users. These requirements define the expected behavior of the platform.

---

# 3.2 User Authentication Module

## Description

The system shall provide secure authentication and authorization for all users.

### Functional Requirements

- User registration
- User login
- Password reset
- Change password
- User profile management
- Logout
- Role-based access control

### Inputs

- Name
- Email
- Phone Number
- Password

### Outputs

- Successful authentication
- User dashboard
- Authentication error messages

---

# 3.3 Farm Management Module

## Description

The system shall allow users to register and manage one or more farms.

### Functional Requirements

- Add farm
- Edit farm
- Delete farm
- View farm information
- Manage sheds
- Farm location management

### Farm Information

- Farm Name
- Owner Name
- Address
- GPS Location
- Total Area
- Number of Animals

---

# 3.4 Animal Management Module

## Description

The system shall maintain complete digital records of livestock.

### Functional Requirements

- Add animal
- Edit animal
- Delete animal
- View animal profile
- Search animals
- Animal identification
- Animal history

### Animal Information

- Animal ID
- RFID / QR Code
- Species
- Breed
- Gender
- Date of Birth
- Weight
- Color
- Status

Supported Animals

- Cow
- Buffalo
- Goat
- Sheep
- Chicken

---

# 3.5 Health Management Module

## Description

The system shall maintain health records for every animal.

### Functional Requirements

- Health check records
- Disease records
- Vaccination records
- Medicine records
- Veterinary visit records
- Health alerts

### Stored Information

- Disease Name
- Symptoms
- Diagnosis Date
- Medicines
- Doctor Name
- Recovery Status

---

# 3.6 Production Management Module

## Description

The system shall record livestock production data.

### Milk Production

- Daily milk collection
- Weekly production
- Monthly production
- Animal-wise production

### Egg Production

- Daily egg collection
- Weekly reports
- Monthly reports

### Wool Production

- Wool harvesting records
- Production history
- Annual reports

---

# 3.7 Feed Management Module

## Description

The system shall manage livestock feed inventory and consumption.

### Functional Requirements

- Feed inventory
- Feed schedule
- Feed consumption
- Feed stock alerts
- Feed purchase history

Stored Information

- Feed Type
- Quantity
- Cost
- Supplier
- Expiry Date

---

# 3.8 AI Monitoring Module

## Description

The AI module shall analyze images and videos captured by cameras.

### Functional Requirements

- Animal detection
- Animal counting
- Animal identification
- Behaviour recognition
- Activity monitoring
- Health anomaly detection

Supported Behaviours

- Standing
- Walking
- Eating
- Drinking
- Sleeping
- Running
- Grazing
- Fighting
- Isolation
- Abnormal movement

---

# 3.9 Machine Learning Module

## Description

The ML module shall generate predictions using historical farm data.

### Predictions

- Milk production prediction
- Egg production prediction
- Wool production prediction
- Disease risk prediction
- Feed requirement prediction
- Production trend analysis
- Market price prediction

---

# 3.10 Market Intelligence Module

## Description

The system shall provide market information to farmers.

### Functional Requirements

- Milk market prices
- Egg market prices
- Wool market prices
- Livestock market prices
- Historical trends
- Price comparison

---

# 3.11 Reports & Analytics Module

## Description

The platform shall generate reports for farm management.

### Reports

- Daily Report
- Weekly Report
- Monthly Report
- Annual Report

### Analytics

- Production Analysis
- Health Analysis
- Feed Analysis
- Financial Analysis
- Animal Performance
- Profit & Loss

---

# 3.12 Notification Module

The system shall generate notifications for important events.

Notifications include

- Vaccination reminders
- Medicine reminders
- Health alerts
- Low feed alerts
- Low production alerts
- Market price updates
- AI anomaly alerts

---

# 3.13 Administration Module

The administrator shall manage the overall system.

### Functional Requirements

- Manage users
- Manage farms
- Manage livestock
- Manage master data
- View reports
- Monitor system usage
- Backup database
- Restore database

---

# 3.14 Audit and Activity Logs

The system shall maintain logs for important activities.

### Logged Activities

- User login
- User logout
- Animal registration
- Health updates
- Production updates
- Feed updates
- AI detections
- ML predictions
- Database changes

---

# 3.15 Functional Requirement Summary

| Module | Description |
|----------|------------|
| User Authentication | User login and security |
| Farm Management | Farm information |
| Animal Management | Animal records |
| Health Management | Health monitoring |
| Production Management | Milk, Egg, Wool |
| Feed Management | Feed inventory |
| AI Monitoring | Detection & Behaviour |
| Machine Learning | Predictions |
| Market Intelligence | Market trends |
| Reports & Analytics | Reports & Dashboard |
| Notifications | Alerts |
| Administration | System management |

# 4. Non-Functional Requirements

## 4.1 Overview

Non-functional requirements describe the quality attributes, performance expectations, security standards, reliability, and operational constraints of the AgroLens PLF system. These requirements ensure that the platform is secure, scalable, maintainable, and easy to use.

---

## 4.2 Performance Requirements

The system shall:

- Support at least 100 concurrent users in the initial release.
- Load dashboard pages within 3 seconds under normal network conditions.
- Process AI image detection requests within 5 seconds.
- Generate reports within 10 seconds.
- Handle large livestock datasets efficiently.
- Support future scaling for thousands of farms.

---

## 4.3 Reliability Requirements

The system shall:

- Operate continuously with minimal downtime.
- Prevent data corruption during unexpected failures.
- Recover automatically after server restart.
- Preserve historical livestock records.
- Maintain data consistency across all modules.

---

## 4.4 Availability Requirements

The platform should be available:

- 24 hours a day
- 7 days a week

Planned maintenance should have minimal impact on users.

---

## 4.5 Security Requirements

The system shall provide:

- Secure user authentication
- Role-based authorization
- Encrypted passwords
- Secure API communication using HTTPS
- Protection against unauthorized access
- Session management
- Input validation
- SQL Injection protection
- Cross-Site Scripting (XSS) protection
- Cross-Site Request Forgery (CSRF) protection

Sensitive user information shall never be stored in plain text.

---

## 4.6 Usability Requirements

The user interface shall:

- Be simple and easy to understand.
- Support users with minimal technical knowledge.
- Use clear icons and labels.
- Provide quick navigation.
- Display meaningful error messages.
- Support responsive design for desktop and mobile devices.

---

## 4.7 Maintainability Requirements

The system shall:

- Follow modular architecture.
- Maintain clean and readable source code.
- Include documentation for APIs.
- Support future feature additions.
- Follow coding standards.
- Support version control using Git.

---

## 4.8 Scalability Requirements

The system shall be designed to support:

- More livestock species
- Additional farms
- Additional users
- New AI models
- IoT device integration
- Mobile applications
- Cloud deployment

without requiring major architectural changes.

---

## 4.9 Portability Requirements

The application should operate on:

### Client

- Windows
- Android
- Linux
- macOS

### Server

- Windows Server
- Ubuntu Linux
- Docker Containers

Supported browsers:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

---

## 4.10 Compatibility Requirements

The system shall integrate with:

- PostgreSQL
- FastAPI
- React
- OpenCV
- YOLO
- PyTorch
- Scikit-learn
- XGBoost

Future compatibility:

- IoT Sensors
- RFID Readers
- QR Code Systems
- Government APIs
- Weather APIs
- Market Price APIs

---

## 4.11 Data Integrity Requirements

The system shall ensure:

- No duplicate animal IDs
- Accurate production records
- Proper relationship between farms and animals
- Data validation before storage
- Automatic timestamp generation
- Backup before major updates

---

## 4.12 Backup and Recovery Requirements

The platform shall:

- Support automatic database backups.
- Allow manual backup.
- Allow database restoration.
- Prevent accidental data loss.
- Store backup history.

---

## 4.13 Privacy Requirements

The platform shall:

- Protect farmer information.
- Protect livestock records.
- Restrict unauthorized access.
- Store passwords securely.
- Maintain user confidentiality.

---

## 4.14 AI Requirements

The AI module shall:

- Detect livestock from images.
- Count animals accurately.
- Recognize animal behaviour.
- Detect abnormal activities.
- Generate confidence scores.
- Process both images and videos.

---

## 4.15 Machine Learning Requirements

The ML module shall:

- Predict milk production.
- Predict egg production.
- Predict wool production.
- Predict disease risks.
- Predict feed requirements.
- Analyze historical production trends.

Predictions should improve as more historical data becomes available.

---

## 4.16 Error Handling Requirements

The system shall:

- Display user-friendly error messages.
- Log application errors.
- Prevent system crashes.
- Handle invalid inputs gracefully.
- Recover from temporary failures whenever possible.

---

## 4.17 Logging Requirements

The platform shall log:

- User logins
- User logouts
- Animal registrations
- Health updates
- Production updates
- AI detections
- ML predictions
- Database changes
- System errors

---

## 4.18 Future Expansion Requirements

Future versions of AgroLens PLF should support:

- Drone-based livestock monitoring
- Smart wearable collars
- GPS animal tracking
- WhatsApp alerts
- SMS notifications
- Voice assistant
- Regional language support
- Blockchain-based animal traceability
- Government livestock scheme integration
- Veterinary teleconsultation

---

## 4.19 Non-Functional Requirement Summary

| Category | Requirement |
|----------|-------------|
| Performance | Fast response and efficient processing |
| Reliability | Stable and consistent operation |
| Availability | 24×7 availability |
| Security | Authentication, authorization, encryption |
| Usability | Easy-to-use interface |
| Maintainability | Modular and documented code |
| Scalability | Supports future growth |
| Compatibility | Works with modern technologies |
| Backup | Automatic recovery and backup |
| Privacy | Secure user and livestock data |
| AI | Detection and behaviour analysis |
| ML | Intelligent prediction models |

# 5. Use Cases & User Stories

## 5.1 Overview

This chapter describes the interactions between users and the AgroLens PLF system. It identifies different user roles, their responsibilities, and the actions they can perform within the platform.

---

# 5.2 Actors

The primary actors of the system are:

- Farmer
- Farm Manager
- Veterinarian
- Administrator
- AI System
- Machine Learning System

---

# 5.3 Farmer Use Cases

The farmer is the primary user of AgroLens PLF.

### Farmer can:

- Register an account
- Login securely
- Manage profile
- Register farms
- Add livestock
- View livestock information
- Record milk production
- Record egg production
- Record wool production
- Record feed consumption
- View health records
- Receive vaccination reminders
- View AI detection results
- View production predictions
- View reports
- View market prices
- Logout

---

# 5.4 Farm Manager Use Cases

Farm managers supervise daily farm operations.

### Farm Manager can:

- Manage farm information
- Manage workers
- Add livestock
- Update production records
- Generate reports
- Monitor farm performance
- View dashboards

---

# 5.5 Veterinarian Use Cases

Veterinarians maintain animal health records.

### Veterinarian can:

- View animal profile
- Add health records
- Record diseases
- Record treatments
- Schedule vaccinations
- Update recovery status
- View medical history

---

# 5.6 Administrator Use Cases

The administrator controls the entire system.

### Administrator can:

- Manage users
- Manage farms
- Manage livestock
- View system reports
- Monitor AI performance
- Manage master data
- Backup database
- Restore database
- Configure system settings

---

# 5.7 AI System Use Cases

The AI module automatically performs computer vision tasks.

### AI System can:

- Detect livestock
- Count animals
- Identify species
- Recognize animal behaviour
- Detect abnormal activities
- Generate confidence scores
- Store AI results

---

# 5.8 Machine Learning Use Cases

The Machine Learning module analyzes historical farm data.

### ML Module can:

- Predict milk production
- Predict egg production
- Predict wool production
- Predict disease risks
- Predict feed requirements
- Predict market trends
- Generate recommendations

---

# 5.9 General Use Case Flow

```text
User Login
      │
      ▼
Dashboard
      │
      ├── Farm Management
      ├── Animal Management
      ├── Health Management
      ├── Production Management
      ├── Feed Management
      ├── AI Monitoring
      ├── ML Predictions
      ├── Reports
      └── Settings
```

---

# 5.10 User Stories

## Farmer

**As a farmer, I want to register my livestock so that I can maintain digital records.**

**As a farmer, I want AI to monitor my animals so that I receive alerts about abnormal behaviour.**

**As a farmer, I want to record milk production so that I can analyze productivity.**

**As a farmer, I want to receive vaccination reminders so that my livestock remains healthy.**

**As a farmer, I want production predictions so that I can plan future farm activities.**

---

## Farm Manager

**As a farm manager, I want to monitor multiple farms so that I can efficiently manage operations.**

**As a farm manager, I want to generate reports so that I can evaluate farm performance.**

---

## Veterinarian

**As a veterinarian, I want to maintain health records so that treatment history is always available.**

**As a veterinarian, I want to schedule vaccinations so that no animal misses its vaccination.**

---

## Administrator

**As an administrator, I want to manage users and system settings so that the platform remains secure and organized.**

---

# 5.11 Use Case Summary

| Actor | Major Use Cases |
|--------|-----------------|
| Farmer | Farm, Animal, Production, Health, Reports |
| Farm Manager | Farm Operations, Reports |
| Veterinarian | Health & Vaccination Management |
| Administrator | User & System Management |
| AI System | Detection & Behaviour Analysis |
| ML System | Predictions & Recommendations |

---

# 5.12 Future Use Cases

Future versions may include:

- Voice-based livestock management
- WhatsApp chatbot integration
- Drone-assisted livestock monitoring
- RFID animal tracking
- Smart wearable collar integration
- Government livestock portal integration
- Livestock marketplace
- Veterinary teleconsultation

# 6. System Architecture

## 6.1 Overview

AgroLens PLF follows a modular, layered architecture that separates the user interface, business logic, database, Artificial Intelligence (AI), Machine Learning (ML), and IoT services. This architecture makes the system scalable, maintainable, and easy to extend with future features.

The application follows a client-server model where users interact with a web application. Requests are processed by the backend, which communicates with the database, AI models, and ML services.

---

## 6.2 High-Level Architecture

```text
+-------------------------------------------------------+
|                   Farmer / User                        |
+-------------------------------------------------------+
                      |
                      v
+-------------------------------------------------------+
|          React Frontend (Web Dashboard)               |
+-------------------------------------------------------+
                      |
                 REST API (HTTPS)
                      |
                      v
+-------------------------------------------------------+
|                 FastAPI Backend                       |
+-------------------------------------------------------+
     |           |             |             |
     |           |             |             |
     v           v             v             v
PostgreSQL     AI Module     ML Module    Notification
 Database    (YOLO/OpenCV)  (Prediction)     Service
     |
     v
Stored Farm & Livestock Data
```

---

## 6.3 Frontend Architecture

The frontend provides an intuitive dashboard for farmers and administrators.

### Responsibilities

- User authentication
- Dashboard
- Farm management
- Animal management
- Health records
- Production records
- Feed management
- Reports and analytics
- AI result visualization
- Prediction dashboards

### Technologies

- React
- Vite
- JavaScript
- Chart.js
- Axios
- React Router

---

## 6.4 Backend Architecture

The backend is responsible for business logic and communication between all system components.

### Responsibilities

- User authentication
- API management
- Database operations
- AI service integration
- ML service integration
- Notification management
- Report generation
- Validation
- Error handling

### Technologies

- FastAPI
- SQLAlchemy
- JWT Authentication
- Pydantic
- Alembic

---

## 6.5 Database Architecture

The PostgreSQL database stores all application data.

### Main Entities

- Users
- Farms
- Animals
- Species
- Breeds
- Health Records
- Vaccinations
- Feed Records
- Milk Records
- Egg Records
- Wool Records
- Expenses
- Sales
- Alerts
- Predictions

Relationships between these entities ensure consistent and normalized data storage.

---

## 6.6 Artificial Intelligence Architecture

The AI module uses Computer Vision techniques to monitor livestock.

### Responsibilities

- Animal Detection
- Animal Counting
- Species Classification
- Behaviour Recognition
- Activity Monitoring
- Health Anomaly Detection

### Technologies

- YOLOv11
- OpenCV
- PyTorch

### Input

- Camera images
- CCTV videos

### Output

- Detected animals
- Behaviour labels
- Confidence score
- Alerts

---

## 6.7 Machine Learning Architecture

The Machine Learning module uses historical farm data to generate predictions.

### Predictions

- Milk production
- Egg production
- Wool production
- Disease risk
- Feed requirement
- Market price trends

### Technologies

- Scikit-learn
- XGBoost
- Pandas
- NumPy

### Input

- Historical production records
- Feed records
- Health records
- Market data

### Output

- Predictions
- Risk scores
- Recommendations

---

## 6.8 IoT Architecture (Future Scope)

The platform is designed to integrate IoT devices.

Possible IoT devices include:

- Smart collars
- RFID tags
- GPS trackers
- Temperature sensors
- Humidity sensors
- Feed sensors
- Water level sensors
- Environmental sensors

The IoT layer will collect real-time data and send it to the backend through APIs.

---

## 6.9 Data Flow

The overall data flow is as follows:

1. Farmer enters information or uploads an image/video.
2. React frontend sends the request to FastAPI.
3. FastAPI validates the request.
4. Data is stored in PostgreSQL.
5. If AI processing is required, the backend forwards the image/video to the AI module.
6. AI returns detection results.
7. If prediction is required, the backend sends data to the ML module.
8. ML returns prediction results.
9. Backend stores the results.
10. Frontend displays the results on the dashboard.

---

## 6.10 Security Architecture

Security mechanisms include:

- JWT Authentication
- Password hashing
- HTTPS communication
- Role-Based Access Control (RBAC)
- Secure API endpoints
- Input validation
- SQL Injection protection
- XSS protection
- CSRF protection
- Audit logging

---

## 6.11 Deployment Architecture

Initial deployment:

- React Frontend
- FastAPI Backend
- PostgreSQL Database

Future deployment:

- Docker
- Nginx
- Cloud hosting (AWS/Azure/GCP)
- CI/CD pipeline
- Automated backups

---

## 6.12 Architectural Principles

The AgroLens PLF architecture follows these principles:

- Modular Design
- Layered Architecture
- Scalability
- High Availability
- Security by Design
- Reusability
- Maintainability
- Extensibility
- Separation of Concerns

---

## 6.13 Architecture Summary

| Layer | Responsibility |
|--------|----------------|
| Presentation Layer | User Interface (React) |
| API Layer | FastAPI REST Services |
| Business Layer | Farm Management Logic |
| AI Layer | Detection & Behaviour Analysis |
| ML Layer | Predictions & Analytics |
| Data Layer | PostgreSQL Database |
| IoT Layer | Sensors & Devices (Future) |

# 7. Database Requirements

## 7.1 Overview

The AgroLens PLF platform uses PostgreSQL as its primary relational database management system. The database stores all farm, livestock, production, health, AI, and machine learning data in a structured and secure manner.

The database is designed using normalization principles to reduce redundancy, maintain consistency, and support future scalability.

---

## 7.2 Database Management System

| Property | Value |
|----------|-------|
| Database | PostgreSQL 18 |
| ORM | SQLAlchemy |
| Migration Tool | Alembic |
| Database Language | SQL |

---

## 7.3 Database Objectives

The database shall:

- Store farmer information securely.
- Store livestock records.
- Maintain production history.
- Maintain health records.
- Store vaccination schedules.
- Maintain feed inventory.
- Store AI detection history.
- Store ML prediction history.
- Generate reports efficiently.
- Support future expansion.

---

## 7.4 Main Database Entities

The AgroLens PLF database consists of the following major entities:

### User

Stores farmer and administrator information.

Attributes

- User ID
- Full Name
- Email
- Phone Number
- Password Hash
- Role
- Created At

---

### Farm

Stores farm information.

Attributes

- Farm ID
- User ID
- Farm Name
- Address
- District
- State
- Latitude
- Longitude
- Total Area

---

### Animal

Stores livestock details.

Attributes

- Animal ID
- Farm ID
- RFID
- Species
- Breed
- Gender
- Birth Date
- Weight
- Status

---

### Species

Stores supported livestock species.

Examples

- Cow
- Buffalo
- Goat
- Sheep
- Chicken

---

### Breed

Stores breed information.

Examples

- Gir
- Sahiwal
- Murrah
- Jamunapari
- Osmanabadi
- Merino

---

### Health Record

Stores medical history.

Attributes

- Health ID
- Animal ID
- Disease
- Symptoms
- Diagnosis
- Treatment
- Doctor
- Recovery Status

---

### Vaccination

Stores vaccination records.

Attributes

- Vaccination ID
- Animal ID
- Vaccine Name
- Date
- Next Due Date
- Veterinarian

---

### Feed Record

Stores feed management information.

Attributes

- Feed ID
- Animal ID
- Feed Type
- Quantity
- Feeding Time
- Cost

---

### Milk Production

Stores milk production records.

Attributes

- Milk Record ID
- Animal ID
- Date
- Morning Quantity
- Evening Quantity
- Total Milk

---

### Egg Production

Stores egg production.

Attributes

- Egg Record ID
- Animal ID / Flock ID
- Date
- Egg Count

---

### Wool Production

Stores wool production.

Attributes

- Wool Record ID
- Animal ID
- Date
- Wool Weight

---

### Market Price

Stores market information.

Attributes

- Market ID
- Product
- Market Name
- Date
- Price

Products

- Milk
- Eggs
- Wool
- Livestock

---

### AI Detection

Stores AI-generated detections.

Attributes

- Detection ID
- Animal ID
- Detection Type
- Confidence Score
- Image Path
- Detection Time

---

### ML Prediction

Stores machine learning prediction history.

Attributes

- Prediction ID
- Prediction Type
- Input Features
- Prediction Result
- Confidence
- Prediction Date

---

### Notification

Stores alerts.

Attributes

- Notification ID
- User ID
- Notification Type
- Message
- Status
- Created At

---

## 7.5 Entity Relationships

The major relationships are:

- One User can own multiple Farms.
- One Farm contains multiple Animals.
- One Animal has multiple Health Records.
- One Animal has multiple Vaccinations.
- One Animal has multiple Feed Records.
- One Animal has multiple Milk Records.
- One Animal has multiple Wool Records.
- One Flock can have multiple Egg Records.
- One Animal can have multiple AI Detections.
- One Animal can have multiple ML Predictions.

---

## 7.6 Primary Keys

Each table shall contain a unique primary key.

Examples

- user_id
- farm_id
- animal_id
- health_id
- vaccine_id
- milk_record_id

---

## 7.7 Foreign Keys

Foreign keys ensure relationships between tables.

Examples

- farm.user_id → users.user_id
- animal.farm_id → farms.farm_id
- health.animal_id → animals.animal_id
- vaccination.animal_id → animals.animal_id
- milk.animal_id → animals.animal_id

---

## 7.8 Data Validation Rules

The system shall validate:

- Email format
- Phone number
- Animal ID uniqueness
- Positive production values
- Valid vaccination dates
- Required fields
- Numeric ranges
- Duplicate records

---

## 7.9 Database Security

The database shall provide:

- Password encryption
- Role-based permissions
- Backup support
- Recovery support
- Audit logs
- Secure connections
- Data integrity

---

## 7.10 Backup Strategy

The database shall support:

- Daily backups
- Weekly backups
- Monthly backups
- Manual backup
- Automatic recovery

---

## 7.11 Future Database Expansion

Future versions may include:

- Sensor Data
- Weather Data
- GPS Tracking
- RFID Tracking
- Drone Images
- Audio Monitoring
- Financial Transactions
- Livestock Marketplace
- Insurance Records
- Government Scheme Data

---

## 7.12 Database Summary

| Table | Purpose |
|--------|---------|
| users | User information |
| farms | Farm information |
| animals | Animal records |
| species | Animal species |
| breeds | Breed details |
| health_records | Health history |
| vaccinations | Vaccination schedule |
| feed_records | Feed management |
| milk_records | Milk production |
| egg_records | Egg production |
| wool_records | Wool production |
| market_prices | Market information |
| ai_detections | AI detection history |
| ml_predictions | Prediction history |
| notifications | Alerts and reminders |

# 8. External Interface Requirements

## 8.1 Overview

This chapter describes the interfaces through which AgroLens PLF communicates with users, hardware devices, software components, databases, AI modules, and external services.

---

## 8.2 User Interface

The system shall provide a simple, responsive, and user-friendly interface for farmers and administrators.

### Main Screens

- Login Page
- Registration Page
- Dashboard
- Farm Management
- Animal Management
- Health Management
- Feed Management
- Milk Production
- Egg Production
- Wool Production
- AI Monitoring
- ML Predictions
- Reports & Analytics
- Notifications
- User Profile
- Settings

---

## 8.3 Hardware Interface

The system is designed to support the following hardware.

### Current Support

- Desktop Computer
- Laptop
- Mobile Phone
- CCTV Camera
- Mobile Camera

### Future Support

- RFID Reader
- QR Scanner
- GPS Tracker
- Smart Animal Collar
- Temperature Sensor
- Humidity Sensor
- Feed Sensor
- Water Level Sensor

---

## 8.4 Software Interface

The platform integrates with the following software technologies.

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite |
| Backend | FastAPI |
| Database | PostgreSQL |
| AI | YOLOv11 + OpenCV |
| Machine Learning | Scikit-learn + XGBoost |
| Deep Learning | PyTorch |
| Version Control | Git & GitHub |
| Deployment | Docker (Future) |

---

## 8.5 Database Interface

The backend communicates with PostgreSQL using SQLAlchemy ORM.

Operations include:

- Insert Records
- Update Records
- Delete Records
- Search Records
- Generate Reports

---

## 8.6 AI Interface

The AI module communicates with the backend.

### Input

- Animal Images
- CCTV Videos
- Camera Frames

### Output

- Animal Detection
- Animal Count
- Behaviour Detection
- Confidence Score
- Health Alerts

---

## 8.7 Machine Learning Interface

The ML module receives historical data.

### Input

- Production Records
- Feed Records
- Health Records
- Market Prices

### Output

- Milk Prediction
- Egg Prediction
- Wool Prediction
- Disease Risk Prediction
- Feed Requirement Prediction

---

## 8.8 Communication Interface

Communication between components uses:

- REST APIs
- HTTPS
- JSON
- JWT Authentication

---

## 8.9 External APIs (Future Scope)

Future integrations may include:

- Weather APIs
- Government Livestock APIs
- Market Price APIs
- SMS Gateway
- WhatsApp Business API
- Email Notification Service

---

## 8.10 Interface Summary

| Interface | Description |
|-----------|-------------|
| User Interface | Farmer Dashboard |
| Hardware Interface | Cameras & Sensors |
| Software Interface | React, FastAPI, PostgreSQL |
| Database Interface | SQLAlchemy |
| AI Interface | YOLO/OpenCV |
| ML Interface | Prediction Models |
| Communication | REST APIs |

# 9. System Diagrams

## 9.1 Overview

The following system diagrams are prepared separately to describe the design and architecture of AgroLens PLF.

The diagrams are available in the `docs/02_System_Design/` directory.

---

## 9.2 Diagram List

| Diagram | Description |
|----------|-------------|
| Context Diagram | Overall system context |
| Use Case Diagram | User interactions |
| DFD Level 0 | High-level data flow |
| DFD Level 1 | Detailed data flow |
| ER Diagram | Database relationships |
| Component Diagram | Software components |
| Deployment Diagram | Deployment architecture |
| Class Diagram | Backend object model |
| Sequence Diagram | Request processing flow |
| Activity Diagram | User workflow |

---

## 9.3 Diagram Purpose

These diagrams assist developers in understanding:

- System workflow
- Database relationships
- Software components
- User interactions
- Data movement
- Deployment architecture

They also serve as implementation references for frontend, backend, AI, and ML development.

# 10. References & Glossary

## 10.1 References

The following resources were used during the design and planning of AgroLens PLF.

1. PostgreSQL Documentation - https://www.postgresql.org/docs/
2. FastAPI Documentation - https://fastapi.tiangolo.com/
3. React Documentation - https://react.dev/
4. OpenCV Documentation - https://docs.opencv.org/
5. PyTorch Documentation - https://pytorch.org/docs/
6. Scikit-learn Documentation - https://scikit-learn.org/
7. Ultralytics YOLO Documentation - https://docs.ultralytics.com/
8. Docker Documentation - https://docs.docker.com/
9. Git Documentation - https://git-scm.com/doc
10. IEEE 830 Software Requirements Specification Guidelines

---

## 10.2 Glossary

| Term | Meaning |
|------|---------|
| AI | Artificial Intelligence |
| ML | Machine Learning |
| PLF | Precision Livestock Farming |
| CNN | Convolutional Neural Network |
| YOLO | You Only Look Once |
| IoT | Internet of Things |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| JWT | JSON Web Token |
| RFID | Radio Frequency Identification |
| GPS | Global Positioning System |
| ORM | Object Relational Mapping |
| CRUD | Create, Read, Update, Delete |

---

## 10.3 Conclusion

AgroLens PLF is designed as an AI-powered Precision Livestock Farming platform that enables small and medium-scale farmers to efficiently manage livestock, monitor animal health, improve production, and make data-driven decisions. The combination of Computer Vision, Machine Learning, PostgreSQL, FastAPI, and React provides a scalable and modern solution for digital livestock management.
