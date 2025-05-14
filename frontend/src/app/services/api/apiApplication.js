import axios from 'axios';

const apiApplication = axios.create({
  baseURL: 'http://localhost:5005', // Assure-toi que ce port correspond
});

export default apiApplication;
