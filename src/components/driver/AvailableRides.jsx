// src/components/driver/AvailableRides.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const AvailableRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch all rides with status 'posted'
        const response = await axios.get(
          "http://localhost:3002/api/rides?status=posted",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRides(response.data);
      } catch (err) {
        console.error(err);
        setMessage("Could not fetch available rides.");
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const handleApply = async (rideId) => {
    setMessage(`Applying for ride ${rideId}...`);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3002/api/rides/${rideId}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Successfully applied for ride ${rideId}!`);
      // Visually remove the ride from the list upon successful application
      setRides(rides.filter((ride) => ride._id !== rideId));
    } catch (err) {
      setMessage(
        "Failed to apply. You may have already applied for this ride."
      );
      console.error(err);
    }
  };

  if (loading) return <p>Loading available rides...</p>;

  return (
    <div className="container mt-5">
      <h2>Available Ride Requests</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {rides.length > 0 ? (
        <div className="list-group">
          {rides.map((ride) => (
            <div key={ride._id} className="list-group-item">
              <h5>
                {ride.pickupLocation} to {ride.dropoffLocation}
              </h5>
              <p>
                Fare: <strong>${ride.desiredFare}</strong>
              </p>
              <p>Time: {new Date(ride.targetTime).toLocaleString()}</p>
              <button
                className="btn btn-success"
                onClick={() => handleApply(ride._id)}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No new ride requests at the moment. Please check back later.</p>
      )}
    </div>
  );
};

export default AvailableRides;
