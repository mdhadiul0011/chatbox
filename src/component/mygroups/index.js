import React, { useEffect, useState } from 'react'
import './style.css'
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import { ListItemButton } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { CgMathPlus } from 'react-icons/cg';


const Mygroups = () => {
    const users = useSelector((user) => user.loggedinSlice.login);
    const db = getDatabase();
    const [grouplist, setGrouplist] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [show, setShow] = useState(false)
    const [reqlist, setReqlist] = useState([])
    const [member, setMember] = useState(false)
    const [grpmember, setGrpmmber] = useState([])

    const style = {
        position: 'absolute',
        top: '55%',
        left: '48%',
        width: 150,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      };

    useEffect(()=> {
        const startCountref = ref(db, 'groups')
        onValue(startCountref, (snapshot)=> {
            let grouparr = []
            snapshot.forEach((item)=> {
                if(users.uid == item.val().adminid){
                    grouparr.push({...item.val(), id: item.key})
                }
            })
            setGrouplist(grouparr);
        })
    }, [])

    const handleReqshow = (data)=> {
        console.log(data)
        const startCountref = ref(db, 'Joingroup')
        onValue(startCountref, (snapshot)=> {
            let grpreqarr = []
            snapshot.forEach((item) => {
                if(users.uid == item.val().adminid && item.val().groupid == data.id ){
                    grpreqarr.push({...item.val(), id: item.key})
                }
            })
            setReqlist(grpreqarr);
        })
        setShow(true);
    }

    const handleAccept = (item)=> {
        set(push(ref(db, 'groupmembers')),{
            adminid: item.adminid,
            userid: item.usersid,
            groupid: item.groupid,
            adminname: item.adminname,
            usersname: item.usersname,
            groupname: item.groupname,
        }).then(()=> {
            remove(ref(db, 'Joingroup/' + item.id))
        })
    }

    const handleRemove = (item)=> {
        remove(ref(db, 'Joingroup/' + item.id))
    }

    const handleDelete = (item)=> {
        remove(ref(db, 'groupmembers/' + item.usersid))
    }

    const handleMembers = (grpmembers)=> {
        const startCountref = ref(db, 'groupmembers');
        let memberarr = [];
         onValue(startCountref, (snapshot)=> {
            snapshot.forEach((item) => {
                if(users.uid == grpmembers.adminid && grpmembers.id == item.val().groupid){
                    memberarr.push({...item.val(), id: item.key})
                }
            })
            setGrpmmber(memberarr)
         })

        setMember(true);
    }

  return (
    <div className='Mygroups-list'>
        <div className='Mygroups-header'>
            <h3>My Groups</h3>
        </div>
        {show && <button  onClick={()=> setShow(false)}>go back</button>}
        {member && <button  onClick={()=> setMember(false)}>go back</button>}
        {grouplist.length == 0 ? <Alert severity="error" className='alert'>No Groups Created Yet</Alert> : 
                      show ?           
            reqlist.length == 0 ? <Alert severity="error" className='alert'>No Groups Created Yet</Alert> :
            reqlist.map((item, i) => (
                <div className='Mygroups-items-wrapper' key={i}>
                    <div className='Mygroups-item'>
                        <div className='Mygroups-img'>

                        </div>
                        <div className='Mygroups-name'>
                            <h4>{item.usersname}</h4>
                        </div>
                        <div className='mygrpbtn2'>
                            <button className='Plus' onClick={()=> handleAccept(item)}><CgMathPlus/></button>
                            <button className='Cross' onClick={()=>handleRemove(item)}><RxCross2/></button>
                        </div>
                        
                    </div>
                </div>
            )) :
            member ? 
            grpmember.map((item, i) => (
                <div className='Mygroups-items-wrapper' key={i}>
                    <div className='Mygroups-item'>
                        <div className='Mygroups-img'>

                        </div>
                        <div className='Mygroups-name'>
                            {/* <span>{item.adminname}</span> */}
                            <h4>{item.usersname}</h4>
                        </div>
                        <button onClick={()=>handleDelete(item)}>Remove</button>
                    </div>
                </div>
            )) :

            grouplist.map((item, i)=> (
                <div className='Mygroups-items-wrapper' key={i}>
                    <div className='Mygroups-item'>
                        <div className='Mygroups-img'>

                        </div>
                        <div className='Mygroups-name'>
                            {/* <span>{item.adminname}</span> */}
                            <h4>{item.groupname}</h4>
                            <span>{item.grouptag}</span>
                        </div>
                        <div className='Mygroups-list-icon' onClick={handleOpen}>
                            <BsThreeDotsVertical/>
                        </div>
                    </div>
                    <Modal
                    
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            
              <div className='mygrpbtn'>
                <button onClick={()=>handleReqshow(item)}>Request</button>
                <button onClick={()=> handleMembers(item)}>Info</button>
              </div>
            </Box>
          </Modal>
                </div>
                
            ))

        }
    </div>
  )
}

export default Mygroups;
