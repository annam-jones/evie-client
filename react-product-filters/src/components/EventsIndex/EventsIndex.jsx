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
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All", 
    "Technology", 
    "Outdoors", 
    "Music", 
    "Arts", 
    "Business", 
    "Community", 
    "Sports", 
    "Food", 
    "Education", 
    "Other"
  ];

  
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = (eventId) => {
    const newEvents = events.filter(event => {
      return event.id !== eventId && event._id !== eventId;
    });
    setEvents(newEvents);
  };

  let filteredEvents = [];
  try {
    filteredEvents = selectedCategory === "All" 
      ? events 
      : events.filter(event => event.category === selectedCategory);
  } catch (err) {
    console.error("Error filtering events:", err);
  }

  if (isLoading) return <p className={styles.loading}>Loading events...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Events</h1>

      <div className={styles.categoryFilter}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.categoryButton} ${selectedCategory === category ? styles.activeCategory : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

    
      {error && <p className={styles.error}>{error}</p>}

     
      {filteredEvents.length === 0 ? (
        <p className={styles.noEvents}>No events found.</p>
      ) : (
        <div className={styles.eventsGrid}>
          {filteredEvents.map(event => (
            <EventProfileCard
              key={event.id || event._id}
              event={event}
              onDelete={handleDeleteEvent}
              onAttendanceChange={(eventId, isAttending) => {
                
                console.log(`Event ${eventId} attendance changed to ${isAttending}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}