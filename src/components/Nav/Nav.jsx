import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { removeToken } from '../../utils/auth';
import styles from './nav.module.css';

export default function NavMenu() {
    const { user, setUser } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const signOut = () => {
        removeToken();
        setUser(null);
        setMenuOpen(false);
        navigate("/");
    };
    console.log(user);
    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div className={styles.leftLinks}>
                    <NavLink
                        to="/"
                        className={styles.link}
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </NavLink>
                    {user && (
                        <>
                            <NavLink
                                to="/events"
                                className={styles.link}
                                onClick={() => setMenuOpen(false)}
                            >
                                Events
                            </NavLink>
                            <NavLink
                                to="/events/create"
                                className={styles.link}
                                onClick={() => setMenuOpen(false)}
                            >
                                Create an Event
                            </NavLink>
                            <NavLink
                                to="/events/my-events"
                                className={styles.link}
                                onClick={() => setMenuOpen(false)}
                            >
                                Your Events
                            </NavLink>
                        </>
                    )}
                </div>
                <div className={styles.rightLinks}>
                    {user ? (
                        <>
                            <NavLink to="/" className={styles.link} onClick={signOut}>
                                Sign Out
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/register"
                                className={styles.link}
                                onClick={() => setMenuOpen(false)}
                            >
                                Register
                            </NavLink>
                            <NavLink
                                to="/login"
                                className={styles.link}
                                onClick={() => setMenuOpen(false)}
                            >
                                Log In
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}