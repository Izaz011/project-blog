let authorModel = require("../models/authorModel")
let { isValid,isValidRequestBody } = require("../validator/validator")
const jwt = require("jsonwebtoken");

let createAuthor = async function (req, res) {
  let Data = req.body
  const { fname, lname, title, email, password } = Data
  try {

    //-----------------------Data in body || not---------------------------------


    if (!isValidRequestBody(Data)) {
        return res.status(400).send({ status: false, msg: " Pls Provide requestBody" })
    } 

    //-----------------------All varibles valibation-------------------------------

    if (!isValid(fname)) { return res.status(400).send({ status: false, msg: "fname is required" }) }

    if (!isValid(lname)) { return res.status(400).send({ status: false, msg: "Lname is required" }) }

    if (!isValid(title)) { return res.status(400).send({ status: false, msg: "Title is required" }) }

    if (!isValid(email)) { return res.status(400).send({ status: false, msg: "Email is required" }) }

    if (!isValid(password)) { return res.status(400).send({ status: false, msg: "Password is required" }) }

    //--------------------- Email validation --------------------------


    const isEmailAlreadyused = await authorModel.findOne({ email: email })
    if (isEmailAlreadyused) { return res.status(400).send({ status: false, msg: 'Email is already used' }) }

    else {
      let createAuthor = await authorModel.create(Data)
      res.status(201).send({ status: true, msg: createAuthor })
    }
  }
  catch (error) {
    res.status(500).send({ msz: "Error", error: error.message })
  }
}

//======================================login======================================================
const login = async function (req, res) {
  try {
      const email = req.body.email
      const password = req.body.password
      if (!isValid(email)) {
          return res.status(400).send({ status: false, msg: "pls provide email" })
      }

      if (!isValid(password)) {
          return res.status(400).send({ status: false, msg: "pls provide password" })

      }

      if (email && password) {
          const author = await authorModel.findOne({ email: email, password: password })
          if (author) {
<<<<<<< HEAD
             const token = jwt.sign({ authorId: author._id.toString()},"BlogProject")
=======
             const token = jwt.sign({ authorId: author._id.toString() },"BlogProject")
>>>>>>> e90eaf2f38b3fdecca87835cecbc2b51504087dd
              return res.status(200).send({ status: true, token: token })
          }
          else {
              return res.status(401).send({ status: false, msg: "invalid credentials" })
          }
      }
  }
  catch (err) {
      return res.status(500).send({ status: false, msg: err.msg })
  }
}


module.exports.createAuthor = createAuthor
module.exports.login = login
