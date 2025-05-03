
# Fashion Store

A modern fashion eCommerce web application built with React, Firebase, Cloudinary, and Bootstrap. The store features product browsing, user authentication, admin management, shopping cart, and category filtering.

## Features

- Product listing with search, sort, and category filter
- User authentication (login/signup with Firebase Auth)
- Shopping cart with item quantity control and total pricing
- Admin panel with product CRUD (Create, Read, Update, Delete)
- Cloudinary image uploads
- Firebase Firestore for database
- Responsive UI with Bootstrap

## Tech Stack

- **Frontend:** React, Bootstrap, React Router
- **Backend:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Image Hosting:** Cloudinary

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fashion-store.git
cd fashion-store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

- Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
- Enable Firestore Database and Authentication (Email/Password)
- Add your Firebase config to `firebase.js`

```js
// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // etc...
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 4. Set Up Cloudinary

- Go to [https://cloudinary.com](https://cloudinary.com) and create an account
- Get your cloud name and create an unsigned upload preset
- Update `AdminPanel.jsx` with your Cloudinary `cloud_name` and `upload_preset`

### 5. Start the Project

```bash
npm start
```

Visit `http://localhost:3000` to view the app.

## Project Structure

```
src/
├── components/
│   └── ProductCard.jsx
├── pages/
│   └── AdminPanel.jsx
│   └── CottonTees.jsx
│   └── Login.jsx
│   └── Signup.jsx
│   └── Cart.jsx
├── firebase.js
├── App.js
└── index.js
```

---
