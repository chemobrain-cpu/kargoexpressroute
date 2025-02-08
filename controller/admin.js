const express = require("express")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { generateAcessToken, shipmentMessage } = require('../utils/utils')
const { Admin, Cossignment,User } = require("../database/databaseConfig");
const { validationResult } = require("express-validator");
const random_number = require('random-number')
const Mailjet = require('node-mailjet')


module.exports.validateToken = async (req, res, next) => {
   try {
      // Get the token from the "Authorization" header and remove the "Bearer " prefix
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
         console.log('token')

         return res.status(401).json({
            response: "A token is required for authentication"
         });
      }

      // Verify the token with the secret key
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const user = await Admin.findOne({ email: decodedToken.email });

      if (!user) {
         console.log('token')
         // If the user does not exist, return a 404 response
         return res.status(404).json({
            response: "User not found"
         });
      }



      // Return a success response with user data if the token is valid
      return res.status(200).json({
         response: token,
         user: user
      });

   } catch (error) {
      // If the token is invalid or any other error occurs, handle it here
      return res.status(401).json({
         response: error.message || "An error occurred. Please try again later."
      });
   }
}

module.exports.signup = async (req, res, next) => {
   try {
      //email verification
      let { password, email, secretKey } = req.body

      //checking for validation error
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         let error = new Error("invalid user input")
         return next(error)
      }

      //check if the email already exist
      let adminExist = await Admin.findOne({ email: email })

      if (adminExist) {
         let error = new Error("admin is already registered")
         //setting up the status code to correctly redirect user on the front-end
         error.statusCode = 301
         return next(error)
      }


      //check for secretkey
      if (secretKey !== 'tracking') {
         let error = new Error("secretKey mismatched")
         error.statusCode = 300
         return next(error)
      }
      //delete all previous admin

      let deleteAdmins = await Admin.deleteMany()

      if (!deleteAdmins) {
         let error = new Error("an error occured on the server")
         error.statusCode = 300
         return next(error)

      }


      //hence proceed to create models of admin and token
      let newAdmin = new Admin({
         _id: new mongoose.Types.ObjectId(),
         email: email,
         password: password,
      })

      let savedAdmin = await newAdmin.save()

      if (!savedAdmin) {
         //cannot save user
         let error = new Error("an error occured")
         return next(error)
      }

      let token = generateAcessToken(email)

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: savedAdmin,
            token: token,
            expiresIn: '500',
         }
      })


   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.login = async (req, res, next) => {
   try {
      let { email, password } = req.body
      //checking for validation error
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         let error = new Error("invalid user input")
         return next(error)
      }

      let adminExist = await Admin.findOne({ email: email })


      if (!adminExist) {
         return res.status(404).json({
            response: "admin is not yet registered"
         })
      }



      //check if password corresponds
      if (adminExist.password != password) {
         let error = new Error("Password does not match")
         return next(error)
      }

      let token = generateAcessToken(email)

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: adminExist,
            token: token,
            expiresIn: '500',
         }
      })


   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}
