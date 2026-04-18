# Smart Digital Bank

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0+-brightgreen.svg)
![React](https://img.shields.io/badge/React-19.2+-blue.svg)

Smart Digital Bank is a modern, full-stack banking application designed to provide users with a seamless, secure, and intelligent way to manage their finances. Featuring a premium user interface, AI-powered insights, and robust backend constraints, this project aims to simulate a next-generation banking experience.

## ✨ Key Features

- **Intuitive Dashboard**: A visually appealing interface to monitor account balances, recent transactions, and quick actions.
- **Account Management**: Link multiple bank accounts and designate a primary account for transactions.
- **Instant Transfers**: Send and receive money instantly and securely.
- **Bill Payments & Recharges**: Conveniently pay utility bills and recharge mobile devices.
- **AI Smart Insights**: Analyze spending patterns, view category-wise bar graphs (via Recharts), and receive personalized financial advice.
- **EMI Planner**: Calculate and plan your monthly savings for EMIs effectively.
- **Smart Banking Companion**: An AI-powered interactive chatbot assistant right within the dashboard.

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **MySQL** database server
- **Maven** (optional, wrapper is included)

### Database Setup

1. Open your MySQL client and create a database named `bank_database`:
   ```sql
   CREATE DATABASE bank_database;
   ```
2. The Spring Boot application is configured to automatically create and update the table structures. Ensure your MySQL credentials match what is specified in `backend/src/main/resources/application.properties` (or update them as needed).

### Backend Setup (Spring Boot)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *Note: On Windows, you can use `mvnw.cmd spring-boot:run`.*
3. The server will start on `http://localhost:9090`.

### Frontend Setup (Vite + React)

1. Open a new terminal instance and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (typically `http://localhost:5173`).

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, React Router, Axios, Recharts, Lucide Icons, pure CSS for styling.
- **Backend**: Java 17, Spring Boot, Spring Data JPA, Hibernate, MySQL Connector.

## 🤝 Getting Help

If you encounter any issues or have questions regarding the setup, please check the following resources:
- Review the [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- Check the [Vite Documentation](https://vitejs.dev/guide/)
- Search closed issues on the repository or open a new one.

## 👩‍💻 Maintainers & Contributing

We welcome contributions from the community! From reporting bugs to submitting patches and improving documentation.

**Maintainers:**
- Vijay (Project Lead)

**How to Contribute:**
1. Fork the repository.
2. Create a new branch for your feature or bug fix (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please ensure your code follows the existing style conventions and that any new features include appropriate tests.

---
*Disclaimer: This is a simulation project and is not intended for managing real financial data or currency.*
