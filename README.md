# School Management System

## Overview
This School Management System is a comprehensive application designed to streamline and enhance the management of school operations. Built using the MERN stack, the system facilitates seamless communication between teachers and parents, automates report generation, tracks curricular activities, and supports invoice management with payment integration.

The system incorporates modern tools and technologies to ensure a user-friendly and efficient experience for all stakeholders.

---

## Features

### User Management
- Registration and role-based access for teachers, parents, and students.
- Authentication with secure login/logout functionality.
- Email verification using Nodemailer.

### Communication
- Real-time chat functionality for parent-teacher engagement.

### Academic Management
- Automated report card generation.
- Secure report storage using AWS S3 Bucket.
- Results analysis to track student performance over time.

### Financial Management
- Invoice generation for school fees.
- Payment integration with Paystack (test mode).

### Additional Features
- Tracking of curricular and extracurricular activities.
- Responsive and visually appealing UI using Tailwind CSS and DaisyUI.

---

## Technologies Used

### Frontend
- **React.js**: For building a dynamic and responsive user interface.
- **Zustand**: Lightweight state management.
- **Tailwind CSS & DaisyUI**: For elegant and modern styling.
- **React Icons**: For visual enhancement.

### Backend
- **Node.js & Express.js**: For creating a scalable RESTful API.
- **MongoDB**: NoSQL database for efficient and flexible data storage.
- **JWT (JSON Web Token)**: For secure user authentication.
- **Nodemailer**: For email notifications and account verification.

### Deployment
- **Frontend**: Deployed on Vercel.
- **Backend**: Hosted on Render.

### Other Tools
- **AWS S3**: For secure file storage.
- **Paystack API**: For invoice management and payments.
- **Git & GitHub**: For version control.
- **Testing Tools**: Jest, Postman, and Chrome DevTools.

---

## Installation

### Prerequisites
Ensure the following are installed on your system:
- Node.js (v16.16.0 or higher)
- MongoDB (local or cloud instance)
- Git

### Steps
1. Clone the repository:
   ```bash
   git clone [repository_url]
   ```
2. Navigate to the project directory:
   ```bash
   cd school-management-system
   ```
3. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```
4. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```
5. Configure environment variables:
   - Create a `.env` file in the `backend` directory with the following:
     ```env
     MONGOOSE_CONNECTION=your_mongodb_uri
     JWT_PRIVATE_KEY=your_jwt_secret
     S3_BUCKET_NAME=your_s3_bucket_name
     S3_ACCESS_KEY=your_s3_access_key
     S3_SECRET_KEY=your_s3_secret_key
    PAYSTACK_SECRET_KEY=your_paystack_secret_key
     ```
      - Create a `.env` file in the `frontend` directory with the following:
     ```env
     REACT_APP_SERVER_URL=your server url
    REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
     ```
6. Start the development server:
   - Backend:
     ```bash
     cd backend
     npm start
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm start
     ```

7. Access the application at `http://localhost:3000`.

---

## Testing

### Unit Testing
- Implemented using Jest to validate individual functions and components.

### API Testing
- Verified using Postman to ensure proper interaction between frontend and backend.

### User Acceptance Testing
- Feedback gathered from teachers and parents to validate system usability.

---

## Future Enhancements
- Enable live Paystack integration by acquiring required credentials.
- Implement multi-factor authentication for enhanced security.
- Add advanced analytics for more detailed insights into student performance.
- Expand user testing for more comprehensive feedback.

---

## Contributions
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments
Special thanks to the stakeholders and users who provided valuable feedback during the development process.

