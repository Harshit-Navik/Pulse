import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedLayout } from './components/layout/ProtectedLayout';

import Landing from './pages/Landing';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import Nutrition from './pages/Nutrition';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import BMICalculator from './pages/BMICalculator';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/:id" element={<WorkoutDetail />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/bmi" element={<BMICalculator />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
