import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getAttendingEvents } from "../../services/eventService";
import EventProfileCard from "../EventProfileCard/EventProfileCard";
import styles from "./UserEvents.module.css";

export default function UserEvents() {
  const { user } = useContext(UserContext);
  const [userEvents, setUserEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserEvents();
    }
  }, [user]);

  const fetchUserEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getAttendingEvents();
      setUserEvents(data || []);
      setError("");
    } catch (error) {
      console.error("Couldn't find your events!", error);
      setError("Failed to load your events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setUserEvents(userEvents.filter(event => event.id !== eventId));
  };

  // Add this new function to handle attendance changes
  const handleAttendanceChange = (eventId, isAttending) => {
    // If the user is no longer attending, remove the event from the list
    if (!isAttending) {
      setUserEvents(userEvents.filter(event => event.id !== eventId));
    }
  };

  if (isLoading) return <p className={styles.loading}>Loading your events...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Events</h1>

      {error && <p className={styles.error}>{error}</p>}

      {userEvents.length === 0 ? (
        <div className={styles.noEvents}>
          <p>You're not attending any events yet.</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {userEvents.map((event) => (
            <EventProfileCard 
              key={event.id} 
              event={event} 
              onDelete={handleDeleteEvent}
              onAttendanceChange={handleAttendanceChange} // Add this prop
            />
          ))}
        </div>
      )}
    </div>
  );
}