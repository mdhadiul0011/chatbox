import React from 'react'
import './style.css'
import { AiOutlineSearch } from 'react-icons/ai';

const Searchbox = () => {
    const handleSearchbox = ()=> {
      Searchbox.filter((item)=> {
        console.log(item);
      })
    }
  return (
    <div>
        <div className='search-box'>
            <div className='search-icon'>
                <AiOutlineSearch/>
            </div>
            <div className='input-box'>
                <input onChange={handleSearchbox} type='text' placeholder='Search Box..' />
            </div>
        </div>
    </div>
  )
}

export default Searchbox
