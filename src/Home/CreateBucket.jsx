import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import {
  collection,
  addDoc,
  FieldValue,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const CreateBucket = ({ open, setOpen }) => {
  const user = useSelector((state) => state.user);

  const [openSelect, setOpenSelect] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [icon, setIcon] = useState("💸");

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSelect = () => {
    setOpenSelect(false);
  };

  const handleCreate = async () => {
    if (name !== "" && amount !== "") {
      try {
        const docRef = await addDoc(
          collection(db, "user_id", user.uid, "buckets"),
          {
            name,
            amount: Number(amount),
            icon,
            total: 0,
          }
        );
        await updateDoc(doc(db, "user_id", user.uid), {
          amount: FieldValue.increment(Number(amount)),
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      handleClose();
    } else {
      alert("Add name and amount.");
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <>
      <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
        <DialogContent sx={{ textAlign: "center" }}>
          <IconButton onClick={() => setOpenSelect(true)}>
            <Typography sx={{ fontSize: 32 }}>{icon}</Typography>
          </IconButton>

          <TextField
            label="Name"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
          />
          <TextField
            type="number"
            label="Amount"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            sx={{ width: "100%" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreate}>Create</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSelect} onClose={handleCloseSelect}>
        <DialogContent sx={{ textAlign: "center" }}>
          <IconButton onClick={() => setOpenSelect(true)}>
            <Typography sx={{ fontSize: 32 }}>{icon}</Typography>
          </IconButton>

          <Picker data={data} onEmojiSelect={(e) => setIcon(e.native)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSelect}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateBucket;