//admin routes
module.exports.getAdmin = async (req, res, next) => {

   try {
      let adminId = req.params.id

      let admin_ = await Admin.findOne({ _id: adminId })


      if (!admin_) {
         let error = new Error("user not found")
         return next(error)
      }

      return res.status(200).json({
         response: {
            admin_
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}
module.exports.updateAdmin = async (req, res, next) => {
   try {
      let {
         email, password, walletAddress, phoneNumber, name, bitcoinwalletaddress, zellewalletaddress, etheriumwalletaddress,
         cashappwalletaddress,
         gcashname,
         gcashphonenumber,
      } = req.body


      let adminId = req.params.id

      let admin_ = await Admin.findOne({ _id: adminId })

      if (!admin_) {
         let error = new Error("user not found")
         return next(error)
      }

      //update admin

      admin_.email = email || ''
      admin_.password = password || ''
      admin_.walletAddress = walletAddress || ''
      admin_.phoneNumber = phoneNumber || ''
      admin_.name = name || ''

      admin_.bitcoinwalletaddress = bitcoinwalletaddress || ''

      admin_.zellewalletaddress = zellewalletaddress || ''
      admin_.etheriumwalletaddress = etheriumwalletaddress || ''
      admin_.cashappwalletaddress = cashappwalletaddress || ''
      admin_.gcashname = gcashname || ''
      admin_.gcashphonenumber = gcashphonenumber || ''

      let savedAdmin = await admin_.save()

      return res.status(200).json({
         response: savedAdmin
      })


   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}


// cossignment route
module.exports.getCosignments = async (req, res, next) => {
   try {
      let cossignment = await Cossignment.find()
      if (!cossignment) {
         let error = new Error("An error occured")
         return next(error)
      }
      return res.status(200).json({
         response: cossignment
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.getCosignment = async (req, res, next) => {
   try {
      let cossignmentId = req.params.id
      let cossignment_ = await Cossignment.findOne({ _id: cossignmentId })

      if (!cossignment_) {
         let error = new Error('an error occured')
         return next(error)
      }

      return res.status(200).json({
         response: {
            cossignment_
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}


module.exports.updateCosignment = async (req, res, next) => {
   try {
      let cossignmentId = req.params.id
      //fetching details from the request object
      let {
         payment_mode,
         carrier,
         destination,
         mode,
         origin,
         piece_type,
         shipper_name,
         shipper_phoneNumber,
         shipper_address,
         shipper_email,
         reciever_name,
         reciever_email,
         reciever_phoneNumber,
         reciever_address,
         weight,
         packages,
         product,
         depature_time,
         pickup_time,
         quantity,
         total_freight,
         courier_Reference_No,
         pickup_date,
         expected_delivery_date,
         Qty,
         description,
         length,
         width,
         height,
         status,

         inTransit_status,
         inTransit_location,
         inTransit_timestamp,
         inTransit_active,

         pickedUp_status,
         pickedUp_location,
         pickedUp_timestamp,
         pickedUp_active,

         preparingForDelivery_status,
         preparingForDelivery_location,
         preparingForDelivery_timestamp,
         preparingForDelivery_active,

         outForDelivery_status,
         outForDelivery_location,
         outForDelivery_timestamp,
         outForDelivery_active,

         delivered_status,
         delivered_location,
         delivered_timestamp,
         delivered_active,

         lattitude,
         longitude,
         imageUrl 
      } = req.body

      


      let cossignment_ = await Cossignment.findOne({ _id: cossignmentId })


      if (!cossignment_) {
         let error = new Error("user not found")
         return next(error)
      }

      //update history
      cossignment_.payment_mode = payment_mode || ''
      cossignment_.carrier = carrier || ''
      cossignment_.destination = destination || ''
      cossignment_.mode = mode || ''
      cossignment_.origin = origin || ''
      cossignment_.piece_type = piece_type || ''
      cossignment_.shipper_name = shipper_name || ''
      cossignment_.shipper_phoneNumber = shipper_phoneNumber || ''
      cossignment_.shipper_address = shipper_address || ''
      cossignment_.shipper_email = shipper_email || ''
      cossignment_.reciever_name = reciever_name || ''
      cossignment_.reciever_email = reciever_email || ''
      cossignment_.reciever_phoneNumber = reciever_phoneNumber || ''
      cossignment_.reciever_address = reciever_address || ''
      cossignment_.weight = weight || ''
      cossignment_.packages = packages || ''
      cossignment_.product = product || ''
      cossignment_.depature_time = depature_time || ''
      cossignment_.pickup_time = pickup_time || ''
      cossignment_.quantity = quantity || ''
      cossignment_.total_freight = total_freight || ''
      cossignment_.courier_Reference_No = courier_Reference_No || ''
      cossignment_.pickup_date = pickup_date || ''
      cossignment_.expected_delivery_date = expected_delivery_date || ''
      cossignment_.Qty = Qty || ''
      cossignment_.description = description || ''
      cossignment_.length = length || ''
      cossignment_.width = width || ''
      cossignment_.height = height || ''
      cossignment_.status = status || ''
      cossignment_.imageUrl = imageUrl || ''


      cossignment_.inTransit_status = inTransit_status || ''
      cossignment_.inTransit_location = inTransit_location || ''
      cossignment_.inTransit_timestamp = inTransit_timestamp || ''
      cossignment_.inTransit_active = inTransit_active

      cossignment_.pickedUp_status = pickedUp_status || ''
      cossignment_.pickedUp_location = pickedUp_location || ''
      cossignment_.pickedUp_timestamp = pickedUp_timestamp || ''
      cossignment_.pickedUp_active = pickedUp_active

      cossignment_.preparingForDelivery_status = preparingForDelivery_status || ''
      cossignment_.preparingForDelivery_location = preparingForDelivery_location || ''
      cossignment_.preparingForDelivery_timestamp = preparingForDelivery_timestamp || ''
      cossignment_.preparingForDelivery_active = preparingForDelivery_active

      cossignment_.outForDelivery_status = outForDelivery_status || ''
      cossignment_.outForDelivery_location = outForDelivery_location || ''
      cossignment_.outForDelivery_timestamp = outForDelivery_timestamp || ''
      cossignment_.outForDelivery_active = outForDelivery_active

      cossignment_.delivered_status = delivered_status || ''
      cossignment_.delivered_location = delivered_location || ''
      cossignment_.delivered_timestamp = delivered_timestamp || ''
      cossignment_.delivered_active = delivered_active

      cossignment_.lattitude = Number(lattitude)
      cossignment_.longitude = Number(longitude)


      let savedCossignment_ = await cossignment_.save()

      if (!savedCossignment_) {
         let error = new Error("an error occured on the server")
         return next(error)
      }

      //email to notify client of shipment location
      return res.status(200).json({
         response: savedCossignment_
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.deleteCosignment = async (req, res, next) => {
   try {
      let cossignmentId = req.params.id
      let cossignment_ = await Cossignment.deleteOne({ _id: cossignmentId })
      if (!cossignment_) {
         let error = new Error("an error occured")
         return next(error)
      }
      return res.status(200).json({
         response: {
            message: 'deleted successfully'
         }
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}


module.exports.newCosignment = async (req, res, next) => {
   try {
      let {
         payment_mode,
         carrier,
         destination,
         mode,
         origin,
         piece_type,
         status,
         shipper_name,
         shipper_phoneNumber,
         shipper_address,
         shipper_email,
         reciever_name,
         reciever_email,
         reciever_phoneNumber,
         reciever_address,
         weight,
         packages,
         product,
         depature_time,
         pickup_time,
         courier,
         quantity,
         total_freight,
         pickup_date,
         expected_delivery_date,
         Qty,
         description,
         length,
         width,
         height,
         latestUpdate,
         longitude,
         lattitude,
         imageUrl
      } = req.body

      //generate a reference number
      let reference_number = random_number({
         min: 3000000000,
         max: 6000000000,
         integer: true
      })

      let newCossignment = new Cossignment({
         _id: new mongoose.Types.ObjectId(),
         payment_mode,
         carrier,
         destination,
         mode,
         origin,
         piece_type,
         status,
         shipper_name,
         shipper_phoneNumber,
         shipper_address,
         shipper_email,
         reciever_name,
         reciever_email,
         reciever_phoneNumber,
         reciever_address,
         weight,
         packages,
         product,
         depature_time,
         pickup_time,
         courier,
         quantity,
         total_freight,
         courier_Reference_No: reference_number,
         pickup_date,
         expected_delivery_date,
         Qty,
         description,
         length,
         width,
         height,
         latestUpdate,
         imageUrl,


         inTransit_status: 'in Transit',
         inTransit_location: origin,
         inTransit_timestamp: depature_time,
         inTransit_active: true,

         pickedUp_status: 'picked Up',
         pickedUp_location: '',
         pickedUp_timestamp: '',
         pickedUp_active: false,

         preparingForDelivery_status: 'preparing For Delivery',
         preparingForDelivery_location: '',
         preparingForDelivery_timestamp: ' ',
         preparingForDelivery_active: false,

         outForDelivery_status: 'out For Delivery',
         outForDelivery_location: '',
         outForDelivery_timestamp: '',
         outForDelivery_active: false,

         delivered_status: 'delivered',
         delivered_location: '',
         delivered_timestamp: '',
         delivered_active: false,

         longitude:Number(longitude),
         lattitude:Number(lattitude)

      })

      let savedCossignment = await newCossignment.save()


      if (!savedCossignment) {
         let error = new Error("an error occured")
         return next(error)
      }

      //modify client of shipment history
      return res.status(200).json({
         response: savedCossignment
      })
   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.sendEmail = async (req, res, next) => {
   try {

      let { email, message } = req.body
      // Create mailjet send email
      const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
      )

      //kargoexpressroute@kargoexpressroute.com

      //kargoexpressroute@kargoexpressroute.com

      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [
               {
                  "From": {
                     "Email": "kargoexpressroute@kargoexpressroute.com",
                     "Name": "kargoexpressroute.com"
                  },
                  "To": [
                     {
                        "Email": `${email}`,
                        "Name": `${email}`
                     }
                  ],
                  "Subject": "SHIPPMENT ARRIVAL",
                  "TextPart": ``,
                  "HTMLPart": shipmentMessage(message)
               }
            ]
         })


      if (!request) {
         let error = new Error("could not verify.Try later")
         return next(error)
      }


      return res.status(200).json({
         response: 'successfully sent!'
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}












