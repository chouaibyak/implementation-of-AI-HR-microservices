import React from 'react'
import {
  Home,
  Building,
  Briefcase,
  Users,
  Handshake,
  UserCheck,
  Contact,
  Calendar,
  Inbox,
  BarChart3,
  Network,
  Settings
} from 'lucide-react'

export default function SideBarre() {
  return (
    <div className=' fixed h-screen border shadow-accent w-65 p-3.5 bg-white'>
      {/* First group */}
      <ul>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer '><Home size={18} /> Home</li>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer '><Briefcase size={18} /> Jobs</li>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer '><Users size={18} /> Candidates</li>
      </ul>

      {/* Second group with top border */}
      <ul className='mt-4 border-t'>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer '><Handshake size={18} /> Matches</li>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer '><UserCheck size={18} /> Placements</li>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer  focus:bg-blue-100'><Contact size={18} /> Contacts and Guests</li>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer'><Calendar size={18} /> Activities</li>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer '><Inbox size={18} /> Inbox</li>
      </ul>

      {/* Third group with top border */}
      <ul className='mt-4 border-t'>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer '><BarChart3 size={18} /> Reports</li>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer '><Network size={18} /> Sourcing Hub</li>
        <li className='flex items-center gap-2 p-2 w-full hover:bg-gray-100 cursor-pointer '><Settings size={18} /> Settings</li>
      </ul>
    </div>
  )
}
