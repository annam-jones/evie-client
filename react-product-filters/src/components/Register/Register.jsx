import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/userService';
import { setToken, getUserFromToken } from '../../utils/auth';

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
    <div style={{padding: "20px", maxWidth: "500px", margin: "0 auto"}}>
      <h1>Register to Evie</h1>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: "15px"}}>
          <label htmlFor="email" style={{display: "block", marginBottom: "5px"}}>Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter an email address"
            required
            onChange={handleChange}
            style={{width: "100%", padding: "8px"}}
          />
          {errors.email && <p style={{color: "red"}}>{errors.email}</p>}
        </div>
        <div style={{marginBottom: "15px"}}>
          <label htmlFor="username" style={{display: "block", marginBottom: "5px"}}>Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter a username"
            required
            onChange={handleChange}
            style={{width: "100%", padding: "8px"}}
          />
          {errors.username && <p style={{color: "red"}}>{errors.username}</p>}
        </div>
        <div style={{marginBottom: "15px"}}>
          <label htmlFor="password" style={{display: "block", marginBottom: "5px"}}>Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter a password"
            required
            onChange={handleChange}
            style={{width: "100%", padding: "8px"}}
          />
          {errors.password && <p style={{color: "red"}}>{errors.password}</p>}
        </div>
        <div style={{marginBottom: "15px"}}>
          <label htmlFor="password_confirmation" style={{display: "block", marginBottom: "5px"}}>Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            placeholder="Re-type the password"
            required
            onChange={handleChange}
            style={{width: "100%", padding: "8px"}}
          />
          {(formData.password.length > 0 && formData.password_confirmation.length > 0 && formData.password !== formData.password_confirmation) &&
            <p style={{color: "red"}}>Passwords do not match</p>
          }
        </div>
        <button 
          disabled={formData.password === '' || formData.password !== formData.password_confirmation} 
          type="submit"
          style={{
            padding: "10px 15px", 
            background: "#4285f4", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            opacity: (formData.password === '' || formData.password !== formData.password_confirmation) ? 0.5 : 1
          }}
        >
          Register
        </button>
        {errors.general && <p style={{color: "red", marginTop: "10px"}}>{errors.general}</p>}
      </form>
    </div>
  );
}