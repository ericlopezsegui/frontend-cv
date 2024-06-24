import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Activity() {

    let { id } = useParams();

    const [activity, setActivity] = useState(null);
    const [error, setError] = useState(null);

    const fetchActivity = (id) => {
        fetch(`https://localhost:3001/api/cv/activities/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setActivity(data);
        })
        .catch((err) => {
            console.error(err);
            setError("Error fetching activity data.");
        });
    }

    const convertFilesToBase64 = (files) => {
        return Promise.all(Array.from(files).map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        file: reader.result,
                        name: file.name
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }));
    }

    const updateActivity = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        convertFilesToBase64(formData.getAll('Files'))
        .then((filesBase64) => {
            const data = {
                Title: formData.get('Title'),
                Description: formData.get('Description'),
                SubjectID: formData.get('SubjectID'),
                Deadline: formData.get('Deadline'),
                Files: filesBase64
            };

            if (localStorage.getItem('accessToken') === null) {
                setError("You are not logged in. Please login.");
                return;
            }

            fetch(`https://localhost:3001/api/cv/activities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('accessToken') || ''
                },
                body: JSON.stringify(data)
            })
            .then((res) => {
                if (res.status !== 204) {
                    throw new Error(res.status);
                }
                fetchActivity(id);
            })
            .catch((error) => {
                switch (error.message) {
                    case '401':
                        setError("You are not logged in. Please login.");
                        break;
                    case '403':
                        setError("You are not authorized to update activities.");
                        break;
                    default:
                        console.error('Unknown error');
                        console.error(error);
                        setError("An unknown error occurred.");
                }
            });
        });
    }

    useEffect(() => {
        setError(null);
        fetchActivity(id);
    }, [id]);

    return (
        <div>
            <h1>Activity {id}</h1>
            {activity === null && <p>Loading...</p>}
            {activity && 
                <div>
                    <p>Activity ID: {activity.activityid}</p>
                    <p>Title: {activity.title}</p>
                    <p>Description: {activity.description}</p>
                    <p>Subject ID: <a href={`/subjects/${activity.subjectid}`}>{activity.subjectid}</a></p>
                    <p>Deadline: {activity.deadline}</p>
                    {activity.files && activity.files.length > 0 && (
                        <div>
                            <p>Files:</p>
                            <ul>
                                {activity.files.map((file, index) => (
                                    <li key={index}>
                                        <a download ={file.fileName} href={activity.file}>Download</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <br />

                    <h2>Update activity</h2>
                    {error && <p>{error}</p>}
                    <form onSubmit={updateActivity}>
                        <label>Title</label><br />
                        <input type="text" name="Title" defaultValue={activity.title} /><br />
                        <label>Description</label><br />
                        <input type="text" name="Description" defaultValue={activity.description} /><br />
                        <label>Subject ID</label><br />
                        <input type="text" name="SubjectID" defaultValue={activity.subjectid} /><br />
                        <label>Deadline</label><br />
                        <input type="text" name="Deadline" defaultValue={activity.deadline} /><br />
                        <label>Files</label><br />
                        <input type="file" name="Files" multiple /><br />
                        <input type="hidden" name="ActivityID" value={activity.activityid} />
                        <input type="submit" value="Update" />
                    </form>
                </div>
            }
        </div>
    );
}
