const express = require('express');
const router = express.Router();
const userRoutes = require('./users')
const auth = require('./auth')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chat App' });
});

router.use('/api/v1', userRoutes)
router.use('/api/v1', auth);

module.exports = router;
