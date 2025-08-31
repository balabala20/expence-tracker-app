import React, {useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import './Auth.css'; // Import the CSS file

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        login(email, password);
    };

    if (isAuthenticated) {
        return <Redirect to="/" />;
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">Login</h1>
                <p className="auth-subtitle">Welcome back! Please enter your details.</p>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                    </div>
                    <input type="submit" className="auth-button" value="Login" />
                </form>
                <p className="auth-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);