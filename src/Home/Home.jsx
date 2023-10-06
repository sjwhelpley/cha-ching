import { useDispatch, useSelector } from "react-redux";

import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { Button, Grid, Typography } from "@mui/material";
import CreateBucket from "./CreateBucket";
import { setUser } from "../redux/userSlice";

import { collection, getDocs, getDoc, doc, setDoc } from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [buckets, setBuckets] = useState([]);
  const [total, setTotal] = useState(0);

  const [openCreateBucket, setOpenCreateBucket] = useState(false);

  useEffect(() => {
    async function getBuckets() {
      if (user.uid) {
        // Get user data
        const userCollection = await getDoc(doc(db, "user_id", user.uid));

        if (userCollection.exists()) {
          // Grab current bucket total
          setTotal(userCollection.data().bucketTotal);

          // Get each user bucket
          const userBuckets = await getDocs(
            collection(db, "user_id", user.uid, "buckets")
          );
          let data = [];
          userBuckets.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setBuckets(data);
        } else {
          // Create user collection if it does not exist
          await setDoc(doc(db, "user_id", user.uid), {});
        }
      }
    }
    getBuckets();
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            photo: user.photoURL,
            ...user,
          })
        );
      } else {
        console.log("user is logged out");
        navigate("/login");
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  console.log("BUCKETS", buckets);

  const BucketCard = ({ bucket }) => {
    return (
      <Link to={`/bucket/${bucket.id}`}>
        <Grid
          sx={{
            border: "1px solid #dedbd2",
            borderRadius: "6px",
            padding: "20px",
            margin: "10px",
            backgroundColor: "#4a5759",
            color: "#dedbd2",
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 32 }}>{bucket.icon}</Typography>
          <Typography>{bucket.name}</Typography>
          <Typography>
            ${bucket.total} / ${bucket.amount}
          </Typography>
        </Grid>
      </Link>
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ padding: "20px" }}>
        <Typography sx={{ fontSize: 20 }}>Budgetly</Typography>
        <Button onClick={() => setOpenCreateBucket(true)}>Add Bucket</Button>
        <Typography>TOTAL: ${total}</Typography>
        <>
          {buckets.map((b) => (
            <BucketCard key={b.id} bucket={b} />
          ))}
        </>

        {/* DIALOGS */}
        <CreateBucket open={openCreateBucket} setOpen={setOpenCreateBucket} />
      </div>

      {/* FOOTER */}
      <Grid
        container
        alignItems="center"
        style={{ position: "absolute", bottom: 0, padding: "10px" }}
      >
        <Grid item xs={8}>
          <p>{user.email}</p>
        </Grid>
        <Grid item xs={4}>
          <button onClick={handleLogout}>Sign out</button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
