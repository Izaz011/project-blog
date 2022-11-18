const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken");

const {isValid,isValidRequestBody} = require("../validator/validator")
const { isValidObjectId } = require("mongoose")

const authorModel = require("../models/authorModel")

//====================================create blog=======================================================

const createBlog = async function (req, res) {
    try {
        const requestBody = req.body
        const Id = req.body.authorId

        const { title, authorId, body, tags, category, subcategory } = requestBody

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: " Pls Provide requestBody" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: " Pls Provide title for blog" })
        }
        if (!isValidObjectId(Id)) {
            return res.status(400).send({ status: false, msg: " Pls provide Valid author Id" })
        }
        if (!isValid(body)) {
            return res.status(400).send({ status: false, msg: " Pls Provide body" })
        }

        if (!isValid(tags)) {
            return res.status(400).send({ status: false, msg: "Pls provide tags" })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "pls provide category of Blog" })
        }
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "pls provide subcategory of Blog" })
        }

        if (!isValid(authorId)) {
            return res.status(400).send({ status: false, msg: " Pls provide author Id" })
        }

        const validId = await authorModel.findById(Id)

        if (validId) {
            const blogCreated = await blogModel.create(requestBody)
            return res.status(201).send({ status: true, msg: 'blog created succesfully ', data: blogCreated })

        } else { res.status(400).send({ statusbar: false, msg: 'invalid authorid' }) }
    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.msg })

    }
}


//======================================== delete query =======================================================

const deleteByQuery= async function(req,res){
    try {
        const data = req.query
        const decodedToken = req.decodedToken
        const { category, authorId, tags, subcategory, isPublished } = data
        filterQuery = {isDeleted:false}
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "no data is provided" })
        }
       if(isPublished){ 
        if (isPublished === "true") {
            return res.status(400).send({ status: false, msg: "blog is already published" })
        }
        else {
            filterQuery.isPublished = isPublished
        }
    }
        if (category) {
            filterQuery.category = category
        }
        if (authorId) {
            if (decodedToken.authorId == authorId) {
                filterQuery.authorId = authorId
            }
            else {
                return res.status(400).send({ status: false, msg: "token does not match" })
            }
        }
        if (!authorId) {
            const blogData = await blogModel.find(filterQuery)
            for (let i = 0; i < blogData.length; i++) {
                if (blogData[i].authorId == decodedToken.authorId) {
                    filterQuery.authorId = blogData[i].authorId
                    break;
                    }
                    else if(i==blogData.length-1){
                        return res.status(400).send({ status: false, msg: "token does not match" })
                    }
                 }
            }
        if (tags) {
            filterQuery.tags = tags
        }
        if (subcategory) {
            filterQuery.subcategory = subcategory
        }
        const deletedBlogs = await blogModel.updateMany(
            filterQuery,
            {isDeleted:true,deletedAt:Date.now()}
            )
        if (deletedBlogs.modifiedCount== 0) {
            return res.status(404).send({ status: false, msg: "blog not found" })
        }

        return res.status(200).send({ status: true, msg: deletedBlogs })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}
<<<<<<< HEAD
   

=======
>>>>>>> e90eaf2f38b3fdecca87835cecbc2b51504087dd

//============================================delete blog by path param ==========================================
const deleteBlog = async function (req, res) {

    try {
        let blogId = req.params.blogId

        let deleteBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true } }, { new: true })
        res.status(200).send({ status: true, msg: deleteBlog })
        
        if (!deleteBlog) res.status(404).send({ status: false, msg: "Blogs are not found" })
    }
    catch (error) {
        res.status(500).send({ msg: error })
        console.log({ msg: error })
    }
};


//===================================== put Api =================================================

const updateBlog = async function (req, res) {

    try {
        const blogId = req.params.blogId

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: "Please enter valid blog Id" })
        }

        const findBlogId = await blogModel.findById(blogId)
        if (!findBlogId) {
            return res.status(400).send({ status: false, msg: "blog not found" })
        }
        if (findBlogId) {
            const requestBody = req.body
            const { title, body, tags, subcategory, isPublished } = requestBody

            if (!isValidRequestBody(requestBody)) {
                return res.status(400).send({ status: false, msg: " Pls Provide requestBody" })
            }
            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: " Pls Provide title for blog" })
            }
            if (!isValid(body)) {
                return res.status(400).send({ status: false, msg: "Body is Mandtory" })
            }
            if (!isValid(tags)) {
                return res.status(400).send({ status: false, msg: "Pls provide tags of blog" })
            }
            if (!isValid(subcategory)) {
                return res.status(400).send({ status: false, msg: "Pls provide subCategory of blog" })
            }
            if (!isValid(isPublished)) {
                return res.status(400).send({ status: false, msg: "Pls provide  blog is published or not " })
            }

            let savedData = await blogModel.findOneAndUpdate({ _id: blogId }, {
                $set: { "title": req.body.title, "body": req.body.body, "category": req.body.category },
                $push: { "tags": req.body.tags, "subcategory": req.body.subcategory }
            }
                , { new: true })

            res.status(200).send({ status: true, msg: "blog updated successfuly", data: savedData })
        }

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }



}

//=======================get api==================================================

const getBlog = async function (req, res) {
    try {

        let { authorId, category, tags, subcategory } = req.query
        let filterQuery = { isDeleted: false, isPublished: true }

        if (authorId) {
            if (!isValidObjectId(req.query.authorId)) {
                return res.status(400).send({ status: false, msg: "Please enter valid author Id" })
            }

        }
        if (authorId) { filterQuery.authorId = authorId }

        if (category) { filterQuery.category = category }
        if (tags) { filterQuery.tags = tags }
        if (subcategory) { filterQuery.subcategory = subcategory }

        const detail = await blogModel.find(filterQuery)
        if (detail.length == 0) {
            return res.status(404).send({ status: false, msg: "Blog not Found " })
        }
        else {
            return res.status(200).send({ status: true, msg: "data fetch successfully", data: detail })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deleteByQuery}
