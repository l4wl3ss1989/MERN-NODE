const express = require('express');

const { getUsers } = require('../controllers/users.controllers');

const router = express.Router();

router.get('/', getUsers);
router.post('/signup');
router.post('/login');

module.exports = router;
