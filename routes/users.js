const express = require('express');
const router = express.Router();

const User = require('../models/mongoose/user')
    /* GET users listing. */
router.route('/')
    .get((req, res, next) => {
        (async() => {
            let users = await User.getUser()
            return {
                code: 0,
                users: users
            }
        })()
        .then(r => {
                res.json(r)
            })
            .catch(e => {
                next(e)
            })
    })
    .post((req, res, next) => {
        (async() => {
            let users = await User.createNewUser({
                age: req.body.age,
                name: req.body.name
            })
            return {
                code: 0,
                users: users
            }
        })()
        .then(r => {
                res.json(r)
            })
            .catch(e => {
                next(e)
            })
    })
router.route('/:id')
    .get((req, res, next) => {
        (async() => {
            let user = await User.getUserById(req.params.id)
            return {
                code: 0,
                user: user
            }
        })()
        .then(r => {
                res.json(r)
            })
            .catch(e => {
                next(e)
            })
    })
    .patch((req, res) => {
        (async() => {
            let user = await User.updateUserById(req.params.id, {
                name: req.body.name,
                age: req.body.age
            })
            return {
                code: 0,
                user: user
            }
        })()
        .then(r => {
                res.json(r)
            })
            .catch(e => {
                next(e)
            })
    })

module.exports = router;