import { getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { userRef } from "../utils/FirebaseConfig";

function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const uid = useAppSelector((quirxtalk) => quirxtalk.auth.userInfo?.uid);

  useEffect(() => {
    if (uid) {
      const getUser = async () => {
        const firestoreQuery = query(userRef, where("uid", "!=", uid));
        const data = await getDocs(firestoreQuery);
        const firebaseUsers = [];

        data.forEach((user) => {
          const userData = user.data();
          firebaseUsers.push({
            ...userData,
            label: userData.name,
          });
        });
        setUsers(firebaseUsers);
      };
      getUser();
    }
  }, [uid]);
  return [users];
}

export default useFetchUsers;