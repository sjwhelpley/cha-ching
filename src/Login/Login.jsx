import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { Grid, Paper, TextField, Typography } from "@mui/material";
import updateUser from "../updateUser";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  }, []);

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch(
          setUser({
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            photo: user.photoURL,
            ...user,
          })
        );
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100vw", height: "100vh" }}
    >
      <Paper sx={{ width: "75%", textAlign: "center" }}>
        <Typography>Sign in to Budget</Typography>
        <Grid container sx={{ p: 3 }} alignContent="center" spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="email"
              label="Email"
              placeholder="Email address"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <button onClick={onLogin}>Login</button>
          </Grid>
        </Grid>
        <p className="text-sm text-white text-center">
          No account yet? <NavLink to="/signup">Sign up</NavLink>
        </p>
      </Paper>
    </Grid>
  );
};

export default Login;
