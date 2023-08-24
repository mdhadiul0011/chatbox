import React from 'react'
import { AiOutlineHome } from 'react-icons/ai';
import { FaCommentDots } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { RxGear } from 'react-icons/rx';
import { Link, NavLink } from 'react-router-dom';

const Sidebaricons = () => {

  return (
    <div>
        <div className='icons'>
            <NavLink className='sidebar-icon' to='/'>
                < AiOutlineHome/>
            </NavLink>
            <NavLink className='sidebar-icon' to='/MessageBox'>
                < FaCommentDots/>
            </NavLink>
            <NavLink className='sidebar-icon' to='/Notification'>
                < IoMdNotificationsOutline/>
            </NavLink>
            <Link className='sidebar-icon' to='/'>
                < RxGear/>
            </Link>
 
        </div>
      
    </div>
  )
}

export default Sidebaricons
