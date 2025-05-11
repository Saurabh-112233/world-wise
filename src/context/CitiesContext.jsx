import { Children, createContext, useContext, useEffect, useReducer, useState } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";
const initialState = {
  cities:[],
  isLoading:false,
  currentCity:{},
  error:""
}

function reducer(state,action){
  switch(action.type){
    case 'loading':
      return {
        ...state,isLoading:true
      }
    case 'cities/loaded':
      return {
        ...state,
        isLoading:false,
        cities:action.payload
      }
    case 'cities/get':
      return {
        ...state,
        isLoading:false,
        currentCity:action.payload
      }
    case 'cities/created':
      return {
        ...state,
        isLoading:false,
        cities:[...state.cities,action.payload],
        currentCity:action.payload
      }
    case 'cities/deleted' : {
      const updatedCities = state.cities.filter(city => city.id !== action.payload)
      return {
        ...state,
        isLoading:false,
        cities:updatedCities,
        currentCity:{}
      }
    }
    case 'rejected':
      return {
        ...state,
        isLoading:false,
        error:action.payload
      }
    default :throw new Error("Unknow action taken")
    }
}
function CitiesProvider({children}){
      // const [cities,setCities] = useState([]);
      // const [isLoading,setIsLoading] = useState(false);
      // const [currentCity,setCurrentCity] = useState({});
      const [{cities,isLoading,currentCity,error},dispatch] = useReducer(reducer,initialState);
      useEffect(function(){
        async function fetchCities() {
          try {
            dispatch({type:'loading'})
            const res = await fetch(`${BASE_URL}/cities`);
            const data =await res.json();
            dispatch({type:'cities/loaded',payload:data});
          } catch{
            dispatch({type:'rejected',payload:"There was an error loading data..."});
          }
        }
        fetchCities();
      },[]);
      
      async function getCity(id) {
          try {
            dispatch({type:'loading'})
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data =await res.json();
            dispatch({type:'cities/get',payload:data});
          } catch{
            dispatch({type:'rejected',payload:"There was an error loading city..."});
          }
      }

      async function createCity(newCity) {
          try {
            dispatch({type:'loading'})
            const res = await fetch(`${BASE_URL}/cities`,{
              method:'POST',
              body:JSON.stringify(newCity),
              headers:{
                'content-type':'application/json',
              },
            })
            const data = await res.json(); 
            dispatch({type:'cities/created',payload:data});
          } catch{
            dispatch({type:'rejected',payload:"There was an error creating city..."});
          }
      }

      async function deleteCity(id) {
        try {
          dispatch({type:'loading'})
            await fetch(`${BASE_URL}/cities/${id}`,{
              method:'DELETE'
            })
            dispatch({type:'cities/deleted',payload:id})
          } catch{
            dispatch({type:'rejected',payload:"There was an error in deleting the city..."});
          }
      }
    return (
        <CitiesContext.Provider value={{
            cities,
            isLoading,
            currentCity,
            getCity,
            createCity,
            deleteCity
        }    
        }>
            {children}
        </CitiesContext.Provider>
    )
}

function useCity(){
    const context = useContext(CitiesContext);
    if(context === undefined){
      throw new Error("CitiesContext was used outside the CitiesProvider")
    }
    return context; 
}

export {CitiesProvider,useCity};