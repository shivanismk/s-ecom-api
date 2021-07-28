 express = require('express')
const router = express.Router()
const Category = require('../models/category')
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
 const categoryById = require('../middleware/categoryById')


const { check, validationResult }= require('express-validator')

// @route   POST api/category
// @desc    create category
// @access  Private Admin
router.post('/',[
    check('name','name is required').trim().not().isEmpty()
] , auth,adminAuth,async (req,res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({
           error: errors.array()[0].msg
       })
   } 
   const {
       name
    } =req.body
    try {
        let category = await Category.findOne({ name })
        if(category){
            return res.status(403).json({
                error: 'Category already exit'
            }) 
        }
        const newCategory = new Category({name})
        category = await newCategory.save()
        res.json(category)
    }catch(error){
        console.log(error)
        res.status(500).send('Server Error')
    }
})
// @route   get api/category 
// @desc    get  all category 
// @access  Public
router.get('/all',async (req,res) => {
    try{
        let data = await Category.find({})
        res.json(data)
    }catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
})
// @route   get api/category/:categoryid
// @desc    get single category
// @access  Public
router.get('/:categoryId',categoryById,async (req,res) => { 
    res.json(req.category)
})

// @route   put api/category/:categoryid
// @desc    update single category
// @access  Private admin
router.put('/:categoryId',auth,adminAuth,categoryById,async (req,res) => {
    let category =req.category;
    const { name } = req.body
    if(name) category.name = name.trim()

    try {
        category = await category.save()
        res.json(category)
    }catch (error) {
       console.log(error.message)
       res.status(500).send('server error');  
    }
})

// @route   delete api/category/:categoryid
// @desc    delete single category
// @access  Private admin
router.delete('/:categoryId',auth,adminAuth,categoryById,async(req,res)=>{
    let category = req.category;
    try{
        let deletedCategory = await category.remove()
        res.json({
           message:`${deletedCategory.name} deleted successfully` 
        })
    }catch(error){
        console.log(error.message)
        res.status(500).send('Server error');

    }
})

module.exports = router 