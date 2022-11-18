const express = require('express');


const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController=require("../controllers/blogController")
const MW = require("../middleware/auth")

//==============create author==============================

router.post("/authors",authorController.createAuthor)

//====================login=================================

router.post("/login",authorController.login)

//================create blog=====================================================

router.post("/blogs",MW.authentication,blogController.createBlog)

//=============get blog===============================================================

router.get("/blogs",MW.authentication,blogController.getBlog)

//================ update api===========================================================

router.put("/blogs/:blogId",MW.authentication,MW.authorisation,blogController.updateBlog)

//==================delete by path param===================================================

router.delete("/blogs/:blogId",MW.authentication,MW.authorisation,blogController.deleteBlog)

//=================== delete by query param==================================================

router.delete("/blogs",MW.authentication,blogController.deleteByQuery)



module.exports = router;
