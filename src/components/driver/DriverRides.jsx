// src/components/driver/DriverRides.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

const DriverRides = () => {
  const { user } = useContext(AuthContext);
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyRides = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
        // Fetch all rides and we will filter them on the client-side
        const response = await axios.get("http://localhost:3002/api/rides", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter rides where the driver is assigned OR has applied
        // NOTE: This assumes the RideApplications are part of the GET /api/rides response
        // or you would need another endpoint. For now, we filter by driverId in confirmed/completed rides.
        const filteredRides = response.data.filter(
          (ride) => ride.driverId === user._id
        );
        setMyRides(filteredRides);
      } catch (err) {
        console.error(err);
        setMessage("Could not fetch your rides.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyRides();
  }, [user]);

  const handleComplete = async (rideId) => {
    setMessage(`Completing ride ${rideId}...`);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3002/api/rides/${rideId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Ride marked as complete!");
      // Update the UI to reflect the change
      setMyRides(
        myRides.map((ride) =>
          ride._id === rideId ? { ...ride, status: "completed" } : ride
        )
      );
    } catch (err) {
      setMessage("Failed to complete ride.");
      console.error(err);
    }
  };

  // Client-side filtering for display
  const confirmedRides = myRides.filter((ride) => ride.status === "confirmed");
  const completedRides = myRides.filter((ride) => ride.status === "completed");

  if (loading) return <p>Loading your rides...</p>;

  return (
    <div className="container mt-5">
      <h2>My Rides</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="mt-4">
        <h4>Confirmed Rides (To Do)</h4>
        {confirmedRides.length > 0 ? (
          <ul className="list-group">
            {confirmedRides.map((ride) => (
              <li
                key={ride._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>
                    {ride.pickupLocation} to {ride.dropoffLocation}
                  </strong>
                  <p>Passenger contact info would go here</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleComplete(ride._id)}
                >
                  Mark as Completed
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no confirmed rides.</p>
        )}
      </div>

      <div className="mt-5">
        <h4>Ride History (Completed)</h4>
        {completedRides.length > 0 ? (
          <ul className="list-group">
            {completedRides.map((ride) => (
              <li key={ride._id} className="list-group-item">
                {ride.pickupLocation} to {ride.dropoffLocation} -{" "}
                <strong>${ride.desiredFare}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not completed any rides yet.</p>
        )}
      </div>
    </div>
  );
};

export default DriverRides;
