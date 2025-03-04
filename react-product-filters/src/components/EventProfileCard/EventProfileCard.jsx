import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./EventProfileCard.module.css";
import { eventDelete, attendEvent, cancelEventAttendance } from "../../services/eventService";


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: "auto",
  backdropFilter: "blur(15px)",
  background: "rgba(255, 255, 255, 0.15)",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
  color: "white",
  p: 5,
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
};
export default function EventProfileCard({ event, onDelete }) {
  

  
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
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
      await eventDelete(event._id);
      if (onDelete) onDelete(event._id);
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

  const handleAttend = async () => {
    try {
      if (isAttending) {
        await cancelEventAttendance(event.id);
        setIsAttending(false);
      } else {
        await attendEvent(event.id);
        setIsAttending(true);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className={styles.eventCard}>
        <div className={styles.eventImage} onClick={handleView}>
          {event.eventImage ? (
            <img
              src={event.eventImage}
              alt={`${event.title} event`}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span></span>
            </div>
          )}
        </div>
        <div className={styles.eventInfo}>
          <h3>{event.title}</h3>
          <p className={styles.eventDate}>{formatDate(event.date)}</p>
          <p className={styles.eventLocation}>{event.location}</p>
        </div>
        <div className={styles.eventActions}>
          {event.createdBy === user?._id && (
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          <button
            className={styles.viewButton}
            onClick={handleView}
          >
            View Details
          </button>
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
                  maxHeight: "250px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  margin: "8px 0",
                }}
              />
            </div>
          )}
          <Typography id="event-modal-title" variant="h6" component="h2" sx={{ fontWeight: "bold", fontSize: "22px" }}>
            {event.title}
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>
            <strong>When: </strong> {formatDate(event.date)}
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>
            <strong>Where: </strong> {event.location}
          </Typography>
          <Typography sx={{ fontSize: "14px", marginTop: "10px" }}>
            <strong>Description: </strong> {event.description}
          </Typography>
          {event.category && (
            <Typography sx={{ fontSize: "14px" }}>
              <strong>Category: </strong> {event.category}
            </Typography>
          )}
          {event.capacity && (
            <Typography sx={{ fontSize: "14px" }}>
              <strong>Capacity: </strong> {event.capacity} people
            </Typography>
          )}
          {event.organizer && (
            <Typography sx={{ fontSize: "14px", marginTop: "10px" }}>
              <strong>Organized by: </strong> {event.organizer}
            </Typography>
          )}
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <button
              className={isAttending ? styles.cancelButton : styles.attendButton}
              onClick={handleAttend}
            >
              {isAttending ? "Cancel Attendance" : "Attend Event"}
            </button>
            <button
              className={styles.closeButton}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
}