import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';
import { CitiesProvider } from './context/CitiesContext';
import { AuthProvider } from './context/FakeAuthContext';
import ProtectedRoute from './pages/ProtectedRoute';
// import Homepage from './pages/Homepage';
// import Product from './pages/Product';
// import Pricing from './pages/Pricing';
// import PageNotFound from './pages/PageNotFound';
// import AppLayout from './pages/AppLayout';
// import Login from './pages/Login'

const Homepage = lazy(()=>import('./pages/Homepage'));
const Product = lazy(()=>import('./pages/Product'));
const Pricing = lazy(()=>import('./pages/Pricing'));
const PageNotFound = lazy(()=>import('./pages/PageNotFound'));
const AppLayout = lazy(()=>import('./pages/AppLayout'));
const Login = lazy(()=>import('./pages/Login'));
import SpinnerFullPage from './components/SpinnerFullPage'
export default function App() {

  // const {cities,isLoading} = useCity();
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes>
              <Route index element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path = "pricing" element={<Pricing />} />
              <Route path='/login' element={<Login />} />
              <Route path="app" element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                } >
                <Route 
                  index 
                  element = {<Navigate replace to='cities' />} />
                <Route 
                  path = 'cities' 
                  element = {<CityList />} />
                <Route 
                  path='cities/:id' element={<City />} />
                <Route path ='countries' element={<CountryList /> } />
              <Route path ='form' element={<Form />} />
              </Route>
              <Route path = '*' element={<PageNotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  )
}
