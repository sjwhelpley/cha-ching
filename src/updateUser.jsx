import { useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";
import { useEffect } from "react";

export default function updateUser(user) {
  const dispatch = useDispatch();
  console.log(user);
  useEffect(() => {
    dispatch(
      setUser({
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photo: user.photoURL,
        ...user,
      })
    );
  }, [user]);

  return null;
}
