import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { setUser } from "../redux/userSlice";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Edit from "@mui/icons-material/Edit";
import AddExpense from "./AddExpense";

const Bucket = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const user = useSelector((state) => state.user);

  const [bucket, setBucket] = useState(null);
  const [items, setItems] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [editExpenseItem, setEditExpenseItem] = useState({
    open: false,
    expense: null,
  });

  useEffect(() => {
    async function getBucketItems() {
      if (user.uid) {
        const userCollection = await getDoc(
          doc(db, "user_id", user.uid, "buckets", uid)
        );
        setBucket(userCollection.data());

        const bucketItems = await getDocs(
          collection(db, "user_id", user.uid, "buckets", uid, "items")
        );
        let data = [];
        bucketItems.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setItems(data);
      }
    }
    getBucketItems();
  }, [user.uid, uid]);

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

  const addExpense = (name, amount) => {
    console.log("creating");
  };

  const deleteExpense = (expenseId) => {
    console.log("deleting", expenseId);
  };

  return (
    <Grid container sx={{ width: "100vw", height: "100vh" }}>
      {bucket ? (
        <Box style={{ width: "100%" }}>
          <AppBar>
            <Grid
              container
              justifyContent="space-between"
              sx={{ padding: "20px" }}
            >
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </IconButton>

              <IconButton onClick={() => {}}>
                <EditIcon />
              </IconButton>
            </Grid>
          </AppBar>
          <Grid
            container
            justifyContent="center"
            style={{ width: "100%", marginTop: "90px" }}
          >
            <Grid item xs={12} container justifyContent="center">
              <Typography>
                {bucket.icon} {bucket.name}
              </Typography>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
              <Typography>
                You are at ${bucket.total} of ${bucket.amount}!
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <List>
                {items.map((i) => (
                  <ListItem
                    key={i.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {}}
                      >
                        <Edit style={{ color: "white" }} />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={i.amount}
                      secondary={i.description}
                      secondaryTypographyProps={{
                        color: "#FFFFFF50",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Button onClick={() => setOpenAdd(true)}>Add Expense</Button>

            <AddExpense open={openAdd} setOpen={setOpenAdd} bucketId={uid} />
          </Grid>
        </Box>
      ) : (
        <Grid>
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
};

export default Bucket;
