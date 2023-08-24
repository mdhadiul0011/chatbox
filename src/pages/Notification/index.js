import React, { useEffect, useState } from 'react';
import './style.css';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Notification = () => {
  const users = useSelector((user) => user.loggedinSlice.login);
  const db = getDatabase();
  const [friendreq, setFriendreq] = useState([])

  const handleAdd = (item)=> {
    set(push(ref(db, 'Friendrequest')), {
        sendername: users.displayName,
        senderid: users.uid,
        senderimg: users.photoURL,
        receivername: item.username,
        receiverid: item.id,
        receiverimg: item.profilePicture
      });
};

useEffect(()=> {
  const starCountRef = ref(db, 'Friendrequest');
  onValue(starCountRef, (snapshot) => {
      const reqarr = [];
      snapshot.forEach((item)=> {
          if(item.val().receiverid == users.uid){
            reqarr.push({
              ...item.val(),
              id: item.key,
            });
          }
      })
      setFriendreq(reqarr)
  });
}, [])

  return (
    <>
        <div className='notification-page'>
        <span>Notification</span>
          <div className='notify-box'>
            {
              friendreq.map((item, i)=>(
                <div className='notifications' onClick={(item)=>handleAdd(item)} key={i}>
                <Link to="/"><p ><span>{item.sendername}</span> sent a Friend Request</p></Link>
              </div>
              ))
            }

          </div>
          {/* <button className='btn' onClick={handleclickbtn}>click me</button> */}
        </div>
    </>
  )
}

export default Notification;
