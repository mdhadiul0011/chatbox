import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import './Popup.css';
import Uploadprofile from '../Uploadprofilepic';


const Popup = ({open, setOpen}) => {

const handleClose = () => setOpen(false);

  return (
    <div>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className='box_modal'>
        <Uploadprofile setOpen={setOpen}/>
      </Box>
    </Modal>
  </div>
  )
}

export default Popup;
