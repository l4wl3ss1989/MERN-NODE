const express = require('express');

const { getUsers, createUser, loginUser } = require('../controllers/users.controllers');

const router = express.Router();

router.get('/', getUsers);
router.post('/signup', createUser);
router.post('/login', loginUser);

module.exports = router;
