const express = require('express');
const router = express.Router()
const Booking = require("../models/booking")
const moment = require("moment")
const Room = require("../models/room")
require("dotenv").config(); // Load env variables
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ Secure
const { v4: uuid } = require("uuid");
const bookingModel = require('../models/booking');
const roomModel = require('../models/room');




router.get("/", async (req, res) => {
    try {
        const bookings = await bookingModel.find({})
        return res.status(200).json(bookings)

    } catch (error) {
        return res.status(500).json(error)
    }

})


router.get("/:id", async (req,res)=>{
   try {
    const booking = await bookingModel.findOne({_id:req.params.id})
    return res.status(200).json(booking)
   } catch (error) {
    return res.status(500).json(error)
   }
})


router.delete("/:id", async (req, res) => {
    try {
        // // Fetching the booking that has to be deleted
        // const booking = await bookingModel.findOne({ _id: req.params.id })

        // if (booking) {
        //     const room = await roomModel.findOne({ _id: booking.roomid })
        //     if (room) {
        //         room.currentbookings.pull({bookingid: booking._id})
        //         room.save()
        //     } else {
        //         return res.status(404).json("No Room Found!")
        //     }
        //     await booking.deleteOne()
        // } else {
        //     return res.status(404).json("No Booking Found!")
        // }

        // return res.status(200).json("Booking Cancelled!")
        //  Fetch the booking that needs to be deleted
         const booking = await bookingModel.findOne({ _id: req.params.id });

         if (!booking) {
             return res.status(404).json({ message: "Booking not found!" });
         }
 
         // Find the corresponding room
         const room = await roomModel.findOne({ _id: booking.roomid });
 
         if (!room) {
             return res.status(404).json({ message: "Room not found!" });
         }
 
         // Remove the booking from the room's current bookings
         room.currentbookings = room.currentbookings.filter(
             (b) => b.bookingid.toString() !== booking._id.toString()
         );
 
         // Save the updated room document
         await room.save();
 
         // Delete the booking
         await booking.deleteOne();
 
         // Return success response
         return res.status(200).json({ message: "Booking cancelled successfully!" });

    } catch (error) {
        return res.status(500).json(error)
    }

})

router.post("/bookroom", async (req, res) => {
    // Requesting valuses from body or frontend
    const {
        room,
        userid,
        fromdate,
        todate,
        totaldays,
        totalamount,
        token
    } = req.body

    // for payment
    try {
        // creating customer
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        //    creating payment
        const payment = await stripe.charges.create(
            {
                amount: totalamount * 100,
                customer: customer.id,
                currency: "PKR",
                receipt_email: token.email
            },
            {
                idempotencyKey: uuid()
            }
        )

        if (payment) {
            // Making an object that can store room values and details for booking
            try {
                const newbooking = new Booking({
                    room: room.name,
                    roomid: room._id,
                    userid,
                    fromdate: moment(fromdate).format("DD-MM-YYYY"),
                    todate: moment(todate).format("DD-MM-YYYY"),
                    totaldays,
                    totalamount,
                    transactionid: "1234"
                })
                // Saving Room Booking Details
                const booking = await newbooking.save()

                // Getting rooms models Room values and details
                const roomtemp = await Room.findOne({ _id: room._id })
                // Pushing Values to Current Bookings array in Room Model
                roomtemp.currentbookings.push({
                    bookingid: booking._id,
                    fromdate: moment(fromdate).format("DD-MM-YYYY"),
                    todate: moment(todate).format("DD-MM-YYYY"),
                    userid: userid,
                    status: booking.status
                })
                await roomtemp.save()


            } catch (error) {
                return res.status(400).json({ message: error })
            }
        }

        res.send("Payment Successful, Room is Booked!")
    } catch (error) {
        return res.status(500).json(error)
    }














})

module.exports = router;