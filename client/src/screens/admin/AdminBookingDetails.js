import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap'
import Loader from '../../components/Loader'
import Error from '../../components/Error'
function AdminBookingDetails() {
    const [booking,setBooking] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    const params = useParams()
    const {id} = params
    useEffect(()=>{
     const getBooking = async ()=>{
        try {
            setLoading(true)
            const res = (await axios.get(`http://localhost:5000/api/bookings/${id}`)).data
            setBooking(res)
            setLoading(false)
        } catch (error) {
          setLoading(false)
          setError(true) 
        }
     }
     getBooking()
    },[id])
    console.log(booking)
  return (
    <Container>
        {loading ? <Loader/> : error ? <Error/> :  <Row className='my-3'>
            <Col xs={12} md={8}>
            <Card>
         <ListGroup variant='flush'>
         <ListGroup.Item className='py-3'>
         <strong>Booking ID: </strong>  {booking._id}
         </ListGroup.Item>
         <ListGroup.Item className='py-3'>
         <strong>Booking Date:</strong>  {booking.createdAt}
         </ListGroup.Item>
         <ListGroup.Item className='py-3'>
         <strong>Room ID:</strong>    {booking.roomid}
         </ListGroup.Item>
         <ListGroup.Item className='py-3'>
         <strong>Room:</strong>    {booking.room}
         </ListGroup.Item>
         <ListGroup.Item className='py-3'>
         <strong>From Date:</strong>  {booking.fromdate}
         </ListGroup.Item>
         <ListGroup.Item className='py-3'>
         <strong>To Date: </strong>  {booking.todate}
         </ListGroup.Item>
         <ListGroup.Item className='py-3'>
         <strong>Total Days:</strong>    {booking.totaldays}
         </ListGroup.Item>
         </ListGroup>
         </Card>
            </Col>
            <Col xs={12} md={4}>
            <Card>
                <ListGroup variant='flush'>
               <ListGroup.Item>
               <strong>Status:</strong> {booking?.status?.toUpperCase()} 
               </ListGroup.Item>
               <ListGroup.Item>
               <strong>Transaction ID:</strong> {booking.transactionid} 
               </ListGroup.Item>
               <ListGroup.Item>
               <strong>Total Amount:</strong>PKR {booking.totalamount} 
               </ListGroup.Item>
                </ListGroup>
            </Card>
            </Col>
        </Row>}
       
        </Container>
  )
}

export default AdminBookingDetails