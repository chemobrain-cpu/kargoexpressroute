const express = require("express")
const router = express.Router()
const { verifyAdmin} = require("../utils/utils")
const { deleteCosignment, newCosignment, updateCosignment,sendEmail,validateToken } = require("../controller/admin")

let login = require("../controller/admin").login
let signup = require("../controller/admin").signup

let getAdmin = require("../controller/admin").getAdmin
let updateAdmin = require("../controller/admin").updateAdmin

let getCosignments = require("../controller/admin").getCosignments
let getCosignment = require("../controller/admin").getCosignment

//auth routes
router.post("/validate-token",validateToken )
router.post('/adminlogin',login)
router.post('/adminsignup',signup)

//Admin Routes
router.get('/admin/:id',verifyAdmin,getAdmin)
router.patch('/admin/:id',verifyAdmin,updateAdmin)


//Cosignment route Routes
router.get('/cosignments',verifyAdmin,getCosignments)
router.get('/cosignments/:id',verifyAdmin,getCosignment)
router.patch('/cosignments/:id',verifyAdmin,updateCosignment)
router.delete('/cosignments/:id',verifyAdmin,deleteCosignment)
router.post('/cosignment',verifyAdmin,newCosignment)

// history route
router.post('/sendemail',sendEmail)


exports.router = router