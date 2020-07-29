import React, { createContext, useState } from 'react'

import { getCallApi, postCallApi, putCallApi, deleteCallApi } from '../utils/api/fetchMiddleware'
import { USERS_ENDPOINT, TRIPS_ENDPOINT } from './constants'
import { useEffect } from 'react';

export const TripContext = createContext();

const TripContextProvider = (props) => {
    const [users, setUsers] = useState()
    const [trips, setTrips] = useState()


    const createTrip = async (trip) => { 
        const response = await postCallApi(TRIPS_ENDPOINT, trip)
        if (response.ok) {
            const jsonData = await response.json()
            console.log(jsonData)
            setTrips([...trips, jsonData.data])
        }
    }

    const updateTrip = async (id, trip) => {
        const response = await putCallApi(`${TRIPS_ENDPOINT}/${id}`, trip)
        if (response.ok) {
            const jsonData = await response.json()
            const copy = [...trips]
            const index = trips.findIndex(trip => trip._id === jsonData.data._id)
            copy[index] = jsonData.data
            setTrips([...copy])
        }
    }

    const deleteTrip = async (id) => {
        const response = await deleteCallApi(`${TRIPS_ENDPOINT}/${id}`)
        if (response.ok) {
            const jsonData = await response.json()
            const copy = [...trips]
            const index = trips.findIndex(trip => trip._id === jsonData.data._id)
            copy.splice(index, 1)
            setTrips([...copy])
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

    useEffect(() => { init () }, [])

    return (
        <TripContext.Provider value={{ users, trips, getUserById, getUserByUsername, createTrip, updateTrip, deleteTrip }}>
            { props.children }
        </TripContext.Provider>
    );
}
 
export default TripContextProvider;
