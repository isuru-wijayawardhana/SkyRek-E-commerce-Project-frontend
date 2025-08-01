import { useState } from 'react'
import './App.css'
import LoginPage from './pages/loginPage.jsx'
import RegisterPage from './pages/registerPage.jsx'
import ProductCard from './components/productCard'
import HomePage from './pages/homePage.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminPage from './pages/adminPage.jsx'
import TextPage from './pages/testPage.jsx'
function App() {

  return (
  
      <BrowserRouter>
      <div className='w-full h-screen flex justify-center items-center'>
        <div className='w-[calc(100vw-35px)] h-[calc(100vh-15px)] border border-red-400'>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/login'element={<LoginPage/>}/>
            <Route path='/register'element={<RegisterPage/>}/>
            <Route path='/admin/*' element={<AdminPage/>}/>
            <Route path='/testPage' element={<TextPage/>}/>
          </Routes>
        </div>
      </div>
      </BrowserRouter>

    
  )
}

export default App
