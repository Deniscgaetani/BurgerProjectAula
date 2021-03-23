import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-a6841-default-rtdb.firebaseio.com/'
})

export default instance;
