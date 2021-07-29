const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')

const User = require('../models/User')

// @route Post api/auth/register
// @desc Register user
// @access Public
router.post('/register', async(req, res) => {
    const {username, password} = req.body
    //Simple validation
    if (!username || !password)
    return res.status(400).json({success: false, message: 'Missing username and/or password'})
    try {
        const user = await User.findOne({username})
        if (user)
        return res.status(400).json({success: false, message: ' Username already taken'})
        // All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({username, password: hashedPassword})
        await newUser.save()

        // return token
        const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET)
        res.json({success: true, message: 'Register successfuly', accessToken})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'server error'})
    }
})
// @route Post api/auth/login
// @desc Login user
// @access Public
router.post('/login', async(req, res) => {
    const {username, password} = req.body
    //Simple validation
    if (!username || !password)
    return res.status(400).json({success: false, message: 'Missing username and/or password'})

    try {
        // Check gor existing user
        const user = await User.findOne({username})
        if (!user)
            return res.status(400).json({success: false, message: 'Incorrect username and/or password'})
        const passwordValid = await argon2.verify(user.password, password)
        if(!passwordValid)
            return res.status(400).json({success: false, message: 'Incorrect username and/or password'})
            //All good
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET)
        res.json({success: true, message: 'Login successfuly', accessToken})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'server error'})
    }
})

module.exports = router