import React, { useEffect, useState } from 'react'
import './style.css';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '@mui/material/Alert';
import activeSingleSlice, { activeSingle } from '../../features/slice/activeSingleSlice';

const Friends = () => {
    const users = useSelector((user) => user.loggedinSlice.login);
    const activeChatName = useSelector((state)=> state.active.active);
    const [frndlist, setFrndlist] = useState([]);
    const db = getDatabase();
    const dispatch = useDispatch();

    useEffect( ()=> {
        const starCountRef = ref(db, 'Friends');
        onValue(starCountRef, (snapshot) => {
            const frndarr = [];
            snapshot.forEach((item)=> {
                if(users.uid == item.val().receiverid || users.uid == item.val().senderid){
                    frndarr.push({...item.val(), id: item.key})
                }
            })
            setFrndlist(frndarr)
        });
    }, [])

    //unfriend part
    const handleUnfrnd = (id)=> {
        remove(ref(db, 'Friends/' + id))
    }

    //block funtionality
    const handleBlock = (item)=> {
        if(users.uid == item.senderid){
            set(push(ref(db, 'Blockuser')),{
                block: item.receivername,
                blockId: item.receiverid,
                blockby: item.sendername,
                blockedbyId: item.senderid
            })
            .then(()=> {
                remove(ref(db, 'Friends/' + item.id))
            })
        }
        else{
            set(push(ref(db, 'Blockuser')),{
                block: item.sendername,
                blockId: item.senderid,
                blockby: item.receivername,
                blockedbyId: item.receiverid
            })
            .then(()=> {
                remove(ref(db, 'Friends/' + item.id))
            })
        }
    }

    //single frnds msg show
    const handleaActiveSingle= (item)=> {
        if(item.receiverid == users.uid){
            dispatch(
                activeSingle({
                    id: item.senderid,
                    name: item.sendername,
                    status: 'single'
                }),
            )
            localStorage.setItem('activeSingle', JSON.stringify(item))
        }else{
            dispatch(
                activeSingle({
                    id: item.receiverid,
                    name: item.receivername,
                    status: 'single'
                })
            )
        }
    }

  return (
    <div className='Friends-list'>
        <div className='Friends-header'>
            <h3>Friends</h3>
        </div>
        { frndlist.length == 0 ? <Alert severity="error" className='alert'>No Friend Yet</Alert> :
           frndlist.map((item, i) => (
            <div className='Friends-items-wrapper' key={i} onClick={()=> handleaActiveSingle(item)}>
                <div className='Friends-item'>
                    <div className='Friends-img'>

                    </div>
                    <div className='Friends-items'>
                        <div className='Friends-name'>
                            <h4>{users.uid == item.senderid ? item.receivername : item.sendername}</h4>
                        </div>
                        <div className='Friends-list-btn'>
                            <button type='text' onClick={()=> handleUnfrnd(item.id)}>Unfriend</button>
                            <button type='text' onClick={()=> handleBlock(item)}>Block</button>
                        </div>
                    </div>
                </div>
            </div>
           )) 
        }

        
    </div>
  )
}

export default Friends;
