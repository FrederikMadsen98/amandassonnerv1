import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [editingActivity, setEditingActivity] = useState(null);
    const [editedData, setEditedData] = useState({ name: "", date: "", location: "", time: "" });

    useEffect(() => {
        const fetchActivities = async () => {
            const querySnapshot = await getDocs(collection(db, "activities"));
            const activityData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setActivities(activityData);
        };
        fetchActivities();
    }, []);

    // Rediger en aktivitet
    const handleEdit = (activity) => {
        setEditingActivity(activity.id);
        setEditedData({ name: activity.name, date: activity.date, location: activity.location, time: activity.time });
    };

    const handleSaveEdit = async (id) => {
        const activityRef = doc(db, "activities", id);
        await updateDoc(activityRef, editedData);
        setEditingActivity(null);

        // Opdater listen
        setActivities((prev) =>
            prev.map((activity) => (activity.id === id ? { ...activity, ...editedData } : activity))
        );
    };

    // Slet en aktivitet
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "activities", id));
        setActivities(activities.filter((activity) => activity.id !== id));
    };

    return (
        <div>
            <h2>Liste over aktiviteter</h2>
            <ul>
                {activities.map((activity) => (
                    <li key={activity.id}>
                        {editingActivity === activity.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedData.name}
                                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                                />
                                <input
                                    type="date"
                                    value={editedData.date}
                                    onChange={(e) => setEditedData({ ...editedData, date: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editedData.location}
                                    onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                                />
                                <input
                                    type="time"
                                    value={editedData.time}
                                    onChange={(e) => setEditedData({ ...editedData, time: e.target.value })}
                                />
                                <button onClick={() => handleSaveEdit(activity.id)}>Gem</button>
                                <button onClick={() => setEditingActivity(null)}>Annuller</button>
                            </div>
                        ) : (
                            <div>
                                <strong>{activity.name}</strong> - {activity.date} kl. {activity.time} @ {activity.location}
                                <button onClick={() => handleEdit(activity)}>Rediger</button>
                                <button onClick={() => handleDelete(activity.id)}>Slet</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityList;