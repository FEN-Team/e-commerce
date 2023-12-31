const { body } = require('express-validator');

const ticketChatValidator = [
    body('ticketText')
        .notEmpty()
        .if((value, { req }) => req.role === 'CUSTOMER')
        .withMessage('ticket text should not be empty')
        .if((value, { req }) => req.role === 'ADMIN')
        .withMessage('reply text should not be empty')  
];


module.exports = {
    ticketChatValidator
}