import React, { useEffect, useState } from 'react'
import './style.css'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';

const GroupList = () => {
    const users = useSelector((user) => user.loggedinSlice.login);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [groupname, setGroupname] = useState();
    const [grouptag, setGrouptag] = useState();
    const db = getDatabase();
    const [randomgroup, setRandomgroup] = useState([])


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };


      const handleGroup =()=> {
        set(push(ref(db, 'groups')),{
            groupname: groupname,
            grouptag: grouptag,
            adminid: users.uid,
            adminname: users.displayName,
        }).then(()=> {
            setOpen(false)
        })
      }

      useEffect(()=> {
        const startCountref = ref(db, 'groups');
        onValue(startCountref, (snapshot)=>{
          let rndmgrparr =[]
          snapshot.forEach((item)=>{
            if(users.uid != item.val().adminid){
              rndmgrparr.push({...item.val(), id: item.key})
            }
          })
          setRandomgroup(rndmgrparr)
        })
      }, [])

      const handleGroupjoin = (item)=> {
        set(push(ref(db, 'Joingroup')),{
          groupid: item.id,
          groupname: item.groupname,
          grouptag: item.grouptag,
          adminid: item.adminid,
          adminname: item.adminname,
          usersid: users.uid,
          usersname: users.displayName,
        })
      }

  return (
    <div className='Group-list'>
        <div className='Group-header'>
            <h3>Groups List</h3>
            <div className='grpbtn'>
                <button onClick={handleOpen}>
                    Create Group
                </button>
            </div>
        </div>
        {
          randomgroup.length == 0 ? <Alert severity="error" className='alertbtn'>No Groups Created Yet</Alert> :
          randomgroup.map((item, i)=>(
            <div className='Groups-items-wrapper' key={i}>
              <div className='Groups-item'>
                  <div className='Group-img'>

                  </div>
                  <div className='Group-name'>
                      <h4>{item.groupname}</h4>
                      <span>{item.grouptag}</span>
                  </div>
                  <div className='Group-list-btn'>
                      <button type='text' onClick={()=>handleGroupjoin(item)}>Join</button>
                  </div>
              </div>
            </div>
          ))
        }

        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create A New Group
          </Typography>
          <TextField onChange={(e)=> setGroupname(e.target.value)} label="Group Name" variant="outlined" margin='normal' fullWidth/>
          <TextField onChange={(e)=> setGrouptag(e.target.value)} label="Group Tagline" variant="outlined" margin='normal' fullWidth/>

          <div className='grpbtn'>
                <button onClick={handleGroup}>
                    Done
                </button>
            </div>
        </Box>
      </Modal>
    </div>
  )
}

export default GroupList
