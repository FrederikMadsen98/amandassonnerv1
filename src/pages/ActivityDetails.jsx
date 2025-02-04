import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const ActivityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [editedData, setEditedData] = useState({ name: "", date: "", location: "", time: "", type: "" });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchActivity = async () => {
            const docRef = doc(db, "activities", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setActivity(docSnap.data());
                setEditedData(docSnap.data());
            } else {
                console.log("Ingen aktivitet fundet!");
            }
        };
        fetchActivity();
    }, [id]);

    // ✏️ Opdater aktivitet
    const handleUpdate = async () => {
        const docRef = doc(db, "activities", id);
        await updateDoc(docRef, editedData);
        setActivity(editedData);
        setIsEditing(false);
    };

    // ❌ Slet aktivitet
    const handleDelete = async () => {
        await deleteDoc(doc(db, "activities", id));
        navigate("/dashboard"); // Tilbage til Dashboard efter sletning
    };

    if (!activity) return <p>Indlæser aktivitet...</p>;

    return (
        <div>
            <h2>Aktivitetsdetaljer</h2>
            {isEditing ? (
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
                    <button onClick={handleUpdate}>Gem</button>
                    <button onClick={() => setIsEditing(false)}>Annuller</button>
                </div>
            ) : (
                <div>
                    <p><strong>Navn:</strong> {activity.name}</p>
                    <p><strong>Dato:</strong> {activity.date}</p>
                    <p><strong>Lokation:</strong> {activity.location}</p>
                    <p><strong>Tid:</strong> {activity.time}</p>
                    <button onClick={() => setIsEditing(true)}>Rediger</button>
                    <button onClick={handleDelete}>Slet</button>
                </div>
            )}
            <button onClick={() => navigate("/dashboard")}>Tilbage til Dashboard</button>
        </div>
    );
};

export default ActivityDetails;
