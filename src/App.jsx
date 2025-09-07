import { useState } from 'react'
import './App.css'
import LoginPage from './pages/loginPage.jsx'
import RegisterPage from './pages/registerPage.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminPage from './pages/adminPage.jsx'
import TextPage from './pages/testPage.jsx'
import { Toaster } from 'react-hot-toast'
import ClientWebPage from './pages/clientPage.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ForgetPassword from './pages/forgetPassword.jsx'
const clientId = import.meta.env.VITE_Client_Id
const clientSecret = import.meta.env.VITE_Client_secret
function App() {

  return (
  
      <BrowserRouter>
        <GoogleOAuthProvider clientId={clientId}>
          <div className='w-full h-screen flex justify-center items-center bg-primary text-secondary'>
            <Toaster position="top-right"/>
              <Routes>
                <Route path='/login'element={<LoginPage/>}/>
                <Route path='/register'element={<RegisterPage/>}/>
                <Route path='/admin/*' element={<AdminPage/>}/>
                <Route path='/testPage' element={<TextPage/>}/>
                <Route path='/forget' element={<ForgetPassword/>}/>
                <Route path='/*' element={<ClientWebPage/>}/>
              </Routes>
          </div>
        </GoogleOAuthProvider>
      </BrowserRouter>

    
  )
}

export default App
