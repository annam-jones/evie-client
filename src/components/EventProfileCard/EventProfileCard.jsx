import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./EventProfileCard.module.css";
import { eventDelete, attendEvent, cancelEventAttendance, eventUpdate } from "../../services/eventService";


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxHeight: "80vh", 
  overflow: "auto", 
  backdropFilter: "blur(15px)",
  background: "rgba(255, 255, 255, 0.15)",
  border: "none",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
  color: "white",
  p: 4, 
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "20px", 
};

export default function EventProfileCard({ event, onDelete, onAttendanceChange }) {
  const { user } = useContext(UserContext);
  
  const [open, setOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [isAttending, setIsAttending] = useState(() => {
    const isUserEventsPage = window.location.pathname.includes('/events/my-events');

    if (!isUserEventsPage && event.attendees) {
      return Array.isArray(event.attendees)
        ? event.attendees.some(attendee =>
          attendee === user?.id ||
          attendee.id === user?.id ||
          attendee === user?._id
        )
        : false;
    }

    return isUserEventsPage;
  });

  const handleDelete = async () => {
    try {
      await eventDelete(event.id || event._id);
      if (onDelete) onDelete(event.id || event._id);
      setOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleView = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleUpdateOpen = () => {
    setUpdateModalOpen(true);
  };
  
  const handleUpdateClose = () => {
    setUpdateModalOpen(false);
  };

  const handleAttend = async () => {
    try {
      if (isAttending) {
        await cancelEventAttendance(event.id || event._id);
        setIsAttending(false);
        if (onAttendanceChange) onAttendanceChange(event.id || event._id, false);
      } else {
        await attendEvent(event.id || event._id);
        setIsAttending(true);
        if (onAttendanceChange) onAttendanceChange(event.id || event._id, true);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }; 
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isCreator = 
    (event.created_by && event.created_by == user?.id) || 
    (event.createdBy && event.createdBy == user?._id);

  const [formData, setFormData] = useState({
    title: event.title || "",
    description: event.description || "",
    date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
    time: event.time || "",
    location: event.location || "",
    category: event.category || "",
    eventImage: event.eventImage || "",
    capacity: event.capacity || ""
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const getActionButtonsClass = () => {
    let buttonCount = 1; 
    if (user) buttonCount++; 
    if (isCreator) buttonCount += 2; 
    
    if (buttonCount === 3) return `${styles.eventActions} ${styles.threeButtons}`;
    if (buttonCount === 4) return `${styles.eventActions} ${styles.fourButtons}`;
    return styles.eventActions;
  };

  return (
    <>
      <div className={styles.eventCard}>
        <div className={styles.eventImage} onClick={handleView}>
          {event.eventImage ? (
            <img
              src={event.eventImage}
              alt={`${event.title} event`}
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span>🎉</span>
            </div>
          )}
        </div>
        
        <div className={styles.eventInfo}>
          <div>
            <h3>{event.title}</h3>
            
            {event.category && (
              <div className={styles.eventCategory}>{event.category}</div>
            )}
            
            <p className={styles.eventLocation}>{event.location}</p>
            <p className={styles.eventDate}>{formatDate(event.date)}</p>
          </div>
          
          <div className={getActionButtonsClass()}>
            <button
              className={styles.viewButton}
              onClick={handleView}
            >
              View
            </button>
            
            {user && (
              <button
                className={isAttending ? styles.cancelButton : styles.attendButton}
                onClick={handleAttend}
              >
                {isAttending ? "Cancel" : "Attend"}
              </button>
            )}
            
            {isCreator && (
              <>
                <button
                  className={styles.updateButton}
                  onClick={handleUpdateOpen}
                >
                  Update
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      
      <Modal open={open} onClose={handleClose} aria-labelledby="event-modal-title">
        <Box sx={modalStyle}>
          {event.eventImage && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={event.eventImage}
                alt={`${event.title} event`}
                style={{
                  width: "100%",
                  maxHeight: "200px", 
                  borderRadius: "8px",
                  objectFit: "cover",
                  margin: "0 0 8px 0", 
                }}
              />
            </div>
          )}
          <Typography id="event-modal-title" variant="h6" component="h2" sx={{ fontWeight: "bold", fontSize: "20px", marginBottom: "-5px" }}>
            {event.title}
          </Typography>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Typography sx={{ fontSize: "13px" }}>
              <strong>When: </strong> {formatDate(event.date)}
            </Typography>
            <Typography sx={{ fontSize: "13px" }}>
              <strong>Where: </strong> {event.location}
            </Typography>
            {event.category && (
              <Typography sx={{ fontSize: "13px" }}>
                <strong>Category: </strong> {event.category}
              </Typography>
            )}
            {event.capacity && (
              <Typography sx={{ fontSize: "13px" }}>
                <strong>Capacity: </strong> {event.capacity} people
              </Typography>
            )}
            {event.organizer && (
              <Typography sx={{ fontSize: "13px" }}>
                <strong>Organized by: </strong> {event.organizer}
              </Typography>
            )}
            <Typography sx={{ fontSize: "13px", marginTop: "5px" }}>
              <strong>Description: </strong> {event.description}
            </Typography>
          </div>
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
            <button
              className={isAttending ? styles.cancelButton : styles.attendButton}
              onClick={handleAttend}
              style={{ padding: "8px 15px" }}
            >
              {isAttending ? "Cancel Attendance" : "Attend Event"}
            </button>
            <button
              className={styles.closeButton}
              onClick={handleClose}
              style={{ padding: "8px 15px" }}
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>

     
      <Modal open={updateModalOpen} onClose={handleUpdateClose} aria-labelledby="update-event-modal-title">
        <Box sx={{
          ...modalStyle,
          width: 500,
          height: "auto",
          maxHeight: "90vh",
          overflow: "auto",
          background: "rgba(255, 255, 255, 0.95)",
          color: "#333"
        }}>
        
          <Typography id="update-event-modal-title" variant="h6" component="h2" sx={{ fontWeight: "bold", fontSize: "22px", color: "#333", marginBottom: "20px" }}>
            Update Event
          </Typography>
          
          <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label htmlFor="title" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              />
            </div>
            
            <div>
              <label htmlFor="description" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  fontSize: "16px",
                  resize: "vertical"
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="date" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: "4px",
                    fontSize: "16px"
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="time" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: "4px",
                    fontSize: "16px"
                  }}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="location" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              />
            </div>
            
            <div>
              <label htmlFor="category" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              >
                <option value="">Select a category</option>
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
            </div>
            
            <div>
              <label htmlFor="eventImage" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Event Image URL</label>
              <input
                type="text"
                id="eventImage"
                name="eventImage"
                value={formData.eventImage}
                onChange={handleInputChange}
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              />
            </div>
            
            <div>
              <label htmlFor="capacity" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button
                type="button"
                onClick={handleUpdateClose}
                className={styles.cancelButton}
                style={{ padding: "10px 20px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const cleanedData = {
                      ...event,  
                      title: formData.title,
                      description: formData.description,
                      date: formData.date,
                      time: formData.time,
                      location: formData.location,
                      category: formData.category,
                      eventImage: formData.eventImage,
                      capacity: formData.capacity ? parseInt(formData.capacity) : event.capacity
                    };
                    
                    delete cleanedData._id;  
                    delete cleanedData.id;   
                    delete cleanedData.__v;  
                    
                    const result = await eventUpdate(event.id || event._id, cleanedData);
                    handleUpdateClose();
                    window.location.reload();
                  } catch (error) {
                    console.error("Error updating event:", error);
                    
                    let errorMessage = "Failed to update event";
                    if (error.response) {
                      errorMessage += `: Server returned ${error.response.status}`;
                      if (error.response.data && error.response.data.message) {
                        errorMessage += ` - ${error.response.data.message}`;
                      }
                    } else if (error.message) {
                      errorMessage += `: ${error.message}`;
                    }
                    
                    alert(errorMessage);
                  }
                }}
                className={styles.updateButton}
                style={{ padding: "10px 20px" }}
              >
                Update Event
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}