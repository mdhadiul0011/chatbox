import React from 'react'
import Sidebaricons from './Sidebaricons';
import { AiOutlineLogout } from 'react-icons/ai';
import { useDispatch, useSelector,} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import './style.css'
import {Loginuser } from '../../features/slice/UsersSlice';
import { getAuth, signOut } from 'firebase/auth';
import Popup from '../modal/Popup';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((user) => user.loggedinSlice.login);
  const [open, setOpen] = React.useState(false);

  const auth = getAuth();

  const handleClick = () => {
    signOut(auth)
    .then(()=> {
      localStorage.removeItem('users')
      dispatch(Loginuser(null))
      navigate('/')
    })
    .catch((error)=> {
      console.log(error.message);
    })

  };

  const handleOpen = ()=>{
    setOpen(true)
  }

  return (
    <div className='sidebar'>
      <div className='sidebar-wrapper'>
        <div className='profile-pic' onClick={handleOpen}>
          <picture>
          <img
                  src={users.photoURL || "./images/profile.png"}
                  onError={(e) => {
                    e.target.src = "./images/profile.png";
                  }}
                  alt=""
                />
            {/* <img src={users.photoURL}/> */}
          </picture>
          <div className='profile_overlay'>
            <AiOutlineCloudUpload/>
          </div>
          <div className='display_name'>
            <h3>{users.displayName}</h3>
          </div>
        </div>
        <div>
        </div>
        <div className='others-pages'>
          <Sidebaricons/>
        </div>
        <div className='logout' onClick={handleClick}>
          <AiOutlineLogout/>
        </div>
      </div>
      <Popup open={open} setOpen={setOpen}/>
    </div>
  )
}

export default Sidebar;
