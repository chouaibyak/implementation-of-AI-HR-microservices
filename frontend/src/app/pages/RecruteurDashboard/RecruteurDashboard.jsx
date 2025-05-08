import React from 'react'
import { Search, Bell } from 'lucide-react';
import ProfilMenu from './ProfilMenu';


export default function RecruteurDashboard() {
  return (
    <div className='bg-blue-600 w-full h-15 flex items-center justify-between px-4'>
      <span className='text-amber-50 text-2xl font-semibold'>Humain+</span>
      {/* Barre de recherche centrée */}
      <div className='flex items-center space-x-4'>
        <button className='cursor-pointer'>
          <Search className='text-amber-50' size={24} />
        </button>
        <button className='cursor-pointer'>
          <Bell className='text-amber-50' size={24} />
        </button>
        <button className='cursor-pointer'>
          <ProfilMenu />
        </button>
      </div>
    </div>
  )
}
