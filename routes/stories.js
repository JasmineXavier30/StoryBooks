const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
})

router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({status: 'public'})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()

        res.render('stories/index', { stories })
    } catch(e) {
        console.log(e);
        res.render('errors/500')
    }
})

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (e) {
        console.log(e);
        res.render('errors/500')
    }
})


router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('user').lean()
        if(story)
            res.render('stories/show', { story })
        else
            res.render('errors/404')
    } catch(e) {
        console.log(e);
        res.render('errors/500')
    }
})

router.get('/edit/:id', async (req, res) => {
    //console.log(req.user);
    const story = await Story.findById(req.params.id).lean()
    try {
        if(story){
            if(story.user == req.user._id)
                res.render('stories/edit', { story })
            else 
                res.redirect('/stories')
        }
        else
            res.redirect('/stories')
    } catch(e) {
        console.log(e);
        res.render('errors/500')
    }
})

//simple post also will work instead of method override for PUT/DELETE

router.put('/:id', async (req, res) => {
    let story = await Story.findById(req.params.id).lean()

    try {
        if(story) {
            if(story.user == req.user._id) {
                await Story.findOneAndUpdate({ _id: req.params.id}, req.body, {
                    new: true,
                    runValidators: true
                })
                res.redirect('/dashboard')
            } 
            else res.redirect('/stories')
        } 
        else res.render('errors/404') 
    } catch(e) {
        console.log(e);
        res.render('errors/500')
    }
})

router.delete('/:id', async (req, res) => {
    let story = await Story.findById(req.params.id).lean()

    try {
        if(story) {
            if(story.user == req.user.id) {
                await Story.remove({_id: req.params.id})
                res.redirect('/dashboard')
            } 
            else res.redirect('/stories')
        }
        else res.render('errors/404') 
    } catch(e) {
        console.log(e);
        res.render('errors/500')
    }
})

router.get('/user/:id', async (req, res) => {
    try {
        const stories = await Story.find({user: req.params.id, status: 'public'})
        .populate('user')
        .lean()
        res.render('stories/index', {stories})
    } catch(e) {
        console.log(e);
        res.render('/errors/500')
    }
})

module.exports = router;