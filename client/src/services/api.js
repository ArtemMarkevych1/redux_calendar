import axios from 'axios'

const service = axios.create({
    baseURL:
        process.env.NODE_ENV === 'production'
            ? '/api'
            : 'http://localhost:5000/api',
    withCredentials: true,
})

const errHandler = err => {
    console.error(err)
    if (err.response && err.response.data) {
        console.error('API response', err.response.data)
        throw err.response.data.message
    }
    throw err
}

export const userService = {
    service: service,

    // This method is synchronous and returns true or false
    // To know if the user is connected, we just check if we have a value for localStorage.getItem('user')
    isLoggedIn() {
        return localStorage.getItem('user') != null
    },

    // This method returns the user from the localStorage
    // Be careful, the value is the one when the user logged in for the last time
    getLocalStorageUser() {
        return JSON.parse(localStorage.getItem('user'))
    },

    // This method signs up and logs in the user
    register(userInfo) {
        return service
            .post('/signup', userInfo)
            .then(res => {
                // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
                localStorage.setItem('user', JSON.stringify(res.data))
                return res.data
            })
            .catch(errHandler)
    },

    login(username, password) {
        return service
            .post('/login', {
                username,
                password,
            })
            .then(res => {
                // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
                localStorage.setItem('user', JSON.stringify(res.data))
                return res.data
            })
            .catch(errHandler)
    },

    logout() {
        return service.get('/logout')
    },

    getEvents() {
        return service
            .get('/events')
            .then(res => res.data)
            .catch(errHandler)
    },

    addEvent(body) {
        return service
            .post('/events/add', body)
            .then(res => res.data)
            .catch(errHandler)
    },
    updateEvent(body) {
        return service
            .post('/events/update', body)
            .then(res => res.data)
            .catch(errHandler)
    },
    deleteEvent(body) {
        return service
            .post('/events/delete', body)
            .then(res => res.data)
            .catch(errHandler)
    }
}

