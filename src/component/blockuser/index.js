import React, { useEffect, useState } from 'react'
import './style.css'
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';

const Blockuser = () => {
    const users = useSelector((user) => user.loggedinSlice.login);
    const [blockuser, setBlockuser] = useState([]);
    const db = getDatabase();

    useEffect(()=> {
        const starCountRef = ref(db, 'Blockuser');
        onValue(starCountRef, (snapshot)=> {
            const blockedarr = [];
            snapshot.forEach((item)=> {
                if (item.val().blockedbyId == users.uid) {
                    blockedarr.push({
                      id: item.key,
                      block: item.val().block,
                      blockId: item.val().blockId,
                    });
                  } else {
                    blockedarr.push({
                      id: item.key,
                      blockby: item.val().blockby,
                      blockedbyId: item.val().blockedbyId,
                    });
                  }
            })
            setBlockuser(blockedarr);
        })
    }, []);

    //unblock part
    const handleUnblock = (id)=> {
        remove(ref(db, 'Blockuser/' + id))
    }

  return (
    <div className='Blockuser-list'>
        <div className='Blockuser-header'>
            <h3>Blocked</h3>
        </div>
        { blockuser.length == 0 ?<Alert severity="error" className='alert'>No Friend Yet</Alert> :
            blockuser.map((item, i)=>(
                <div className='Blockuser-items-wrapper' key={i}>
                    <div className='Blockuser-item'>
                        <div className='Blockuser-img'>
        
                        </div>
                        <div className='Blockuser-name'>
                            <h4>{item.block}</h4>
                            <h4 className='blocked'>{item.blockby}</h4>
                        </div>
                        {
                            !item.blockedbyId && (
                                <div className='Blockuser-list-btn'>
                                    <button type='text' onClick={()=>handleUnblock(item.id)}>UnBlock</button>
                                </div>
                            )
                        }
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default Blockuser;
