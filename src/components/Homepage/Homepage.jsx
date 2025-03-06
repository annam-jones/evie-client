import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import styles from "./Homepage.module.css";

export default function Homepage() {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.homepage}>
      
      <div className={styles.backgroundContainer}>
        <img 
          src="/james_turrell.jpg" 
          alt="James Turrell art" 
          className={styles.backgroundImage}
        />
      </div>
      
      
      <div className={styles.textOverlay}>
        <h1 className={styles.evieText}>evie</h1>
    
      
 
          
      
      </div>
    </div>
  );
}