import React, { useState } from 'react';
import axios from 'axios';

function NewsletterForm() {
    const [formData, setFormData] = useState({ firstName: '', email: '' });
    const [responseMsg, setResponseMsg] = useState({ type: '', text: '' });

    const { firstName, email } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/subscribe', formData);
            setResponseMsg({ type: 'success', text: res.data.msg });
            setFormData({ firstName: '', email: '' }); // Clear form
        } catch (err) {
            setResponseMsg({ type: 'error', text: err.response.data.msg || 'An error occurred.' });
        }
    };

    return (
        <div style={{ padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '400px', margin: '2rem auto' }}>
            <h3>Subscribe to LaunchMate!</h3>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={onChange}
                    placeholder="Your First Name"
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Your Email"
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none' }}>
                    Subscribe
                </button>
            </form>
            {responseMsg.text && (
                <p style={{ color: responseMsg.type === 'success' ? 'green' : 'red', marginTop: '10px' }}>
                    {responseMsg.text}
                </p>
            )}
        </div>
    );
}

export default NewsletterForm;