// src/components/driver/DriverRides.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const DriverRides = () => {
    const { user } = useContext(AuthContext);
    const [confirmedRides, setConfirmedRides] = useState([]);
    const [completedRides, setCompletedRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchMyRides = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:3002/api/rides", {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // FIX: Correctly filter using user.userId from the AuthContext
            const allMyRides = response.data.filter(ride => ride.driverId === user.userId);

            // FIX: Use the 'status' field from the schema to correctly categorize rides
            setConfirmedRides(allMyRides.filter(ride => ride.status === 'confirmed'));
            setCompletedRides(allMyRides.filter(ride => ride.status === 'completed'));

        } catch (err) {
            console.error(err);
            setMessage("Could not fetch your rides.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRides();
    }, [user]);

    const handleComplete = async (rideId) => {
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            // FIX: Use the correct ride ID for the API call
            await axios.post(`http://localhost:3002/api/rides/${rideId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("Ride marked as complete!");
            // Refresh the lists from the server to get the most up-to-date information.
            fetchMyRides();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to complete ride.');
            console.error(err);
        }
    };

    if (loading) return <p className="text-center mt-5">Loading your rides...</p>;

    return (
        <div className="container mt-5">
            <h2>My Rides Management</h2>
            {message && <div className="alert alert-info mt-3">{message}</div>}

            <div className="card mt-4">
                <div className="card-header"><h4>Confirmed Rides (Your Jobs)</h4></div>
                <div className="card-body">
                    {confirmedRides.length > 0 ? (
                        <ul className="list-group">
                            {confirmedRides.map((ride) => (
                                <li key={ride.rideRequestId} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{ride.pickupLocation} to {ride.dropoffLocation}</strong>
                                        <p className="mb-0 mt-1">Passenger: {ride.passengerName}</p>
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleComplete(ride.rideRequestId)}
                                    >
                                        Mark as Completed
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : <p>You have no confirmed rides scheduled.</p>}
                </div>
            </div>

            <div className="card mt-5">
                <div className="card-header"><h4>Ride History (Completed)</h4></div>
                <div className="card-body">
                    {completedRides.length > 0 ? (
                        <ul className="list-group">
                            {completedRides.map((ride) => (
                                <li key={ride.rideRequestId} className="list-group-item bg-light">
                                    {ride.pickupLocation} to {ride.dropoffLocation} - Fare: <strong>${ride.desiredFare}</strong>
                                </li>
                            ))}
                        </ul>
                    ) : <p>You have not completed any rides yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default DriverRides;