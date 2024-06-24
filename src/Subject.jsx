import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Subject() {

    let { id } = useParams();
    const [subject, setSubject] = useState(null);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);

    const fetchSubject = (id) => {
        fetch(`https://localhost:3001/api/cv/subjects/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data[0]);
            setSubject(data[0]);
        });
    }

    const fetchSubjectActivities = (id) => {
        fetch(`https://localhost:3001/api/cv/activities/subject/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setActivities(data);
        });
    }

    const deleteSubject = (id) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) {
            return;
        }

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('accessToken') || ''
            }
        };

        fetch(`https://localhost:3001/api/cv/subjects/${id}`, requestOptions)
        .then((res) => {
            if (res.status != 204) {
                throw new Error(res.status);
            }
            return res;
        })
        .then(() => {
            window.location.href = '/subjects';
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    alert("You are not logged in. Please login.");
                    break;
                case '403':
                    alert("You are not authorized to delete subjects.");
                    break;
                default:
                    console.error('Unknown error');
                    alert("An unknown error occurred.");
            }
        });
    }

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const createActivity = async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const files = formData.getAll('Files');
    
        const promises = files.map(file => convertFileToBase64(file));
        const base64Files = await Promise.all(promises);
    
        const newData = {
            Title: formData.get('Title'),
            Description: formData.get('Description'),
            files: base64Files.map((base64, index) => ({ base64, fileName: files[index].name })),
            Deadline: formData.get('Deadline'),
            SubjectID: formData.get('SubjectID')
        };
    
        if (localStorage.getItem('accessToken') === null) {
            setError("You are not logged in. Please login.");
            return;
        }
    
        fetch('https://localhost:3001/api/cv/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('accessToken') || ''
            },
            body: JSON.stringify(newData)
        })
        .then((res) => {
            if (res.status !== 201) {
                throw new Error(res.status);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            fetchSubjectActivities(id);
        })
        .catch((error) => {
            switch (error.message) {
                case '401':
                    setError("You are not logged in. Please login.");
                    break;
                case '403':
                    setError("You are not authorized to create activities.");
                    break;
                default:
                    console.error('Unknown error');
                    setError("An unknown error occurred.");
            }
        });
    };
    

    useEffect(() => {
        setError(null);
        fetchSubject(id);
        fetchSubjectActivities(id);
    }, [id]);

    return (
        <div>
            {subject === null && <p>Loading...</p>}

            {subject !== null && subject !== undefined &&
                <div>
                    <h1>Subject: {subject && subject.name}</h1>
                    <h2>Subject details</h2>
                    <p>Subject ID: {subject && subject.subjectid}</p>
                    <p>Subject Name: {subject && subject.name}</p>
                    <p>Subject Description: {subject && subject.description}</p>
                    <p>Subject Year: {subject && subject.year}</p>
                    <div style={{display: "inline"}}><p>Subject Status: {subject.status == 1 ? <span>Active</span> : <span>Finished</span>}</p></div>
                    <h2>Activities</h2>
                    <ul>
                        {activities.map((activity) => {
                            return (
                                <li key={activity.activityid}>
                                    <p><a href={`/activities/${activity.activityid}`}>{activity.title}</a> - {activity.description}</p>
                                </li>
                            );
                        })}
                    </ul>

                    <br />

                    {error && <p>{error}</p>}
                    <form onSubmit={createActivity}>
                        <label>Title</label>
                        <input type="text" name="Title" />
                        <label>Description</label>
                        <input type="text" name="Description" />
                        <label>Files</label>
                        <input type="file" name="Files" multiple />
                        <label>Deadline</label>
                        <input type="text" name="Deadline" />
                        <input type="hidden" name="SubjectID" value={subject.subjectid} />
                        <button type="submit">Create</button>
                    </form>

                    <br />

                    <h4>Do you want to delete this subject?</h4>
                    <button onClick={() => deleteSubject(id)}>Delete</button>
                </div>
            }
        </div>
    );
}
