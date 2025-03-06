import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/userService';
import { setToken, getUserFromToken } from '../../utils/auth';
import styles from './Register.module.css';

export default function Register() {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = await register(formData); 
        setToken(data.token);
        setUser(getUserFromToken());
        navigate('/login');
    } catch (error) {
        setErrors(error.response?.data?.errors || { general: 'An error occurred' });
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
          <h1 className={styles.title}>Register</h1>
        </div>
        
        <div className={styles.rightColumn}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username*"
                required
                onChange={handleChange}
                className={styles.input}
              />
              {errors.username && <p className={styles.error}>{errors.username}</p>}
            </div>
            
            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email*"
                required
                onChange={handleChange}
                className={styles.input}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
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
            
            <div className={styles.formGroup}>
              <input
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                placeholder="Confirm Password*"
                required
                onChange={handleChange}
                className={styles.input}
              />
              {(formData.password.length > 0 && formData.password_confirmation.length > 0 && 
                formData.password !== formData.password_confirmation) &&
                <p className={styles.error}>Passwords do not match</p>
              }
            </div>
            
            <button 
              type="submit"
              className={styles.button}
              disabled={formData.password === '' || formData.password !== formData.password_confirmation}
            >
              Register
            </button>
            
            {errors.general && <p className={styles.error}>{errors.general}</p>}
          </form>
        </div>
      </div>
      
      <div className={styles.spacer}></div>
    </div>
  );
}