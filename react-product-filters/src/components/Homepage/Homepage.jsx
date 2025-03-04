import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import styles from "./homepage.module.css";


export default function Homepage() {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.homepage}>
      <div className={styles.heroSection}>
        <img 
          className={styles.backgroundImage} 
          src="/homepageImage.jpg"
          alt="Events background" ></img>
          <div className={styles.verticalText}>
  <span>e</span>
  <span>v</span>
  <span>i</span>
  <span>e</span>
</div>
     </div>
    </div>
  );
}