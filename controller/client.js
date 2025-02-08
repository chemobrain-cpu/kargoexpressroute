const express = require("express")
const Mailjet = require('node-mailjet')
let request = require('request');
const random_number = require("random-number")

const { Cossignment } = require("../database/databaseConfig");


module.exports.gethome = async (req, res, next) => {
   res.status(200).render('index')
}

module.exports.trackResult = async (req, res, next) => {
   const { keyword } = req.body

   console.log(req.body)

   let trackingData = await Cossignment.findOne({ courier_Reference_No: keyword })
   if (!trackingData) {
      console.log('not found')
      return res.render('no-result', {
         msg: 'item not found', trackingData: {
            _id: '676196faad59f7006032cd6f',
            payment_mode: 'Cash',
            carrier: 'DHL',
            destination: 'United States',
            mode: 'Sea transport',
            origin: 'United States',
            piece_type: 'Pallet',
            shipper_name: 'John Mark',
            shipper_phoneNumber: '+123456789',
            shipper_address: '20 lincoln street greenwood',
            shipper_email: 'johnmark@gmail.com',
            reciever_name: 'Paul Austin',
            reciever_email: 'paulaustin@gmail.com',
            reciever_phoneNumber: '+12345678',
            reciever_address: 'paul@gmail.com',
            weight: '90',
            packages: 'golden and silvery items',
            product: 'a pack of gold and silver',
            depature_time: '16:23',
            pickup_time: '16:22',
            quantity: '1',
            total_freight: '70',
            courier_Reference_No: '5848103944',
            pickup_date: '2024-12-27',
            expected_delivery_date: '2024-12-11',
            Qty: '10',
            description: 'A nice pack of golden and silver jewelries',
            length: '90',
            width: '90',
            height: '90',
            latestUpdate: 'Items just departed carliforinai,, united state of america',
            imageUrl: 'https://coinbasebuckets.s3.amazonaws.com/bucket//dfa-business.jpg',
            inTransit_status: 'in Transit',
            inTransit_location: 'United States',
            inTransit_timestamp: '16:23',
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
            longitude: -122.0575,
            lattitude: 37.3875,
            __v: 0,
            status: ''
         }
      });
   }


   console.log('found!!')
   return res.render('track-result', {
      trackingData
   });
}

module.exports.getabout = async (req, res, next) => {
   res.status(200).render('about')
}

module.exports.getservices = async (req, res, next) => {
   res.status(200).render('services')
}

module.exports.getcontact = async (req, res, next) => {
   res.status(200).render('contact')
}

module.exports.getgallery = async (req, res, next) => {
   res.status(200).render('gallery')
}

module.exports.track = async (req, res, next) => {
   res.status(200).render('track')
}


















