"use client"

import { Link } from "react-router-dom"

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="border-2 border-gray-200 rounded-lg p-8 flex flex-col w-full max-w-md bg-white shadow-sm">
        {/* Logo/Titre */}
        <div className="text-center mb-6">
          <span className="text-2xl font-bold text-blue-600">Humain+</span>
          <p className="text-sm text-gray-500 mt-1">Plateforme de recrutement intelligent</p>
        </div>

        {/* Formulaire */}
        <div className="space-y-4">

          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              placeholder="votre@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bouton de connexion */}
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4 cursor-pointer">
            Se connecter
          </button>

          {/* Lien mot de passe oublié */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Pas de compte ?
            <Link to="/Register" className="text-blue-600 hover:text-blue-500 underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}