"use client"

import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formValue, setFormValue] = useState('');
  const [error, setError] = useState('');

  const inputEmailRef = useRef();
  const inputNameRef = useRef();
  const inputPasswordRef = useRef();
  const recruteurTypeRef = useRef();
  const condidatTypeRef = useRef();

  const handelSubmit = (e) => {
    e.preventDefault();

    // Vérification des champs
    if (!inputNameRef.current.value ||
      !inputEmailRef.current.value ||
      !inputPasswordRef.current.value ||
      !selectedRole) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setError(''); // Réinitialiser l'erreur si tout est valide
    setFormValue({
      email: inputEmailRef.current.value,
      name: inputNameRef.current.value,
      password: inputPasswordRef.current.value,
      role: selectedRole
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="border-2 border-gray-200 rounded-lg p-8 flex flex-col w-full max-w-md bg-white shadow-sm">
        {JSON.stringify(formValue)}
        {/* Logo/Titre */}
        <div className="text-center mb-6">
          <span className="text-2xl font-bold text-blue-600">Humain+</span>
          <p className="text-sm text-gray-500 mt-1">Plateforme de recrutement intelligent</p>
        </div>

        {/* Affichage de l'erreur */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <div className="space-y-4">
          {/* Sélection Recruteur/Candidat */}
          <div className="flex space-x-4 mb-4">
            <button
              type="button" // Ajout du type button pour éviter la soumission du formulaire
              onClick={() => setSelectedRole('recruiter')}
              className={`
                flex-1 py-2 px-4 border rounded-md font-medium cursor-pointer
                ${selectedRole === 'recruiter'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'}
              `}
              ref={recruteurTypeRef}
            >
              Recruteur
            </button>
            <button
              type="button" // Ajout du type button pour éviter la soumission du formulaire
              onClick={() => setSelectedRole('candidate')}
              className={`
                flex-1 py-2 px-4 border rounded-md font-medium cursor-pointer
                ${selectedRole === 'candidate'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'}
              `}
              ref={condidatTypeRef}
            >
              Candidat
            </button>
          </div>

          {/* Champ Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="name"
              placeholder="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ref={inputNameRef}
            />
          </div>

          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              placeholder="votre@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ref={inputEmailRef}
            />
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ref={inputPasswordRef}
            />
          </div>

          {/* Bouton de connexion */}
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4 cursor-pointer"
            onClick={handelSubmit}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}