// src/components/rides/MyRides.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const MyRides = () => {
    const { user } = useContext(AuthContext);
    const [myRides, setMyRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.userId) {
            setLoading(false);
            return;
        }
        const fetchRides = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3002/api/rides', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const filteredRides = response.data.filter(ride => ride.passengerId === user.userId);
                const sortedRides = filteredRides.sort((a, b) => new Date(b.createdAt || b.targetTime) - new Date(a.createdAt || a.targetTime));
                setMyRides(sortedRides);
            } catch (err) {
                console.error("Failed to fetch rides:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRides();
    }, [user]);

    if (loading) return <p className="text-center mt-5">Loading your rides...</p>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Ride Requests</h2>
                <Link to="/post-ride" className="btn btn-primary">Post a New Ride</Link>
            </div>
            <div className="list-group">
                {myRides.length > 0 ? myRides.map(ride => (
                    <Link 
                        key={ride.rideRequestId} 
                        to={`/rides/${ride.rideRequestId}`}
                        // We pass the ride data we already have to the next page
                        state={{ ride: ride }} 
                        className="list-group-item list-group-item-action"
                    >
                        <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                        <p className="mb-1">Fare: ${ride.desiredFare}</p>
                        <small>Requested For: {new Date(ride.targetTime).toLocaleString()}</small>
                    </Link>
                )) : (
                    <div className="text-center p-5 border rounded">
                        <h4>No Rides Yet</h4>
                        <p>You have not posted any rides. Get started now!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRides;