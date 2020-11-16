import axios from 'axios'

const MOVIES_API = 'movies'
const MOVIES_HOST = 'http://localhost:8080'
// const MOVIES_HOST = 'https://muvieservices.herokuapp.com';
const MOVIES_API_URL = `${MOVIES_HOST}/${MOVIES_API}`

export default class MovieDataService {

    retrieveAllMovies(name) {
        
        return axios.get(`${MOVIES_API_URL}/allMovies`);
    }

    addMovie(name, movie) {
        
        return axios.post(`${MOVIES_API_URL}/addMovie`, movie);
    }

    retrieveMovie(name, id) {
        
        return axios.get(`${MOVIES_API_URL}/find/${id}`);
    }

    deleteMovie(name, id) {
        
        return axios.delete(`${MOVIES_API_URL}/delete/${id}`);
    }

    updateMovie(name, id, movie) {
        
        return axios.put(`${MOVIES_API_URL}/update`, movie);
    }

    

    saveAndSignUpUser(user) {
        
        return axios.post(`${MOVIES_API_URL}/addUser`, user);
    }

    retrieveUserById(user, id) {
        
        return axios.get(`${MOVIES_API_URL}/user/find/${id}`);
    }

    retrieveUserByEmail(emailId,pwd) {
        
        return axios.get(`${MOVIES_API_URL}/user/find/${emailId}/${pwd}`);
    }
}
