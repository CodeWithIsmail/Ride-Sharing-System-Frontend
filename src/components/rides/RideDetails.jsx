// src/components/rides/RideDetails.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RideDetails = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();

    const [ride, setRide] = useState(null);
    const [applications, setApplications] = useState([]);
    const [confirmedDriver, setConfirmedDriver] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchDriverDetails = useCallback(async (driverId) => {
        try {
            const response = await api.get(`/users/${driverId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch details for driver ${driverId}`, error);
            return { name: 'Unknown Driver', phone: 'N/A' };
        }
    }, []);

    useEffect(() => {
        const fetchAllRideData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                
                const rideResponse = await axios.get(`http://localhost:3002/api/rides/${rideId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const rideData = rideResponse.data;
                setRide(rideData);

                if (rideData.status === 'posted') {
                    const appResponse = await axios.get(`http://localhost:3002/api/rides/${rideId}/applications`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    const enrichedApplications = await Promise.all(
                        appResponse.data.map(async (app) => ({
                            ...app,
                            driverInfo: await fetchDriverDetails(app.driverId),
                        }))
                    );
                    setApplications(enrichedApplications);
                } else if (rideData.driverId) {
                    const driverInfo = await fetchDriverDetails(rideData.driverId);
                    setConfirmedDriver(driverInfo);
                }
            } catch (err) {
                setError('Failed to load ride details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllRideData();
    }, [rideId, fetchDriverDetails]);

    const handleSelectDriver = async (driverId) => {
        setMessage('Confirming driver...');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3002/api/rides/${rideId}/select`, 
                { driverId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Driver selected successfully! The page will now refresh.');
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setMessage('Failed to select driver. Please try again.');
            console.error(err);
        }
    };

    if (loading) return <p className="text-center mt-5">Loading Ride Details...</p>;
    if (error) return <p className="alert alert-danger">{error}</p>;
    if (!ride) return <p>Ride not found.</p>;

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3>Ride Details</h3>
                    <span className={`badge bg-${ride.status === 'completed' ? 'success' : 'info'} p-2 fs-6`}>{ride.status.toUpperCase()}</span>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                    <p className="card-text"><strong>Fare:</strong> ${ride.desiredFare}</p>
                    <p className="card-text"><strong>Time:</strong> {new Date(ride.targetTime).toLocaleString()}</p>
                    <hr />

                    {message && <div className="alert alert-info">{message}</div>}

                    {ride.status !== 'posted' && confirmedDriver && (
                        <div className="alert alert-success">
                            <h6 className="alert-heading">Your Confirmed Driver</h6>
                            <p><strong>Name:</strong> {confirmedDriver.name}</p>
                            <p className="mb-0"><strong>Phone:</strong> {confirmedDriver.phone}</p>
                        </div>
                    )}

                    {ride.status === 'posted' && (
                        <>
                            <h4>Driver Applications</h4>
                            {applications.length > 0 ? (
                                <ul className="list-group">
                                    {applications.map(app => (
                                        <li key={app._id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Driver:</strong> {app.driverInfo.name} <br/>
                                                <strong>Contact:</strong> {app.driverInfo.phone}
                                            </div>
                                            <button onClick={() => handleSelectDriver(app.driverId)} className="btn btn-sm btn-primary" disabled={!!message}>
                                                Select & Confirm
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p>No drivers have applied for this ride yet.</p>)}
                        </>
                    )}

                    <div className="mt-4">
                        <button onClick={() => navigate('/my-rides')} className="btn btn-secondary">
                            Back to My Rides
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideDetails;