const express = require('express');
const router = express.Router();
const auth = require('../middleware')
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../public/upload') })

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
                name: req.body.name,
                password: req.body.password,
                phoneNum: req.body.phoneNum
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
    .patch(auth(), upload.single('avatar'), (req, res, next) => {
        (async() => {
            let update = {}
            if (req.body.name) update.name = req.body.name
            if (req.body.age) update.age = req.body.age
            console.log(req.file)
            let user = await User.updateUserById(req.params.id, update)
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