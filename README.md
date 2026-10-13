# SmartZone Mobile Hub – POS System

A Point of Sale (POS) and Retail Store Management System designed to help manage retail sales and day-to-day store operations through a user-friendly interface.

## 📌 Project Overview

**SmartZone Mobile Hub** is a software project focused on simplifying retail store management. It provides a digital interface for handling point-of-sale operations and organizing essential store activities.

The project combines a React-based frontend with a Python backend, with the goal of providing a maintainable and responsive retail management solution.

## ✨ Key Features

- **Point of Sale (POS):** A dedicated interface for retail sales operations.
- **Retail Management:** Supports the organization of store-related activities.
- **User-Friendly Interface:** Designed to make common tasks easier to navigate.
- **Responsive UI:** Built with modern frontend technologies.
- **Backend Integration:** Uses a Python-based backend to support application functionality.

> Note: Confirm that each feature above is implemented in the current version before publishing this README.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- Vite
- Tailwind CSS

### Backend
- Python
- FastAPI / Uvicorn

### Desktop Application
- Electron

### Development Tools
- npm
- Git
- GitHub
- VS Code

## 📂 Project Structure

```text
SMARTZONE-MOBILE-HUB/
├── backend/          # Python backend
├── electron/         # Electron desktop application
├── src/              # React frontend source code
├── dist/             # Production build output
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following tools before starting:

- Node.js and npm
- Python
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/naushithennakoon14-bit/SMARTZONE-MOBILE-HUB.git
```

### 2. Navigate to the Project

```bash
cd SMARTZONE-MOBILE-HUB
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Start the Frontend

```bash
npm run dev
```

Open the local URL shown in your terminal to access the application.

### 5. Start the Backend

Open a separate terminal in the project root and run:

```bash
python -m pip install fastapi uvicorn
python -m uvicorn backend.main:app --reload --port 8000
```

If the project includes a `requirements.txt` file, install the listed backend dependencies using that file instead:

```bash
python -m pip install -r requirements.txt
```

If additional Python packages are required, install them according to the project's backend dependency configuration.

## 🖥️ Running the Desktop Application

The repository includes an Electron entry point.

After installing the dependencies, try:

```bash
npm run electron
```

If Electron reports missing packages or configuration errors, check the Electron setup before using this command.

## 🧪 Build for Production

To create a production build of the frontend, run:

```bash
npm run build
```

The generated frontend build is placed in the `dist/` directory.

## 🎯 Project Objectives

- Simplify common retail store operations.
- Provide an accessible and easy-to-use POS interface.
- Practice frontend and backend integration.
- Apply modern software development tools and workflows.
- Improve practical skills in application development and debugging.

## 📚 Learning Outcomes

Through this project, I aim to strengthen my practical knowledge of:

- React component-based development.
- JavaScript and frontend application structure.
- Tailwind CSS for user interface styling.
- Python backend development.
- Frontend and backend integration.
- Development, testing, debugging, and version control with Git and GitHub.

## 🚀 Future Improvements

Potential improvements, depending on project requirements, include:

- Enhanced inventory and stock management.
- Sales reports and analytics.
- Receipt generation and printing.
- User authentication and role-based access.
- Improved error handling and validation.
- Automated testing and application security improvements.

## 👩‍💻 Developer

**Nausha Thennakoon**

Information Technology | Aspiring Software Engineer

- GitHub: [@naushithennakoon14-bit](https://github.com/naushithennakoon14-bit)
- Project Repository: [SmartZone Mobile Hub](https://github.com/naushithennakoon14-bit/SMARTZONE-MOBILE-HUB)

## 📄 License

This project is intended for educational and portfolio purposes. A formal license can be added if the project is intended for public reuse or distribution.
