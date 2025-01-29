import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Container, Paper, Button, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginTop: '20px',
  },
  paperStyle: {
    padding: '50px 20px',
    width: 600,
    margin: '20px auto',
  },
  studentsPaper: {
    padding: '20px',
    width: '50%',
    margin: '20px auto',
    maxHeight: '500px',
    overflowY: 'scroll',
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Student() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false); // Success Snackbar
  const [errorOpen, setErrorOpen] = useState(false); // Error Snackbar
  const [apiUrl, setApiUrl] = useState(''); // Store API base URL
  const classes = useStyles();

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const response = await axios.get('https://mapm5z5aa2yzqyosvcujfqwhie0mauin.lambda-url.ap-south-1.on.aws/');
        setApiUrl(response.data); // Set the URL from the response
      } catch (error) {
        console.error("Error fetching API URL:", error); // Log the error
        setErrorOpen(true); // Open error Snackbar if request fails
      }
    };
    
    fetchApiUrl();
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!apiUrl) {
      setErrorOpen(true);
      return;
    }
    const student = { name, address };
    try {
      const response = await fetch(`${apiUrl}/student/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      setOpen(true);

      // Re-fetch students after adding a new one
      const result = await fetch(`${apiUrl}/student/getAll`);
      if (!result.ok) {
        throw new Error('Failed to fetch students');
      }
      const studentsData = await result.json();
      setStudents([studentsData[studentsData.length - 1], ...studentsData]); // Prepend the latest student to the list

    } catch (error) {
      console.error(error);
      setErrorOpen(true);
    }
  };

  useEffect(() => {
    if (!apiUrl) return;

    const fetchStudents = async () => {
      try {
        const response = await fetch(`${apiUrl}/student/getAll`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const result = await response.json();
        setStudents(result);
      } catch (error) {
        console.error(error);
        setErrorOpen(true);
      }
    };

    fetchStudents();
  }, [apiUrl]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setErrorOpen(false);
  };

  return (
    <Container className={classes.container}>
      {/* Left Section: Add Student Form */}
      <Paper elevation={3} className={classes.paperStyle}>
        <h1 style={{ color: 'blue' }}>
          <u>Add Student</u>
        </h1>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            label="Student Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Student Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button variant="contained" color="secondary" onClick={handleClick} disabled={!apiUrl}>
            Submit
          </Button>
        </form>
      </Paper>

      {/* Right Section: Students List */}
      <Paper elevation={3} className={classes.studentsPaper}>
        <h1>Students</h1>
        {students.map((student) => (
          <Paper elevation={6} style={{ margin: '10px', padding: '15px', textAlign: 'left' }} key={student.id}>
            Id: {student.id}
            <br />
            Name: {student.name}
            <br />
            Address: {student.address}
          </Paper>
        ))}
      </Paper>

      {/* Success Snackbar */}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Student added successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Unable to communicate with the server. Please try again later.
        </Alert>
      </Snackbar>
    </Container>
  );
}
