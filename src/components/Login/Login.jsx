import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken, getUserFromToken } from '../../utils/auth';
import { UserContext } from '../../contexts/UserContext';
import { login } from '../../services/userService';
import styles from './login.module.css';

export default function Login() {
    const { setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(formData);
            setToken(data.token);
            setUser(getUserFromToken());
            navigate('/');
        } catch (error) {
            setErrors(error.response?.data?.errors || { general: "Invalid login credentials" });
        }
    };

    const handleChange = (e) => {
        setErrors({ ...errors, [e.target.name]: '' });
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.leftColumn}>
                    <h1 className={styles.title}>Log In</h1>
                </div>
                
                <div className={styles.rightColumn}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="Email or Username*"
                                required
                                onChange={handleChange}
                                className={styles.input}
                            />
                            {errors.identifier && <p className={styles.error}>{errors.identifier}</p>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password*"
                                required
                                onChange={handleChange}
                                className={styles.input}
                            />
                            {errors.password && <p className={styles.error}>{errors.password}</p>}
                        </div>
                        
                        <button 
                            type="submit"
                            className={styles.button}
                            disabled={formData.identifier === '' || formData.password === ''}
                        >
                            Log In
                        </button>
                        
                        {errors.general && <p className={styles.error}>{errors.general}</p>}
                    </form>
                </div>
            </div>
            
            <div className={styles.spacer}></div>
        </div>
    );
}