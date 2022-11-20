let jwt = require("jsonwebtoken")
let blogModel = require("../models/blogModel")
let  mongoose = require("mongoose")
const { isValidObjectId } = require("mongoose")




//=========== authentication ======================================================
const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: " token must be present for authentication " })

        jwt.verify(token, "BlogProject", function (err, decodedToken) {
            if (err) {
                return res.status(400).send({ status: false, msg: "token invalid" });
            } 
        
                req.decodedToken = decodedToken
                next() 
        })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//=========================authorisation ======================================================
const authorisation = async function (req, res, next) {
    try{
        
        let blogId = req.params.blogId
        if(!isValidObjectId(blogId)){
            return res.status(400).send({status:false, msg:"please provide valid id"} ) 
        }
        let authorLoggedIn = req.decodedToken.authorId
    
        let findBlog = await blogModel.findById(blogId)

        if(!findBlog){
            return res.status(404).send({status:false, msg:"Author's blog not found"})
        }
        let authorId = findBlog.authorId
        
    
        if (!authorId === authorLoggedIn)
            return res.status(403).send({ stauts: false, msg: "User and user's-token in not matched" })
        next()

     }
    catch(error) {
        return res.status(500).send({ status: false, msg: error.message});
    }
    };

module.exports.authorisation = authorisation
module.exports.authentication = authentication
