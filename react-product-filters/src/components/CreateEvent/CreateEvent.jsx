import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { eventCreate } from "../../services/eventService";
import styles from "./CreateEvent.module.css";

export default function CreateEvent() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    capacity: "",
    organizer: user?.name || "",
    eventImage: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const eventData = {
      ...formData,
      capacity: formData.capacity ? Number(formData.capacity) : null,
      createdBy: user?._id,
    };
    
    try {
      console.log("Submitting event:", eventData);
      const newEvent = await eventCreate(eventData);
      navigate('/events/index');
    } catch (error) {
      setErrors(
        error.response?.data?.errors || { general: "Failed to create event." }
      );
    }
  };

  const handleChange = (event) => {
    setErrors({ ...errors, [event.target.name]: '' });
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <h1 className={styles.title}>Create Event</h1>
        </div>
        
        <div className={styles.rightColumn}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Event Title*"
                value={formData.title}
                onChange={handleChange}
                required
                className={styles.input}
              />
              {errors.title && <p className={styles.error}>{errors.title}</p>}
            </div>

            <div className={styles.formGroup}>
              <textarea
                name="description"
                id="description"
                placeholder="Event Description*"
                value={formData.description}
                onChange={handleChange}
                required
                className={`${styles.input} ${styles.textarea}`}
              />
              {errors.description && <p className={styles.error}>{errors.description}</p>}
            </div>

            <div className={styles.formGroup}>
              <input
                type="datetime-local"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <label htmlFor="date" className={styles.dateLabel}>Date and Time*</label>
              {errors.date && <p className={styles.error}>{errors.date}</p>}
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Location*"
                value={formData.location}
                onChange={handleChange}
                required
                className={styles.input}
              />
              {errors.location && <p className={styles.error}>{errors.location}</p>}
            </div>

            <div className={styles.formGroup}>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`${styles.input} ${styles.select}`}
              >
                <option value="" disabled>Select a category*</option>
                <option value="Technology">Technology</option>
                <option value="Outdoors">Outdoors</option>
                <option value="Music">Music</option>
                <option value="Arts">Arts</option>
                <option value="Business">Business</option>
                <option value="Community">Community</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className={styles.error}>{errors.category}</p>}
            </div>

            <div className={styles.formGroup}>
              <input
                type="number"
                name="capacity"
                id="capacity"
                placeholder="Capacity (optional)"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className={styles.input}
              />
              {errors.capacity && <p className={styles.error}>{errors.capacity}</p>}
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                name="organizer"
                id="organizer"
                placeholder="Organizer*"
                value={formData.organizer}
                onChange={handleChange}
                required
                className={styles.input}
              />
              {errors.organizer && <p className={styles.error}>{errors.organizer}</p>}
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                name="eventImage"
                id="eventImage"
                placeholder="Event Image URL (optional)"
                value={formData.eventImage}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.eventImage && <p className={styles.error}>{errors.eventImage}</p>}
            </div>

            <button 
              type="submit"
              className={styles.button}
              disabled={!formData.title || !formData.description || !formData.date || !formData.location || !formData.category || !formData.organizer}
            >
              Create Event
            </button>
            
            {errors.general && <p className={styles.error}>{errors.general}</p>}
          </form>
        </div>
      </div>
      
      <div className={styles.spacer}></div>
    </div>
  );
}