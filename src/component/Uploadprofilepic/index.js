import React, { useRef, useState } from 'react'
import './style.css'
import { TbFileUpload } from 'react-icons/tb';
import ImgCropper from './imgcropper';
import "cropperjs/dist/cropper.css";
import { getStorage, uploadString, ref, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { Loginuser } from '../../features/slice/UsersSlice';

const Uploadprofile = ({setOpen}) => {
  const chooseFile = useRef(null);
  const [img, setImg] = useState();
  const [cropData, setCropData] = useState();
  const [cropper, setCropper] = useState();
  const storage = getStorage();
  const dispatch = useDispatch();
  const auth = getAuth();
  const users = useSelector((user) => user.loggedinSlice.login);

  const handleUpload = () => {
    chooseFile.current.click();
  }

  const handleUploadProfile = (e) => {
    e.preventDefault(null)
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result);
    };
    reader.readAsDataURL(files[0]);
  }

  const storageRef = ref(storage, users.uid);
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(()=> {
            setOpen(false)
            dispatch(Loginuser({...users, photoURL: downloadURL}))
            localStorage.setItem('users', JSON.stringify({...users, photoURL: downloadURL}))
          })
        });
      });
    }
  };

  return (
    <>
      <div className='upload-box'>
        <input type='file' hidden ref={chooseFile} onChange={handleUploadProfile}/>
        <div className='upload-photo' onClick={handleUpload}>
          <div className='upload-icon'>
            <TbFileUpload/>
          </div>
          <h3>Upload Picture</h3>
        </div>
         {img && <ImgCropper img={img} setCropper={setCropper} setImg={setImg} cropData={cropData} getCropData={getCropData}/>}
      </div>
    </>
  )
}

export default Uploadprofile;
