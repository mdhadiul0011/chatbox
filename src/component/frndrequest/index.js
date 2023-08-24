import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import './style.css';
import { useSelector } from 'react-redux';
import { getDownloadURL, ref as storageRef, getStorage } from 'firebase/storage';
import Alert from '@mui/material/Alert';

const Friendrequest = () => {
    const users = useSelector((user) => user.loggedinSlice.login);
    const storage = getStorage();
    const [friendreq, setFriendreq] = useState([]);
    const [profileimg, setProfileimg] = useState([]);
    const db = getDatabase();

    useEffect(()=> {
        const starCountRef = ref(db, 'Friendrequest');
        onValue(starCountRef, (snapshot) => {
            const reqarr = [];
            snapshot.forEach((item)=> {
                if(item.val().receiverid == users.uid ){
                    reqarr.push({...item.val(), id: item.key})
                }
            })
            setFriendreq(reqarr)
        });
    }, []);

    //accept request
    const handleAccept = (data)=> {
        set(push(ref(db, 'Friends')), {
            ...data,
        }).then(()=> {
            remove(ref(db, 'Friendrequest/' + data.id))
        });
    }

    //cancel request
    const handleCancel = (id)=> {
        remove(ref(db, 'Friendrequest/' + id))
    }

    // useEffect(() => {
    //     const fetchUsers = ref(db, "Friendrequest");
    //     onValue(fetchUsers, (snapshot) => {
    //       let reqimgarr = [];
    //       snapshot.forEach((item) => {
    //         if (users.uid !== item.key) {
    //           getDownloadURL(storageRef(storage, item.key))
    //             .then((url) => {
    //                 reqimgarr.push({
    //                 ...item.val(),
    //                 id: item.key,
    //                 profilePicture: url,
    //               });
    //             })
    //             .catch((error) => {
    //                 reqimgarr.push({
    //                 ...item.val(),
    //                 id: item.key,
    //                 profilePicture: null,
    //               });
    //             })
    //             .then(() => {
    //                 setProfileimg([...reqimgarr]);
    //             });
    //         }
    //       });
    //     });
    //   }, [db, storage, users.uid]);

  return (
    <div className='Friendrequest-list'>
        <div className='Friendrequest-header'>
            <h3>Friend Request</h3>
        </div>
        { friendreq.length == 0 ? <Alert severity="error" className='alert'>No Friend Yet</Alert> :
             friendreq.map((item, i )=> (
                <div key={i} className='Friendrequest-items-wrapper'>
                <div className='Friendrequest-item'>
                    <div className='Friendrequest-img'>
                        <img src={ item.profilePicture || "./images/profile.png"}
                                onError={(e) => {
                                    e.target.src = "./images/profile.png";
                                }}
                                alt=""/>
                    </div>
                    <div className='Friendrequest-items'>
                        <div className='Friendrequest-name'>
                            <h4>{item.sendername}</h4>
                        </div>
                        <div className='Friendrequest-list-btn'>
                            <button type='text' onClick={()=> handleAccept(item)}>Accept</button>
                            <button type='text' onClick={()=> handleCancel(item.id)}>Cancel</button>
                        </div>
                    </div>
                </div>
    
            </div>
           
            ))
        }
       
    </div>
  )
}

export default Friendrequest;
