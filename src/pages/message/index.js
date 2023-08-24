import React, { useState } from 'react';
import './style.css';
import { Grid } from '@mui/material';
import MsgGrp from '../../component/msggrp';
import Friends from '../../component/friends';
import Chatbox from '../../component/chattingbox';
import { activeSingle } from '../../features/slice/activeSingleSlice';

const MessageBox = () => {
 
  return (
    <div className='message-box'>
        <Grid container justifyContent='space-between' marginTop='12px'>
            <Grid item xs={4}>
                <MsgGrp/>
                <Friends/>
            </Grid>
            <Grid item xs={7.5}>
              <Chatbox/>
            </Grid>
        </Grid>
    </div>
  )
}

export default MessageBox;
