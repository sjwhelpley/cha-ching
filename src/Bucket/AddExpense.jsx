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
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const AddExpense = ({ open, setOpen, bucketId }) => {
  const user = useSelector((state) => state.user);

  const [openSelect, setOpenSelect] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [icon, setIcon] = useState("💸");

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSelect = () => {
    setOpenSelect(false);
  };

  const handleCreate = async () => {
    if (description !== "" && amount !== 0) {
      console.log(description, amount);
      try {
        const docRef = await addDoc(
          collection(db, "user_id", user.uid, "buckets", bucketId, "items"),
          {
            description,
            amount: Number(amount),
            icon,
          }
        );
        await updateDoc(doc(db, "user_id", user.uid, "buckets", bucketId), {
          total: increment(Number(amount)),
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      handleClose();
    } else {
      alert("Add description and amount.");
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
            label="Description"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
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

export default AddExpense;
