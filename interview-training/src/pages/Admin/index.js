import Header from "../../layouts/sections/Header";
import "./main.css";
import React, { Component } from "react";
import MyEditor from "./Components/richTextEditor";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";

const theme = createTheme();

function Admin() {
  const [logicQuestion, setLogicQuestion] = React.useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // send logic question
    async function insertLogicQuestion() {
      let response = await axios.post(
        "http://localhost:3001/api/1.0/training/question/logic",
        {
          data: {
            title: data.get("title"),
            description: data.get("description"),
          },
        }
      );
      setLogicQuestion(response);
    }
    insertLogicQuestion();
  };

  React.useEffect(
    (e) => {
      if (logicQuestion) {
        console.log("insert success", logicQuestion);
        alert("insert success");
      }
    },
    [logicQuestion]
  );

  return (
    <>
      {" "}
      <Helmet>
        <meta charset="utf-8" />
      </Helmet>
      <Header />;
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              新增 Logic 題目
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    autoComplete="title"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="description"
                    label="Description"
                    type="description"
                    id="description"
                    autoComplete="new-description"
                  />
                </Grid>
                <div id="container">
                  <MyEditor />
                </div>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                新增題目
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Admin;
