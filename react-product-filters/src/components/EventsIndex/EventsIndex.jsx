import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { eventIndex } from "../../services/eventService";
import EventProfileCard from "../EventProfileCard/EventProfileCard";
import styles from "./EventsIndex.module.css";

export default function EventsIndex() {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventIndex();
      console.log("API returned events:", data); 
      setEvents(data || []);
      setError("");
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event._id !== eventId));
  };

  if (isLoading) return <p className={styles.loading}>Loading events...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Events</h1>

      {error && <p className={styles.error}>{error}</p>}

      {events.length === 0 ? (
        <div className={styles.noEvents}>
          <p>There are no events available.</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {events.map((event) => (
            <EventProfileCard 
              key={event._id} 
              event={event} 
              onDelete={handleDeleteEvent} 
            />
          ))}
        </div>
      )}
    </div>
  );
}