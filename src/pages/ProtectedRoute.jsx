import React, { useEffect } from 'react'
import { useAuth } from '../context/FakeAuthContext'
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(function(){
        if(!isAuthenticated) navigate('/')
    },[navigate,isAuthenticated])
  return isAuthenticated ? children : null;
}
