import { useState, useEffect } from 'react';

function Enrollments() {

    const [enrollments, setEnrollments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const fetchEnrollments = () => {
        fetch('https://localhost:3001/api/cv/enrollments')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setEnrollments(data);
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

    const createEnrollment = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = JSON.stringify(Object.fromEntries(formData.entries()));
        fetch('https://localhost:3001/api/cv/enrollments', {
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
            return res.status;
        })
        .then(() => {
            fetchEnrollments();
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    setError("You are not logged in. Please login.");
                    break;
                case '403':
                    setError("You are not authorized to create enrollments.");
                    break;
                default:
                    console.error('Unknown error');
                    setError("An unknown error occurred.");
            }
        });
    }

    const deleteEnrollment = (enrollmentid) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) {
            return;
        }

        fetch(`https://localhost:3001/api/cv/enrollments/${enrollmentid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('accessToken') || ''
            }
        })
        .then((res) => {
            if (res.status != 204) {
                throw new Error(res.status);
            }
            return res.status;
        })
        .then(() => {
            fetchEnrollments();
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    setError("You are not logged in. Please login.");
                    break;
                case '403':
                    setError("You are not authorized to delete enrollments.");
                    break;
                default:
                    console.error('Unknown error');
                    setError("An unknown error occurred.");
            }
        });
    }

    function getUser(userid) {
        if (users.length === 0) {
            return '';
        }
        return users.find((user) => user.userid === userid).username;
    }

    function getSubjectName(subjectid) {
        if (subjects.length === 0) {
            return '';
        }
        return subjects.find((subject) => subject.subjectid === subjectid).name;
    }

    useEffect(() => {
        fetchEnrollments();
        fetchSubjects();
        fetchUsers();
    }, []);

    return (
        <div>
        <h1>Enrollments</h1>

        {enrollments && (
            <table>
                <thead>
                    <tr>
                        <th>Enrollment</th>
                        <th>Student</th>
                        <th>Subject</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {enrollments.map((enrollment) => {
                        return (
                            <tr key={enrollment.enrollmentid}>
                                <td>{enrollment.enrollmentid}</td>
                                <td>{getUser(enrollment.userid)}</td>
                                <td>{getSubjectName(enrollment.subjectid)}</td>
                                <td>{enrollment.role}</td>
                                <td><button onClick={() => deleteEnrollment(enrollment.enrollmentid)}>Delete</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )}

        <h2>Create enrollment</h2>
        <form onSubmit={createEnrollment}>
            <label htmlFor="userid">User:</label>
            <select id="userid" name="UserID">
                {users.map((user) => {
                    return (
                        <option key={user.userid} value={user.userid}>{user.userid} - {user.username}</option>
                    );
                })}
            </select>
            <label htmlFor="subjectid">Subject ID:</label>
            <select id="subjectid" name="SubjectID">
                {subjects.map((subject) => {
                    return (
                        <option key={subject.subjectid} value={subject.subjectid}>{subject.subjectid} - {subject.name}</option>
                    );
                })}
            </select>
            <label htmlFor="role">Role:</label>
            <select id="role" name="Role">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>
            <button type="submit">Create enrollment</button>
        </form>

        </div>
    );
}

export default Enrollments;