import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { eventCreate } from "../../services/eventService";
import styles from "./CreateEvent.module.css";
//import ImageUpload from "../ImageUpload/ImageUpload";


export default function CreateEvent() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting event:", formData);
      const newEvent = await eventCreate(formData);
      navigate('/events/index');
    } catch (error) {
      setErrors(
        error.response?.data?.errors || { general: "Failed to create event." }
      );
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Your Event</h1>

      {errors.general && <p className={styles.error}>{errors.general}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Event Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label>Description:</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
          />
        </div>

        <div className={styles.formGroup}>
          <label>Date and Time:</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <button className={styles.button} type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
}