import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();
  }, []);

  const upgradeToAdmin = async (userId) => {
    await updateDoc(doc(db, "users", userId), {
      role: "admin",
    });
    alert("Brugeren er nu admin!");
  };

  return (
    <div>
      <h2>Brugerliste</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.firstName} {user.lastName} - {user.role}
            {user.role !== "admin" && (
              <button onClick={() => upgradeToAdmin(user.id)}>Gør til admin</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;