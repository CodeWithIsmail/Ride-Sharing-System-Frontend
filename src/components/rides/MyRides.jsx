// src/components/rides/MyRides.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3002/api/rides', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Optional: Sort rides by most recent
        const sortedRides = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRides(sortedRides);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading your rides...</p>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Ride Requests</h2>
        <Link to="/post-ride" className="btn btn-primary">Post a New Ride</Link>
      </div>
      <div className="list-group">
        {rides.length > 0 ? rides.map(ride => (
          // EACH ITEM IS NOW A CLICKABLE LINK
          <Link 
            key={ride._id} 
            to={`/rides/${ride._id}`} // This links to the new details page
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
              <small>
                Status: <span className={`badge bg-${ride.status === 'completed' ? 'success' : 'info'}`}>
                  {ride.status}
                </span>
              </small>
            </div>
            <p className="mb-1">Fare: ${ride.desiredFare}</p>
            <small>Posted on: {new Date(ride.createdAt).toLocaleString()}</small>
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