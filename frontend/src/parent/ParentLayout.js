import React from 'react'
import ParentNavbar from './ParentNavbar'
import { Outlet } from 'react-router-dom'

function ParentLayout() {
  return (
    <div>
        <ParentNavbar />
        <main>
            <Outlet /> {/* Renders the nested routes (pages) here */}
        </main>
    </div>
  )
}

export default ParentLayout