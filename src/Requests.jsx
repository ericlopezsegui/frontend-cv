import { useEffect, useState } from "react";

function Requests() {

    const [requests, setRequests] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const fetchRequests = () => {
        fetch('https://localhost:3001/api/cv/requests')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setRequests(data);
        });
    }

    const fetchSubjects = () => {
        fetch('https://localhost:3001/api/cv/subjects')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setSubjects(data);
        });
    }

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

    function getUsername(userid) {
        if (users.length === 0 || !users) {
            return '';
        }
        return users.find((user) => user.userid === userid).username;
    }

    function getSubjectName(subjectid) {
        if (subjects.length === 0 || !subjects) {
            return '';
        }
        return subjects.find((subject) => subject.subjectid === subjectid).name;
    }

    const createRequest = (e) => {
        e.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = JSON.stringify(Object.fromEntries(formData.entries()));
        fetch('https://localhost:3001/api/cv/requests', {
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
            return res.json();
        })
        .then(() => {
            fetchRequests();
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    setError("You are not logged in. Please login.");
                    break;
                case '403':
                    setError("You are not authorized to create requests.");
                    break;
                default:
                    console.error('Unknown error');
                    setError("An unknown error occurred.");
            }
        });
    }

    useEffect(() => {
        setError(null);
        fetchRequests();
        fetchSubjects();
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Requests</h1>

            <table>
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Subject ID</th>
                        <th>User ID</th>
                        <th>Request Date</th>
                        <th>Request Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => {
                        return (
                            <tr key={request.requestid}>
                                <td><a href={`/requests/${request.requestid}`}>{request.requestid}</a></td>
                                <td>{getSubjectName(request.subjectid)}</td>
                                <td>{getUsername(request.userid)}</td>
                                <td>{new Date(request.request_time).toLocaleString()}</td>
                                <td>{request.status}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <br />

            {error && <p>{error}</p>}
            <form onSubmit={createRequest}>
                <label>Subject: </label>
                <select name="SubjectID">
                    {subjects.map((subject) => {
                        return (
                            <option key={subject.subjectid} value={subject.subjectid}>
                                {subject.name}
                            </option>
                        )
                    })}
                </select>
                <label>User: </label>
                <select name="UserID">
                    {users.map((user) => {
                        return (
                            <option key={user.userid} value={user.userid}>
                                {user.username}
                            </option>
                        )
                    })}
                </select>
                <label>Status: </label>
                <select name="status">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Denied">Denied</option>
                </select>
                <input type="hidden" name="request_time" value={new Date().toISOString()} />
                <button type="submit">Create Request</button>
            </form>
        </div>
    )
}

export default Requests;