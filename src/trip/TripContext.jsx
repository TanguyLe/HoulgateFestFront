import React, { createContext, useState, useEffect } from 'react'

import { getCredentials, register, unregister } from '../login/store'
import { getCallApi, postCallApi, putCallApi, deleteCallApi } from '../utils/api/fetchMiddleware'
import { USERS_ENDPOINT, TRIPS_ENDPOINT } from './constants'

export const TripContext = createContext();

const TripContextProvider = (props) => {
    const [login, setLogin] = useState()
    const [users, setUsers] = useState()
    const [trips, setTrips] = useState()


    const createTrip = async (trip) => { 
        const response = await postCallApi(TRIPS_ENDPOINT, trip)
        if (response.ok) {
            const jsonData = await response.json()
            setTrips([...trips, jsonData.data])
        }
    }

    const updateTrip = async (id, trip) => {
        const response = await putCallApi(`${TRIPS_ENDPOINT}/${id}`, trip)
        if (response.ok) {
            const jsonData = await response.json()
            setTrips(prevTrips => prevTrips.map(trip => trip._id === jsonData.data._id ? jsonData.data : trip))
        }
    }

    const deleteTrip = async (id) => {
        const response = await deleteCallApi(`${TRIPS_ENDPOINT}/${id}`)
        if (response.ok) {
            const jsonData = await response.json()
            setTrips(prevTrips => prevTrips.filter(trip => trip._id !== jsonData.data._id))
        }
    }

    const getUserById = (id) => users.find(user => user._id === id)
    const getUserByUsername = (username) => users.find(user => user.username === username)

    const loadUsers = async () => {
        const response = await getCallApi(USERS_ENDPOINT)
        const jsonData = await response.json()
        setUsers(jsonData.data) 
    }

    const loadTrips = async () => {
        const response = await getCallApi(TRIPS_ENDPOINT)
        const jsonData = await response.json()
        setTrips(jsonData.data) 
    }

    const init = async () => {
        await loadUsers()
        await loadTrips()
    }

    const onLoginChange = (creds) => {
        if (creds.login !== login)
            setLogin(creds.login)
    }

    useEffect(() => {
        register(onLoginChange)
        onLoginChange(getCredentials())
        return () => {
            unregister(onLoginChange)
        }
    }, [])

    useEffect(() => { init () }, [])

    return (
        <TripContext.Provider value={{ login, users, trips, getUserById, getUserByUsername, createTrip, updateTrip, deleteTrip }}>
            { props.children }
        </TripContext.Provider>
    );
}
 
export default TripContextProvider;
