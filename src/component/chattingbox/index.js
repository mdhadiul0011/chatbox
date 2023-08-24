import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ModalImage from "react-modal-image";
import { BiPlus } from 'react-icons/bi';
import { RiSendPlaneFill } from 'react-icons/ri';
import { BsFillCameraFill, BsEmojiSmileFill } from 'react-icons/bs';
import { GrGallery } from 'react-icons/gr';
import { MdComment, MdKeyboardVoice } from 'react-icons/md';
import { AiFillCloseCircle } from 'react-icons/ai';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import './style.css';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { AiTwotoneLike } from 'react-icons/ai';
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL, uploadString, uploadBytes } from "firebase/storage";
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import EmojiPicker from 'emoji-picker-react';
import Lottie from "lottie-react";
import conversation from '../../lottie/conversation.json'

const Chatbox = () => {
  const activeChatName = useSelector((state)=> state.active.active);
  const users = useSelector((user) => user.loggedinSlice.login);
  const [open, setOpen] = useState(false);
  const [camera, setCamera] = useState(false);
  const [msg, setMsg] = useState('');
  const choosefile = useState(null);
  const [hidden, setHidden] = useState(false);
  const [msglist, setMsglist] = useState([])
  const [grpmsglist, setGrpMsgList] = useState([])
  const [grpmembers, setGrpMembers] = useState([])
  const [capture, setCapture] = useState('')
  const [voice, setVoice] = useState(false)
  const [audio, setAudio] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const [blob, setBlob] = useState('')
  const [emoji, setEmoji] = useState(false)
  const scrollMsg = useRef(null)
  const db = getDatabase();
  const storage = getStorage();

  //camera funtion start
  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    setCapture(dataUri);

    const storageRef = sref(storage, uuidv4());
    uploadString(storageRef, dataUri, 'data_url').then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        set(push(ref(db, 'SingleMsg')), {
          whosendid: users.uid,
          whosendname: users.displayName,
          whoreceivedid: activeChatName?.id,
          whoreceivedname: activeChatName?.name,
          img: downloadURL,
          date: `${new Date().getFullYear()} - ${new Date().getMonth() + 1} - ${new Date().getDate()} / ${new Date().getHours()} : ${new Date().getMinutes()}`,
        }).then(() => {
          setCamera(false)
        })
      });
    });
  }
  // console.log(capture);
  //camera funtion end

  //Msg Send collection
  const handleSendMsg = ()=> {
    if(activeChatName?.status == 'single'){
      set(push(ref(db, 'SingleMsg')), {
        whosendid: users.uid,
        whosendname: users.displayName,
        whoreceivedid: activeChatName?.id,
        whoreceivedname: activeChatName?.name,
        whatmsg: msg,
        date: `${new Date().getFullYear()} - ${new Date().getMonth() + 1} - ${new Date().getDate()} / ${new Date().getHours()} : ${new Date().getMinutes()}`,
      }).then(()=> {
         setMsg('');
      })
    }else {
      set(push(ref(db, 'GroupMsg')), {
        whosendid: users.uid,
        whosendname: users.displayName,
        whoreceivedid: activeChatName?.id,
        whoreceivedname: activeChatName?.name,
        adminId: activeChatName?.adminid,
        whatmsg: msg,
        date: `${new Date().getFullYear()} - ${new Date().getMonth() + 1} - ${new Date().getDate()} / ${new Date().getHours()} : ${new Date().getMinutes()}`,
      })
      .then(()=> {
        setMsg('');
     })
    }
  }

  //get single massege
  useEffect(()=> {
    onValue(ref(db, 'SingleMsg'), (snapshot)=> {
      let singlemsgarr = []
      snapshot.forEach((item)=> {
        if(item.val().whosendid == users.uid && item.val().whoreceivedid == activeChatName?.id || item.val().whoreceivedid == users.uid && item.val().whosendid == activeChatName?.id){
          singlemsgarr.push(item.val())
        }
        setMsglist(singlemsgarr);
      })
    })
  },[activeChatName?.id])

  //get Group Massege
  useEffect(()=> {
    onValue(ref(db, 'GroupMsg'), (snapshot)=> {
      let grpmsgarr = []
      snapshot.forEach((item)=> {
        grpmsgarr.push(item.val());
      })
      setGrpMsgList(grpmsgarr);
    })
  },[activeChatName?.id])

    //get groupmembers
    useEffect(()=> {
      onValue(ref(db, 'groupmembers'), (snapshot)=> {
        let grpmembersarr = []
        snapshot.forEach((item)=> {
          grpmembersarr.push(item.val().groupid + item.val().userid)
        })
        setGrpMembers(grpmembersarr);
      })
    },[])


  const handleImgClick = (e)=> {
    console.log(e.target.files);
    const storageRef = sref(storage, e.target.files[0].name);

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        console.log(error);
      }, 
      () => {
        
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(push(ref(db, 'SingleMsg')), {
            whosendid: users.uid,
            whosendname: users.displayName,
            whoreceivedid: activeChatName?.id,
            whoreceivedname: activeChatName?.name,
            img: downloadURL,
            date: `${new Date().getFullYear()} - ${new Date().getMonth() + 1} - ${new Date().getDate()} / ${new Date().getHours()} : ${new Date().getMinutes()}`,
          })
        });
      }
    );
  }

  const handleEnterPress = (e)=> {
    if(e.key == 'Enter'){
      handleSendMsg();
    }
  }

  // audio recording start
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioURL(url)
    setBlob(blob)
  };

  //send audio
  const handleSendAudio = ()=> {
    const audioStorageRef = sref(storage, audioURL);

    uploadBytes(audioStorageRef, blob).then((snapshot) => {
      getDownloadURL(audioStorageRef).then((downloadURL) => {
          set(push(ref(db, 'SingleMsg')), {
            whosendid: users.uid,
            whosendname: users.displayName,
            whoreceivedid: activeChatName?.id,
            whoreceivedname: activeChatName?.name,
            audio: downloadURL,
            date: `${new Date().getFullYear()} - ${new Date().getMonth() + 1} - ${new Date().getDate()} / ${new Date().getHours()} : ${new Date().getMinutes()}`,
          }).then(() => {
            setAudioURL('')
          })
        })
    });
  }

  //emoji part start
  const handleEmoji = (emoji)=> {
    setMsg(msg + emoji.emoji)
  }

  //Scroll Message
  useEffect(()=> {
    scrollMsg?.current?.scrollIntoView({behavior: "smooth"})
  },[msglist])

  return (
    <div className='chatBox'>
      <ToastContainer/>
      <div className='active-users-status'>
        <div className='users-img'>
          <div className='image'>
          
          </div>
          <div className='info'>
              <h3>{activeChatName?.name}</h3>
              <span>online</span>
          </div>
        </div>
          <div className='icon'>
            <BsThreeDotsVertical/>
          </div>
      </div>

       <div className='message'>
        {activeChatName?.status == 'single' ? 
          msglist.map((item , i)=> (
            <div ref={scrollMsg}>
              {
                  item.whosendid == users.uid ? item.whatmsg ? 
                    <>
                        <div className='right-box' key={i}>
                          <div className='right-msg'>
                            <p>{item.whatmsg}</p>
                          </div>
                          <span>{moment(item.date, "YYYYMMDD, hh:mm").fromNow()}</span>
                        </div>  
                    </>
                  : 
                  item.img? <div className='right-box'>
                  <div className='right-img'>
                  <ModalImage
                    small={item.img}
                    large={item.img}
                    alt="Hello World!"
                  />
                  
                  </div>
                    <span>{moment(item.date, "YYYYMMDD, hh:mm").fromNow()}</span>
                  </div>
                : <div className='right-box'>
                    <audio controls src={item.audio}>
        
                    </audio>
                      <span>{moment(item.date, "YYYYMMDD, hh:mm").fromNow()}</span>
                    </div> 
        
                  : item.whatmsg ? <>
                      <div className='left-box' key={i}>
                        <div className='left-msg'>
                          <p>{item.whatmsg}</p>
                        </div>
                        <span>
                          {moment(item.date, "YYYYMMDD, hh:mm").fromNow()}
                        </span>
                      </div>
                  </>
                  :               
                    item.img ? 
                    <div className='left-box'>
                    <div className='left-img'>
                    <ModalImage
                      small={item.img}
                      large={item.img}
                      alt="Hello World!"
                    />
                    
                    </div>
                    <span>{moment(item.date, "YYYYMMDD, hh:mm").fromNow()}</span>
                </div> 
                : <div className='left-box'>
                <audio controls src={item.audio}>
        
                </audio>
                <span>{moment(item.date, "YYYYMMDD, hh:mm").fromNow()}</span>
              </div> 
                  }
            </div>
          ))
        : 
          // <div className='lotti-msg'>
          //   <Lottie animationData={conversation} loop={true} />
          // </div>
          users.uid == activeChatName?.adminId || grpmembers.includes(activeChatName?.id + users.uid) ?
          grpmsglist.map((item, i)=> (
          <div key={i}>
            {
              item.whosendid == users.uid ? item.whoreceivedid == activeChatName?.id &&
              <div className='right-box' key={i}>
                <div className='right-msg'>
                  <p>{item.whatmsg}</p>
                </div>
                <span>{moment(item.date, "YYYYMMDD, hh:mm").fromNow()}</span>
              </div>  
                
              :
              item.whoreceivedid == activeChatName?.id &&
              <div className='left-box' key={i}>
                <div className='left-msg'>
                  <p>{item.whatmsg}</p>
                </div>
                <span>
                  {moment(item.date, "YYYYMMDD, hh:mm").fromNow()}
                </span>
              </div>
            }
          </div>))
          
          : 'nai'
        }

        {/* ==========left box start========== */}
          {/* <div className='left-box'>
              <div className='left-msg'>
                <p>My name is ashik </p>
              </div>
              <span>Today, 02:30pm</span>
          </div> */}
        {/* ==========left box end========== */}

        {/* ==========right box start========== */}
            {/* <div className='right-box'>
              <div className='right-msg'>
                <p>Hi Ashik How are you? How is your parent? and How is your study?</p>
              </div>
              <span>Today, 02:30pm</span>
          </div> */}
        {/* ==========right box end========== */}

        {/* ==========left box start========== */}
            {/* <div className='left-box'>
             <div className='left-img'>
             <ModalImage
                small={'/images/bilai.jpg'}
                large={'/images/bilai.jpg'}
                alt="Hello World!"
              />
              
             </div>
              <span>Today, 02:30pm</span>
          </div> */}
        {/* ==========left box end========== */}

        {/* ==========right box start========== */}
          {/* <div className='right-box'>
             <div className='right-img'>
             <ModalImage
                small={'/images/ashik.jpg'}
                large={'/images/ashik.jpg'}
                alt="Hello World!"
              /> */}
                {/* <img src='/images/ashik.jpg'/> */}
             {/* </div>
              <span>Today, 02:30pm</span>
          </div> */}
        {/* ==========right box end========== */}

        {/* ==========right box start========== */}
            {/* <div className='right-box'>
             <audio controls>

             </audio>
              <span>Today, 02:30pm</span>
          </div> */}
        {/* ==========right box end========== */}

        
        {/* ==========left box start========== */}
          {/* <div className='left-box'>
             <audio controls>

             </audio>
              <span>Today, 02:30pm</span>
          </div> */}
        {/* ==========left box end========== */}
          {/* ==========left box start========== */}
            {/* <div className='left-box'>
             <video controls>

             </video>
              <span>Today, 02:30pm</span>
          </div> */}
        {/* ==========left box end========== */}
      </div> 
      
      <div className='msg-input'>
            {!audioURL && <div className='text-input'>
            {
              !voice &&
                <input type='text' onKeyUp={handleEnterPress} value={msg} onClick={()=>setHidden(true)} onChange={(e)=>setMsg (e.target.value)}/>
            }
            {/* =========emoji part start========== */}
                {
                !voice &&
                  <div className='emoji-part' onClick={()=> setEmoji(!emoji)}>
                  <BsEmojiSmileFill/>
                  </div>
                }
                {
                  emoji &&
                  <div className='emoji-picker'>
                    <EmojiPicker onEmojiClick={handleEmoji}/>
                  </div>
                }
            {/* =========emoji part end========== */}

              <div className='options' >
                <div onClick={()=> setOpen(!open)}>
                    <BiPlus/>
                </div>
                {open && <div className='more-options'>
                      <div className='camera' onClick={()=>setCamera(true)}>
                        <BsFillCameraFill/>
                      </div>
                      <div className='gallary' onChange={handleImgClick}>
                        <div onClick={()=>choosefile.current.click()}>
                          <GrGallery/>
                          <input hidden type='file' ref={choosefile}/>
                        </div>
                      </div>
                      <div className='voice'>
                        <div onClick={()=>setAudio(!audio)}>
                          <MdKeyboardVoice />
                        </div>
                          {
                            audio && 
                            <div className='voiceRecorder' onClick={()=>setVoice(!voice)}>
                            <AudioRecorder className='audiorecord' onRecordingComplete={addAudioElement}/>
                          </div>
                          }
                          
                      </div>
                  </div>
                }
              </div>

              
          </div>}
          {audioURL && (
            <div className='audio-btn'>
              <audio controls src={audioURL}></audio>
              <button className='audio-send-btn' onClick={handleSendAudio}>Send</button>
              <button className='audio-delete-btn' onClick={()=> setAudioURL('')}>Delete</button>
            </div>
          )}



      { !audioURL && 
      (<button className='send-btn'  onClick={handleSendMsg}>
        {hidden ? <RiSendPlaneFill/> : <AiTwotoneLike/>}
      </button>)}
 
        
      </div>

      {
            camera &&
            <div className='capture-img'>
              <div className='close' onClick={()=>setCamera(false)}>
                <AiFillCloseCircle/>
              </div>
               <Camera
                onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                
              />
            </div>
        }
    </div>
  )
}

export default Chatbox;
