import { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'

import Explore from './pages/Explore'
import Collections from './pages/Collections'
import BoardPage from './pages/BoardPage'
import AlbumPage from './pages/AlbumPage'
import { useLocation, Navigate, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner";


function App() {
  const location = useLocation();
  const usesCompactNav = location.pathname.startsWith("/boards/") || location.pathname.startsWith("/albums/");
  const isBoardEditor =location.pathname.startsWith("/boards/");
  return (
    <>
      {!usesCompactNav && (
        <div className="p-8">
          <Navigation variant='default'/>
        </div>
      )}
  
      <main className={usesCompactNav && isBoardEditor ? "" : "m-8"}>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/boards/:boardId" element={<BoardPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
        </Routes>
      </main>

      <Toaster position="bottom-center" duration={1000} toastOptions={{className: "custom-toast"}}/>
    </>
  );
}

export default App
