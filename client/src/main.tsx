// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";
import { AuthProvider } from "./context/authProvider";
import { SleeperProvider } from "./context/sleeperProvider";
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SleeperProvider>
        <AuthProvider>
            <App />
            <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
    </SleeperProvider>
  </React.StrictMode>
);