import { useState, useEffect } from 'react';

export default function Subjects() {

    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState('');
    
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

    const createSubject = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = JSON.stringify(Object.fromEntries(formData.entries()));
        fetch('https://localhost:3001/api/cv/subjects', {
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
            fetchSubjects();
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    setError("You are not logged in. Please login.");
                    break;
                case '403':
                    setError("You are not authorized to create subjects.");
                    break;
                default:
                    console.error('Unknown error');
                    setError("An unknown error occurred.");
            }
        });
    }

    useEffect(() => {
        setError(null);
        fetchSubjects();
    }, []);

    // show all subjects
    return (
        <div>
            <h1>Subjects</h1>
            <ul>
                {subjects.map((subject) => {
                    return (
                        <li key={subject.subjectid}>
                            <p>{subject.subjectid} - {subject.name} <a href={`/subjects/${subject.subjectid}`}>Go to subject details</a></p>                            
                        </li>
                    );
                })}
            </ul>

            <br />

            {error && <p>{error}</p>}
            
            <form onSubmit={createSubject}>
                <label>Name:</label>
                <input type="text" name="Name" />
                <label>Year:</label>
                <input type="number" name="Year" />
                <label>Description:</label>
                <input type="text" name="Description" />
                <label>Status:</label>
                <select name="Status">
                    <option value="0">Finished</option>
                    <option value="1">Active</option>
                </select>
                <button type="submit">Create Subject</button>
            </form>
            
        </div>
    );
    
}