import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditPage from './pages/EditPage';
import './App.css';
import {Toaster} from 'react-hot-toast';

export default function App() {
  return (
     <>
     <div><Toaster   position="top-center"  
      toastOptions={{
        success: {
            theme: {
                primary: '#4aed88',
            },
        },
    }}
     
     /></div>

      <BrowserRouter>
       <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/editor/:roomId" element={<EditPage/>}></Route>
       </Routes>
      
      </BrowserRouter>
     </>
  )
}
