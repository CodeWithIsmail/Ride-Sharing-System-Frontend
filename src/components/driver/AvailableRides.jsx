// src/components/driver/AvailableRides.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AvailableRides = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [appliedRideIds, setAppliedRideIds] = useState(new Set());

    useEffect(() => {
        const fetchAvailableRides = async () => {
            try {
                const token = localStorage.getItem('token');
                // FIX: Use the 'status' query parameter as per the schema's capability.
                // This is more efficient than fetching all rides and filtering on the client.
                const response = await axios.get('http://localhost:3002/api/rides?status=posted', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRides(response.data);
            } catch (err) {
                console.error(err);
                setMessage('Could not fetch available rides.');
            } finally {
                setLoading(false);
            }
        };
        fetchAvailableRides();
    }, []);

    const handleApply = async (rideId) => {
        setMessage(''); // Clear previous messages
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3002/api/rides/${rideId}/apply`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Successfully applied for the ride!`);
            // Add the rideId to a set to disable the button, providing clear UI feedback.
            setAppliedRideIds(prev => new Set(prev).add(rideId));
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to apply. You may have already applied for this ride.');
            console.error(err);
        }
    };

    if (loading) return <p className="text-center mt-5">Loading available rides...</p>;

    return (
        <div className="container mt-5">
            <h2>Available Ride Requests</h2>
            {message && <div className="alert alert-info mt-3">{message}</div>}
            <div className="list-group mt-3">
                {rides.length > 0 ? rides.map((ride) => (
                    <div key={ride.rideRequestId} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                            <p className="mb-1">Passenger: {ride.passengerName}</p>
                            <p className="mb-1">Fare: <strong>${ride.desiredFare}</strong></p>
                            <small>Requested Time: {new Date(ride.targetTime).toLocaleString()}</small>
                        </div>
                        <button
                            className="btn btn-success"
                            // FIX: Use the correct ID from the API response
                            onClick={() => handleApply(ride.rideRequestId)}
                            disabled={appliedRideIds.has(ride.rideRequestId)}
                        >
                            {appliedRideIds.has(ride.rideRequestId) ? 'Applied' : 'Apply'}
                        </button>
                    </div>
                )) : (
                    <p className="text-center p-4">No new ride requests at the moment. Please check back later.</p>
                )}
            </div>
        </div>
    );
};

export default AvailableRides;