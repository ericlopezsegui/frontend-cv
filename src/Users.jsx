import { useEffect, useState } from "react"

export default function Users() {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const fetchUsers = () => {
        fetch('https://localhost:3001/api/cv/users')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setUsers(data);
        });
    }

    const createUser = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = JSON.stringify(Object.fromEntries(formData.entries()));
        fetch('https://localhost:3001/api/cv/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('accessToken') || ''
            },
            body: data
        })
        .then((res) => {
            if (res.status != 201) {
                throw new Error(res.status);
            }
            console.log(res);
            return res.json();
        })
        .then((data) => {
            console.log(data);
            fetchUsers();
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    setError("You are not logged in. Please login.");
                    break;
                case '403':
                    setError("You are not authorized to create users.");
                    break;
                default:
                    console.error('Unknown error');
                    setError("An unknown error occurred.");
            }
        });
    }
    
    useEffect(() => {
        setError(null);
        fetchUsers();
    }, []);

    return (
        <div>
        <h1>Users</h1>
        <table>
            <thead>
                <tr>
                    <th>UserID</th>
                    <th>Username</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => {
                    return (
                        <tr key={user.userid}>
                            <td><a href={`/users/${user.userid}`}>{user.userid}</a></td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>

        <br />

        {error && <p>{error}</p>}
        <form onSubmit={createUser}>
            <label>Name</label>
            <input type="text" name="Name" />
            <label>Username</label>
            <input type="text" name="Username" />
            <label>Password</label>
            <input type="password" name="Password" />
            <label>Role</label>
            <input type="text" name="Role" />
            <label>Email</label>
            <input type="text" name="Email" />
            <button type="submit">Create</button>
        </form>
        </div>
    )

}