// implement your API here
const express = require('express'); // built in node.js module to handle http traffic
const cors = require('cors')
let db = require('./data/db.js')
const server = express(); // the local computer where the server is running
server.use(express.json())
server.use(cors())


server.get("/", (req, res) => {
    console.log("ip:", req.ip)
    res.json({
        message: "Welcome to our API"
    })
            .catch(error => {
            res.status(500).json({
                errorMessage: "The users information could not be retrieved."
            })
        })
})

//get all Users

server.get('/api/users', (req, res) => {

    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({
                errorMessage: "The users information could not be retrieved."
            })
        })
})

//get user by ID

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({
                    message: "The User with the specified ID doesn't exist."
                })
            }
        })
        .catch(error => {
            console.log('GET not working', error)
            res.status(500).json({
                errorMessage: "The User information couldn't be retrieved."
            })
        })
})

// create a new user
server.post('/api/users', (req, res) => {
    const {
        name,
        bio
    } = req.body
    if (!name || !bio) {
        return res.status(400).json({
            error: "Please provide name and bio for the user."
        })
    } else {
        db.insert(req.body)
            .then(user => {
                res.status(201).json({
                    message: `added ${name} to database, their bio is ${bio}`
                })
            })
            .catch(error => {
                console.log(`Post not working`, error)
                res.status(500).json({
                    errorMessage: "There was an error while saving the user to the database"
                })
            })
    }
})

//update user

server.put('/api/users/:id', (req, res) => {
    const {
        name,
        bio
    } = req.body
    if (!name || !bio) {
        res.status(400).json({
            errorMessage: 'Please provide name and bio for the user.'
        })
    } else {
        db.update(req.params.id, req.body)
            .then(user => {
                if (user) {
                    res.status(200).json({
                        message: `user ${id} name changed to ${name} and bio to ${bio}`
                    })
                } else {
                    res.status(404).json({
                        message: "The User with the specified ID does not exist."
                    })
                }
            })
            .catch(error => {
                console.log(`PUT not working`, error)
                res.status(500).json({
                    errorMessage: "The User information couldn't be modified."
                })
            })
    }
})

// delete user

server.delete('/api/users/:id', (req, res) => {

    db.remove(req.params.id)
        .then(response => {
            if (response == 1) {
                db.find()
                    .then(users => {
                        res.status(200).json({
                            delete: response
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            success: false,
                            err
                        })
                    })
            } else {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            }

        })
        .catch(err => {
            res.status(500).json({
                message: "The user could not be removed",
                err
            })
        })
})



const port = 8080
const host = "127.0.0.1" // another way to say "localhost"

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
})