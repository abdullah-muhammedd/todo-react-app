import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import MainPage from "./components/mainPage/MainPage"
import RegistrPage from "./components/registerPage/RegisterPage"
import LoginPage from "./components/loginPage/LoginPage"
const queryClient = new QueryClient()
// Router 
// The Landing Page With A Link = index
function App() {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/app" element={<MainPage />} />
            <Route path="/register" element={<RegistrPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  )
}

export default App
