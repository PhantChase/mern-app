const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

// @route POST api/posts
// @sedc Create post
// @access Private 
router.post('/', async(req, res) => {
    const{title, description, url, status} = req.body
    //Simple calidation
    if (!title)
        return res
        .status(400)
        .json({success: false, message: 'Title is requied'})

    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url :`https://${url}`,
            status: status || 'TO LEARN',
            user: '61029af0ced2a40aec105e3b'
        })

        await newPost.save()

        res.json({success: true, message: 'Happy Learning!', post: newPost })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'server error'})
    }
})

module.exports = router