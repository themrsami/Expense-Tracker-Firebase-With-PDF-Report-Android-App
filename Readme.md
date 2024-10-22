# Expense Tracker App

## Overview

This **Expense Tracker App** is built using **React Native** and **Expo**. It allows users to:

- Track their daily, monthly, and yearly expenses.
- Add descriptions, amounts, and images associated with each expense.
- Edit or delete existing expenses.
- Generate PDF reports for a selected date range.

The app uses **Firebase** for user authentication, Firestore for data storage, and Firebase Storage for storing images.

---

## Screenshots

### Sign Up Screen
![WhatsApp Image 2024-10-22 at 8 47 05 PM](https://github.com/user-attachments/assets/30309072-2b00-4902-aba4-ec25c8be0195)
### Login Screen
![WhatsApp Image 2024-10-22 at 8 47 06 PM](https://github.com/user-attachments/assets/b4609d20-0d95-4567-9f93-acb542a78659)
### Dashboard Screen
![WhatsApp Image 2024-10-22 at 8 47 06 PM (1)](https://github.com/user-attachments/assets/97a2cd0a-3939-4aae-89e2-baf6c9c1ae30)
### Add Expense Modal
![WhatsApp Image 2024-10-22 at 8 47 07 PM](https://github.com/user-attachments/assets/a8e173ee-2ea1-4769-87ed-16a300c1f21d)
### Generate PDF Report Modal
![WhatsApp Image 2024-10-22 at 8 47 07 PM (1)](https://github.com/user-attachments/assets/7524174b-5a7b-4cee-9838-78932449614b)
---

## Features

- **Sign Up / Log In**: Users can create an account and log in with email and password authentication.
- **Expense Management**: Users can add, edit, or delete expenses. All expenses are stored in Firebase Firestore.
- **Date Filtering**: Users can filter expenses by month and year.
- **PDF Report Generation**: Users can generate and download PDF reports for a selected date range, including images associated with each expense.
- **Firebase Integration**: Uses Firebase Firestore for data storage and Firebase Authentication for user authentication.

---

## Prerequisites

- **Node.js** (for running the app and managing dependencies)
- **Expo CLI** installed
- **Firebase Project** created in Firebase Console

---

## Setup Instructions

### Step 1: Clone the repository

```bash
git clone https://github.com/themrsami/Expense-Tracker-Firebase-With-PDF-Report-Android-App.git
cd Expense-Tracker-Firebase-With-PDF-Report-Android-App
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Set up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Email/Password Authentication**:
    - In the Firebase Console, go to `Authentication` -> `Sign-in method`.
    - Enable **Email/Password** authentication.
    - Optionally, enable **Email verification** to require users to verify their email addresses before they can log in.
3. Enable **Firestore Database**:
    - In the Firebase Console, go to `Firestore Database` and set up the database in "Test Mode" (or "Production Mode" if you're ready to set up security rules).
4. Download your Firebase configuration object (this will be used in the `firebaseconfig.ts` file).
5. Create a `firebaseconfig.ts` file in the root directory and add the Firebase configuration:

```typescript
// firebaseconfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, db };
```

Make sure to replace the placeholders with your actual Firebase project credentials.

### Step 4: Configure Firebase Authentication

1. Enable **Email/Password Authentication** in the Firebase Console.
2. (Optional) Enable **Email Verification**:
   - In the Firebase Console, go to `Authentication` -> `Templates`.
   - Configure the **Email Verification** template if required.

### Step 5: Run the app

Once Firebase is set up and configured, run the app using the following command:

```bash
npm start
```

This will start a development server, and you can open the app in the Expo Go app on your mobile device or in an Android/iOS simulator.

---

## App Functionality

### 1. Dashboard Screen
- Displays all tracked expenses.
- Allows users to filter by year and month.
- Allows users to add, edit, and delete expenses.
- Includes an option to generate a PDF report of the expenses for a selected date range.

### 2. Expense Form (Add/Update Expense)
- Users can add a new expense or update an existing one.
- Expense details include amount, description, and an optional image (linked to Firebase Storage).
- Once saved, the expense is uploaded to Firestore.

### 3. PDF Report Generation
- Users can filter expenses by date range and generate a PDF report with expense details, including the image associated with each expense.
- The PDF is either saved locally or shared via available sharing options.

---

## Technologies Used

- **React Native**: For building cross-platform mobile applications.
- **Expo**: A framework for React Native that simplifies development.
- **Firebase**: For real-time authentication, Firestore database, and storage.
- **Expo Print**: For generating PDF reports.
- **Expo Sharing**: For sharing reports.
- **Expo Media Library**: For saving reports to the device’s media library.

---

## License

This project is licensed under the MIT License.