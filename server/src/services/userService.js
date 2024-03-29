const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const OTP = require('../models/OTPModel');

async function getMe(userId) {
    let user = await User.findById(userId);
    return user.toJSON();
}

async function changePersonalInfo(userId, reqBody) {
    const {
        username,
        email,
        phoneNumber,
        newPassword,
        birthDate,
        address,
        OTP: otp
    } = reqBody;

    let OTPDocs;
    let error;
    let user;
    switch (true) {
        case Boolean(username):
            return await User.findByIdAndUpdate(userId, { username }, { new: true });

        case Boolean(email):
            OTPDocs = await OTP.find({ contactInfo: email });
            if (OTPDocs.length > 0) {
                const doMatch = await checkMatchingCondition(otp, OTPDocs);
                if (doMatch) {
                    return await User.findByIdAndUpdate(userId, { email }, { new: true });
                }
            }
            error = new Error('Wrong email or OTP');
            error.statusCode = 401;
            throw error;

        case Boolean(phoneNumber):
            OTPDocs = await OTP.find({ contactInfo: phoneNumber });
            if (OTPDocs.length > 0) {
                const doMatch = await checkMatchingCondition(otp, OTPDocs);
                if (doMatch) {
                    return await User.findByIdAndUpdate(userId, { phoneNumber }, { new: true });
                }
            }
            error = new Error('Wrong contact info or OTP');
            error.statusCode = 401;
            throw error;

        case Boolean(newPassword):
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            return await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

        case Boolean(birthDate):
            return await User.findByIdAndUpdate(userId, { birthDate }, { new: true });

        case Boolean(address):
            return await User.findByIdAndUpdate(userId, { address }, { new: true });

        default:
            error = new Error('Bad Request');
            error.statusCode = 400;
            throw error;
    }
}

async function getCustomersCount() {
    const count = await User.countDocuments({ role: 'CUSTOMER' });
    return { count };
}


async function getUsers(role) {
    return await User.find({ role });
}


async function checkMatchingCondition(otp, OTPDocs) {
    for (let OTPDoc of OTPDocs) {
        const comparisonResult = await bcrypt.compare(otp, OTPDoc.OTP);
        if (comparisonResult) {
            return true;
        }
    }
    return false;
}

module.exports = {
    getMe,
    changePersonalInfo,
    getCustomersCount,
    getUsers,
}