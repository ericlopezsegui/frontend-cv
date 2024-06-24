import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Request() {

    let { id } = useParams();

    const [request, setRequest] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const fetchRequest = (id) => {
        fetch(`https://localhost:3001/api/cv/requests/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            setRequest(data);
        });
    }

    const fetchSubjects = () => {
        fetch('https://localhost:3001/api/cv/subjects')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            setSubjects(data);
        });
    }

    const fetchUsers = () => {
        fetch('https://localhost:3001/api/cv/users')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            setUsers(data);
        });
    }

    function getUsername(userid) {
        if (users.length === 0 || !users || userid === undefined) {
            return '';
        }
        return users.find((user) => user.userid === userid).username;
    }

    function getSubjectName(subjectid) {
        if (subjects.length === 0 || !subjects || subjectid === undefined) {
            return '';
        }
        return subjects.find((subject) => subject.subjectid === subjectid).name;
    }

    const modifyStatusRequest = (e) => {
        e.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = JSON.stringify(Object.fromEntries(formData.entries()));
        fetch(`https://localhost:3001/api/cv/requests/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('accessToken') || ''
            },
            body: data
        })
        .then((res) => {
            if (res.status != 200) {
                throw new Error(res.status);
            }
            return res.status;
        })
        .then(() => {
            fetchRequest(id);
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    setError("You are not logged in. Please login.");
                    break;
                case '403':
                    setError("You are not authorized to modify requests.");
                    break;
                default:
                    console.error('Unknown error');
                    setError("An unknown error occurred.");
            }
        });
    }

    useEffect(() => {
        fetchSubjects();
        fetchUsers();
        fetchRequest(id);
    }, [id]);

    return (
        <div>
            <h1>Request</h1>

            {request && (
                <div>
                    <h2>{request.requestid}</h2>
                    <p>Join subject request</p>
                    <p>Subject: {getSubjectName(request.subjectid)}</p>
                    <p>Requested by: {getUsername(request.userid)}</p>
                    <p>Status: {request.status}</p>
                </div>
            )}

            <form onSubmit={modifyStatusRequest}>
                <label htmlFor="status">Status</label>
                <select id="status" name="status">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Denied">Denied</option>
                </select>
                <button type="submit">Modify status</button>
            </form>
        </div>
    );
}

export default Request;