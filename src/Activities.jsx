import { useState, useEffect } from 'react';

export default function Activities() {

    const [activities, setActivities] = useState([]);
    const [error, setError] = useState('');

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

    useEffect(() => {
        setError(null);
        fetchActivities();
    }, []);

    return (
        <div>
            <h1>Activities<button onClick={() => {window.location.href = '/activities/create';}}>Add</button></h1>
            <table>
                <thead>
                    <tr>
                        <th>ActivityID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Subject</th>
                        <th>Deadline</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity) => {
                        return (
                            <tr key={activity.activityid}>
                                <td><a href={`/activities/${activity.activityid}`}>{activity.activityid}</a></td>
                                <td>{activity.title}</td>
                                <td>{activity.description}</td>
                                <td><a href={`/subjects/${activity.subjectid}`}>{activity.subjectid}</a></td>
                                <td>{activity.deadline}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}