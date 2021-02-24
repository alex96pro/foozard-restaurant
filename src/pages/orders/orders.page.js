import './orders.page.scss';
import socketClient from 'socket.io-client';
import NavBar from '../../components/nav-bar/nav-bar';
import React, { useState, useEffect } from 'react';
import { BACKEND_API, CURRENCY } from '../../util/consts';
import { useDispatch, useSelector } from 'react-redux';
import { addNewOrder, acceptOrder, rejectOrder } from '../../common/actions/orders.actions';
import AcceptModal from './accept.modal';
import RejectModal from './reject.modal';
var socket;

export default function Orders() {
    
    const dispatch = useDispatch();
    const {orders} = useSelector(state => state.orders);
    const [acceptModal, setAcceptModal] = useState({show: false, userId:'', time: ''});
    const [rejectModal, setRejectModal] = useState({show: false, userId:'', time: ''});

    const handleAcceptOrder = (estimatedTime) => {
        dispatch(acceptOrder({userId: acceptModal.userId, time: acceptModal.time}));
        socket.emit('accept-order',{
            userId: acceptModal.userId,
            estimatedTime: estimatedTime
        });
    };

    const handleRejectOrder = (rejectReason) => {
        dispatch(rejectOrder({userId: rejectModal.userId, time: rejectModal.time}));
        socket.emit('reject-order',{
            userId: rejectModal.userId,
            rejectReason: rejectReason
        });
    };

    useEffect(() => {
        socket = socketClient (BACKEND_API);
        socket.on('connection', () => {
            socket.emit('send-id',{restaurantId: localStorage.getItem('RESTAURANT_ID')});
        });
        socket.on('new-order', (args) => {
            dispatch(addNewOrder({
                meals: args.meals, 
                deliveryAddress: 
                args.deliveryAddress, 
                userId: args.userId,
                phone: args.phone,
                total: args.total,
                time: args.time,
                status: 'waiting'
            }));
        });
    },[dispatch]);

    return <div className="orders">
        <NavBar loggedIn={true}/>
        <div className="header-accent-color">ORDERS</div>
        <div className="orders-container">
            {orders.map((order,index) => <div key={index} className="order">
                <div className="order-header">
                    <div className="label-white">Order: {index + 1}</div>
                    <div className="label-white">Time: {order.time}</div>
                </div>
                {order.meals.map((meal,index) => <div key={index} className="order-meal">
                    <div className="label-white">
                        {meal.name}
                    </div>
                    <div className="label-white">
                        x{meal.amount}
                    </div>
                </div>)}
                <div className="label-white">Delivery address: {order.deliveryAddress}</div>
                <div className="label-white">Phone: {order.phone}</div>
                <div className="label-white">Total: {order.total}{CURRENCY}</div>
                <div className="order-buttons">
                    {order.status === 'waiting' &&
                    <React.Fragment>
                        <button className="order-button-reject" onClick={() => setRejectModal({show: true, userId: order.userId, time: order.time})}>Reject</button>
                        <button className="order-button-accept" onClick={() => setAcceptModal({show: true, userId: order.userId, time: order.time})}>Accept</button>
                    </React.Fragment>
                    }
                    {order.status === 'accepted' &&
                    <React.Fragment>
                        <button className="order-button-accept">Accepted</button>
                    </React.Fragment>
                    }
                </div>
            </div>)}
        </div>
        {acceptModal.show && <AcceptModal closeModal={() => setAcceptModal({show:false, userId:'', time: ''})} accept={(estimatedTime) => handleAcceptOrder(estimatedTime)}/>}
        {rejectModal.show && <RejectModal closeModal={() => setRejectModal({show:false, userId:'', time: ''})} reject={(rejectReason) => handleRejectOrder(rejectReason)}/>}
    </div>
}