const express = require('express');

const { httpCreateCheckoutSessionId } = require('../controllers/checkoutController');
const { isAuth, isCustomer } = require('../middlewares/auth');

const router = express.Router();

router.post('/sessionId', isAuth, isCustomer, httpCreateCheckoutSessionId);


module.exports = router;