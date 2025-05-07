"use client"

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidatDashboard from './pages/CondidatDashboard';
import RecruteurDashboard from './pages/RecruteurDashboard';

export default function Home() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidat" element={<CandidatDashboard />} />
        <Route path="/recruteur" element={<RecruteurDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
