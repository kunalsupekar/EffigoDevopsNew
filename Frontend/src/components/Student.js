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
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Student() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: '20px auto' };
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
        console.log("Fetching API URL...");
        
        // Prefix the URL with the CORS proxy
        const response = await axios.get('https://mapm5z5aa2yzqyosvcujfqwhie0mauin.lambda-url.ap-south-1.on.aws/');
        
        console.log("Response Status:", response.status); // Log status
        console.log("Response Data:", response.data);     // Log raw data
    
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

      console.log('New Student added');
      setOpen(true);
    } catch (error) {
      console.error(error);
      setErrorOpen(true);
    }
  };

  useEffect(() => {
    if (!apiUrl) return; // Ensure API URL is set before fetching students

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
  }, [apiUrl]); // Fetch students only after API URL is set

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setErrorOpen(false);
  };

  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <h1 style={{ color: 'blue' }}>
          <u>Add Student</u>
        </h1>

        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="outlined-basic"
            label="Student Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
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

      <h1>Students</h1>

      <Paper elevation={3} style={paperStyle}>
        {students.map((student) => (
          <Paper
            elevation={6}
            style={{ margin: '10px', padding: '15px', textAlign: 'left' }}
            key={student.id}
          >
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
