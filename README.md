# NIT Meghalaya Campus Connect - Teacher Frontend

## Overview

The Campus Connect Teacher Frontend is a comprehensive mobile application built with Expo and React Native, designed to streamline academic management for teachers at NIT Meghalaya. This application provides an intuitive interface for managing attendance, handling student grievances, and accessing course information.

![NIT Meghalaya Logo](./assets/images/nit_logo.png)

## Features

### 1. Authentication
- Secure login and registration system for teachers
- JWT-based authentication
- Profile management

### 2. Dashboard
- Quick access to key features
- Overview of pending and resolved grievances
- Attendance statistics
- Course information at a glance

### 3. Attendance Management
- Take attendance for classes
- View attendance reports and statistics
- Identify students with low attendance
- Send automated warning emails to students with attendance below threshold
- Manage Teaching Assistants (TAs) for courses

### 4. Grievance Handling
- View and respond to student grievances
- Track grievance resolution status
- Comment on grievances
- Upvote/downvote system for prioritizing issues
- Statistics on resolved vs. pending grievances

### 5. Course Management
- View assigned courses
- Access student lists for each course
- Course-specific attendance tracking
- Add students to courses

## Application Flow

1. **Authentication**
   - Teachers log in with their credentials
   - Authentication state is maintained across sessions

2. **Dashboard**
   - Central hub with quick access to all features
   - Overview of key metrics and statistics

3. **Attendance Workflow**
   - Select course → View student list → Mark attendance
   - Generate reports → Identify low attendance → Send warning emails

4. **Grievance Workflow**
   - View grievances → Select specific grievance → Add comments
   - Resolve grievances → Track resolution statistics

5. **Course Management**
   - View courses → Access course details
   - Manage students and TAs → Track course-specific attendance

## Technical Stack

- **Frontend Framework**: React Native with Expo
- **Styling**: TailwindCSS (NativeWind)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **Authentication**: JWT-based auth with secure storage
- **UI Components**: Custom components with theming support
- **Notifications**: Toast messages for user feedback

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Run on your preferred platform:
   - Android emulator
   - iOS simulator
   - Expo Go app (for testing)
   - Web browser

## API Integration

The application connects to a backend API for:
- Authentication services
- Attendance data management
- Grievance tracking and resolution
- Course information and student data
- Email notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Project Structure

- `/app`: Main application code with file-based routing
  - `/(auth)`: Authentication screens
  - `/(tabs)`: Main tab navigation
  - `/attendance`: Attendance management screens
  - `/grievance`: Grievance handling screens
- `/components`: Reusable UI components
- `/constants`: Theme constants, colors, and assets
- `/context`: React Context providers
- `/hooks`: Custom React hooks
- `/service`: API service functions

## License

This project is proprietary and owned by Charity Shashank and Jishnu 

## Contact

For any queries or support, please contact the development team:
- Shashank
- Jishnu
- Charity
