import React, { useEffect, useState } from 'react'
import './style.css'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useDispatch } from 'react-redux';
import { activeSingle } from '../../features/slice/activeSingleSlice';

const MsgGrp = () => {
    const [groups, setGroups] = useState([]);
    const db = getDatabase();
    const dispatch = useDispatch();

    useEffect(()=> {
        const startCountref = ref(db, 'groups');
        onValue(startCountref, (snapshot)=> {
            let gruparr= [];
            snapshot.forEach((item)=> {
                gruparr.push({...item.val(), id: item.key})
            })
            setGroups(gruparr)
        })
    }, [])

    const handleMsgGroup = (item)=>{
        dispatch(
            activeSingle({
                status: 'Group',
                id: item.id,
                name: item.groupname,
                adminid: item.adminid
            })
        )
    }

  return (
    <div className='MsgGrp-list'>
        <div className='MsgGrp-header'>
            <h3>All Groups</h3>
        </div>
        {
            groups.map((item, i)=> (
                <div className='MsgGrp-items-wrapper' key={i} onClick={()=>handleMsgGroup(item)}>
                <div className='MsgGrp-item'>
                    <div className='MsgGrp-img'>
    
                    </div>
                    <div className='MsgGrp-name'>
                        <h4>{item.groupname}</h4>
                        <span>{item.grouptag}</span>
                    </div>
                    <div className='MsgGrp-list-btn'>
                          <button type='text'>Message</button>
                      </div>
                </div>
            </div>
            ))
        }
    </div>
  )
}

export default MsgGrp
