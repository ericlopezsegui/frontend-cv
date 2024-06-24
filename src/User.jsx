import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function User() {

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    let { id } = useParams();

    const fetchUser = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('accessToken') || ''
            }
        };

        fetch(`https://localhost:3001/api/cv/users/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 403) {
                setError("You are not authorized to view this user.");
                throw new Error(res.status);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setUser(data);
        })
    }

    const deleteUser = (id) => {
        //show alert with a cancel option
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('accessToken') || ''
            }
        };

        fetch(`https://localhost:3001/api/cv/users/${id}`, requestOptions)
        .then((res) => {
            if (res.status != 204) {
                throw new Error(res.status);
            }
            return res;
        })
        .then(() => {
            window.location.href = '/users';
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    alert("You are not logged in. Please login.");
                    break;
                case '403':
                    alert("You are not authorized to delete users.");
                    break;
                default:
                    console.error('Unknown error');
                    alert("An unknown error occurred.");
            }
        });
    }

    useEffect(() => {
        fetchUser(id);
    }, [id]);

    return (
        <div>
        <h1>User: </h1>
            {user ? (
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>User ID</strong></td>
                                <td>{user.userid}</td>
                            </tr>
                            <tr>
                                <td><strong>Username</strong></td>
                                <td>{user.username}</td>
                            </tr>
                            <tr>
                                <td><strong>Role</strong></td>
                                <td>{user.role}</td>
                            </tr>
                            <tr>
                                <td><strong>Email</strong></td>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <td><strong>Name</strong></td>
                                <td>{user.name}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>User enrollments</h2>

                    <h4>Do you want to delete this user?</h4>
                    <button onClick={() => deleteUser(user.userid)}>Delete</button>
                </div>
            ) : (error ? <p>{error}</p> : <p>Loading...</p>)}
        </div>
    )
}

export default User;