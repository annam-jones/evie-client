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

  // List of categories - you can customize this based on your data
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
    setEvents(events.filter(event => event.id !== eventId));
  };

  // Filter events by selected category
  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  if (isLoading) return <p className={styles.loading}>Loading events...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Events</h1>

      <div className={styles.filterContainer}>
        <label htmlFor="category-filter" className={styles.filterLabel}>
          Filter by Category:
        </label>
        <select
          id="category-filter"
          className={styles.categorySelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {filteredEvents.length === 0 ? (
        <div className={styles.noEvents}>
          <p>
            {selectedCategory === "All" 
              ? "There are no events available." 
              : `No ${selectedCategory} events found.`}
          </p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {filteredEvents.map((event) => (
            <EventProfileCard 
              key={event.id} 
              event={event} 
              onDelete={handleDeleteEvent} 
            />
          ))}
        </div>
      )}
    </div>
  );
}