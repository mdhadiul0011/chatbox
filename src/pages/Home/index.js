import React, { useState } from 'react'
import Popup from '../../component/modal/Popup';
import './style.css';
import Grid from '@mui/material/Grid';
import Searchbox from '../../component/searchbox';
import GroupList from '../../component/groupslist';
import Friendrequest from '../../component/frndrequest';
import Friends from '../../component/friends';
import Mygroups from '../../component/mygroups';
import Userlist from '../../component/userlist';
import Blockuser from '../../component/blockuser';

const Home = () => {



  return (
    <>
    <Grid container spacing={2} className='home-pages'>
        <Grid item xs={4}>
          <div>
            <Searchbox/>
          </div>
          <div>
            <GroupList/>
          </div>
          <div>
            <Friendrequest/>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <Friends/>
          </div>
          <div>
            <Mygroups/>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <Userlist/>
          </div>
          <div>
            <Blockuser/>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default Home
