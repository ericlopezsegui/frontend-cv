import { useEffect, useState } from 'react';

export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, Password: password })
    };

    useEffect

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Logging in...');

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: username, Password: password })
        };

        try {
            const response = await fetch('https://localhost:3001/api/cv/users/login', requestOptions);
            if (!response.ok) {
                throw new Error(`https error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Success:', data);
            localStorage.setItem("accessToken", data.token);
            window.location.href = '/';
        } catch (error) {
            console.error('There was an error!', error);
            setError('There was an error! ' + error.message);
        }
    };

    return (
        <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <div>
            {error && <p style={{color: "red"}}>{error}</p>}
            <label>Username</label>
            <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div>
            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit">Login</button>
        </form>
        </div>
    );
}