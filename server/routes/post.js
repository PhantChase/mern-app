const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const verifyToken = require('../midddleware/auth')

// @route GET api/posts
// @sedc Get posts
// @access Private 
router.get('/', verifyToken, async(req, res) =>{
    try {
        const posts = await Post.find({user: req.userId}).populate('user', ['username'])
        res.json({success: true, posts})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'server error'})
    }
})


// @route POST api/posts
// @sedc Create post
// @access Private 
router.post('/', verifyToken, async(req, res) => {
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
            user: req.userId
        })

        await newPost.save()

        res.json({success: true, message: 'Happy Learning!', post: newPost })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'server error'})
    }
})
// @route PUT api/posts
// @sedc Update post
// @access Private 
router.put('/:id', verifyToken, async(req, res) => {
    const{title, description, url, status} = req.body
    //Simple calidation
    if (!title)
        return res
        .status(400)
        .json({success: false, message: 'Title is requied'})

    try {
        let updatedPost = {
            title,
            description: description || '',
            url : (url.startsWith('https://') ? url :`https://${url}`) || '',
            status: status || 'TO LEARN'
        }

        const postUpdateCondition = {_id: req.params.id, user: req.userId}

        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, {new: true})

        //User not auth to update post
        if(!updatedPost)
        return res.status(401).json({success: false, message: 'Post not found'})

        res.json({success: true, message: 'Excellent progress', post: updatedPost})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'server error'})
    }
})

module.exports = router