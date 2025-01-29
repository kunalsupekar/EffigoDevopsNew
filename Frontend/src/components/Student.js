import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Container, Paper, Button, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import apiUrl from './Url';

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
  const [open, setOpen] = useState(false); // State for success Snackbar
  const [errorOpen, setErrorOpen] = useState(false); // State for error Snackbar
  const classes = useStyles();

  const handleClick = async (e) => {
    e.preventDefault();
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
      setOpen(true); // Show success Snackbar
    } catch (error) {
      console.error(error);
      setErrorOpen(true); // Show error Snackbar
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setErrorOpen(false);
  };

  useEffect(() => {
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
        setErrorOpen(true); // Show error Snackbar for failed GET request
      }
    };

    fetchStudents();
  }, []);

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
          <Button variant="contained" color="secondary" onClick={handleClick}>
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

      {/* Snackbar for Success */}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Student added successfully!
        </Alert>
      </Snackbar>

      {/* Snackbar for Error */}
      <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Unable to communicate with the server. Please try again later.
        </Alert>
      </Snackbar>
    </Container>
  );
}
