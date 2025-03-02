import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken, getUserFromToken } from '../../utils/auth';
import { UserContext } from '../../contexts/UserContext';
import { login } from '../../services/userService';

export default function Login() {
    const { setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        identifier: '',
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
            navigate('/profiles/index');
        } catch (error) {
            setErrors(error.response?.data?.errors || { general: "Invalid login credentials" });
        }
    };

    const handleChange = (e) => {
        setErrors({ ...errors, [e.target.name]: '' });
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section style={{padding: "20px", maxWidth: "500px", margin: "0 auto"}}>
            <h1> Welcome Back </h1>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: "15px"}}>
                    <label htmlFor="identifier" style={{display: "block", marginBottom: "5px"}}>Username or Email</label>
                    <input
                        type="text"
                        name="identifier"
                        id="identifier"
                        placeholder="Enter your username or email"
                        required
                        onChange={handleChange}
                        style={{width: "100%", padding: "8px"}}
                    />
                    {errors.identifier && <p style={{color: "red"}}>{errors.identifier}</p>}
                </div>

                <div style={{marginBottom: "15px"}}>
                    <label htmlFor="password" style={{display: "block", marginBottom: "5px"}}>Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                        onChange={handleChange}
                        style={{width: "100%", padding: "8px"}}
                    />
                    {errors.password && <p style={{color: "red"}}>{errors.password}</p>}
                </div>

                {errors.general && <p style={{color: "red"}}>{errors.general}</p>}

                <button 
                    style={{padding: "10px 15px", background: "#4285f4", color: "white", border: "none", borderRadius: "4px", opacity: (formData.identifier === '' || formData.password === '') ? 0.5 : 1}}
                    disabled={formData.identifier === '' || formData.password === ''} 
                    type="submit"
                >
                    Log In
                </button>
            </form>
        </section>
    );
}