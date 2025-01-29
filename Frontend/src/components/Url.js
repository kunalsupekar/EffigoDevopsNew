// src/apiUrl.js
//const apiUrl = "http://localhost:8080/student";


const apiUrl =process.env.REACT_APP_BASE_URL;
console.log("Base URL  : ", apiUrl);

export default apiUrl;
