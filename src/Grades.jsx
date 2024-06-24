import { useEffect, useState } from "react";

function Grades() {

    const [grades, setGrades] = useState([]);
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        fetchGrades();
        fetchUsers();
        fetchSubjects();
        fetchActivities();
    }, []);

    const fetchGrades = () => {
        fetch('https://localhost:3001/api/cv/grades')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setGrades(data);
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

    const fetchActivities = () => {
        fetch('https://localhost:3001/api/cv/activities')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setActivities(data);
        });
    }


    const createGrade = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = JSON.stringify(Object.fromEntries(formData.entries()));
        fetch('https://localhost:3001/api/cv/grades', {
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
        .then((data) => {
            console.log(data);
            fetchGrades();
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    setError("You are not logged in. Please login.");
                    break;
                case '403':
                    setError("You are not authorized to create grades.");
                    break;
                default:
                    console.error('Unknown error');
                    setError("An unknown error occurred.");
            }
        });
    }

    function getUserName(userid) {
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

    function getActivityTitle(activityid) {
        if (activities.length === 0 || !activities) {
            return '';
        }
        return activities.find((activity) => activity.activityid === activityid).title;
    }

    return (
        <div>
        <h1>Grades</h1>
        {grades && (
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Subject</th>
                        <th>Activity</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map((grade) => {
                        return (
                            <tr key={grade.gradeid}>
                                <td>{getUserName(grade.userid)}</td>
                                <td>{getSubjectName(grade.subjectid)}</td>
                                <td>{getActivityTitle(grade.activityid)}</td>
                                <td>{grade.score}</td>
                            </tr>
                        );
                    }
                    )}
                </tbody>
            </table>
        )}

        <br />

        {error && <p>{error}</p>}

        <form onSubmit={createGrade}>
            <label>User</label>
            <select name="UserID">
                {users.map((user) => {
                    return (
                        <option key={user.userid} value={user.userid}>{user.userid} - {user.username}</option>
                    );
                })}
            </select>
            <label>Subject</label>
            <select name="SubjectID">
                {subjects.map((subject) => {
                    return (
                        <option key={subject.subjectid} value={subject.subjectid}>{subject.subjectid} - {subject.name}</option>
                    );
                })}
            </select>
            <label>ActivityID</label>
            <select name="ActivityID">
                {activities.map((activity) => {
                    return (
                        <option key={activity.activityid} value={activity.activityid}>{activity.activityid} - {activity.title}</option>
                    );
                })}
            </select>
            <label>Grade</label>
            <input type="text" name="Score" />
            <button type="submit">Create</button>
        </form>

        </div>
    );
}

export default Grades;