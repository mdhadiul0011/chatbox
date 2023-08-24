import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import './style.css'
import { useSelector } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import Alert from '@mui/material/Alert';
import { getDownloadURL, ref as storageRef, getStorage } from 'firebase/storage';

const Userlist = () => {
    const users = useSelector((user) => user.loggedinSlice.login);
    const db = getDatabase();
    const storage = getStorage();
    const [userlist, setUserList] = useState([])
    const [friendreq, setFriendreq] = useState([])
    const [ frndlist, setFrndlist] = useState([])
    const [blocklist, setBlocklist] = useState([])
    const [filteruser, setFilteruser] = useState([])
    const [serchRemove, setserchRemove] = useState(false)
    const defaultProfile = "./images/profile.png";


    useEffect(()=> {
        const starCountRef = ref(db, 'users');
        onValue(starCountRef, (snapshot) => {
            const usearr = []
            snapshot.forEach((userlist)=>{
                if(users.uid != userlist.key){
                    usearr.push({...userlist.val(), id: userlist.key})
                }
            })
            setUserList(usearr)
        });
    }, [])
    
    const handleAdd = (item)=> {
        set(push(ref(db, 'Friendrequest')), {
            sendername: users.displayName,
            senderid: users.uid,
            senderimg: users.photoURL,
            receivername: item.username,
            receiverid: item.id,
            receiverimg: item.profilePicture
          });
    };

   

    //show friendrequest
    useEffect(()=> {
        const starCountRef = ref(db, 'Friendrequest');
        onValue(starCountRef, (snapshot) => {
            const reqarr = [];
            snapshot.forEach((item)=> {
                reqarr.push(item.val().receiverid + item.val().senderid)
            })
            setFriendreq(reqarr)
        });
    }, [])

    const handleRemove = (id)=> {
        remove(ref(db, 'users/' + id));
    }

    //show friends 
    
    useEffect(()=> {
        const starCountRef = ref(db, 'Friends');
        onValue(starCountRef, (snapshot) => {
            const frndarr = [];
            snapshot.forEach((item)=> {
                frndarr.push(item.val().receiverid + item.val().senderid)
            });
            setFrndlist(frndarr)
        })
    }, [])

    //block frnd
    useEffect(()=> {
        const starCountRef = ref(db, 'Blockuser');
        onValue(starCountRef, (snapshot)=> {
            const blockarr = [];
            snapshot.forEach((item) => {
                blockarr.push(item.val().receiverid + item.val().senderid)
            });
            setBlocklist(blockarr);
        })
    }, [])

    useEffect(() => {
        const fetchUsers = ref(db, "users");
        onValue(fetchUsers, (snapshot) => {
          let imgarr = [];
          snapshot.forEach((item) => {
            if (users.uid !== item.key) {
              getDownloadURL(storageRef(storage, item.key))
                .then((url) => {
                    imgarr.push({
                    ...item.val(),
                    id: item.key,
                    profilePicture: url,
                  });
                })
                .catch((error) => {
                    imgarr.push({
                    ...item.val(),
                    id: item.key,
                    profilePicture: null,
                  });
                })
                .then(() => {
                    setUserList([...imgarr]);
                });
            }
          });
        });
      }, [db, storage, users.uid]);

    //   const handleSearch = (e) => {
    //     let arr = []
    //     userlist.filter((item)=> {
    //         if(item.usersname.toLowerCase().includes(e.target.value.toLowerCase())){
    //             arr.push(item);
    //             setFilteruser(arr);
    //         }
    //     })
    //   }
    const handleSearch = (e) => {
        let arr = [];
    
        // if (e.target.value.length === 0 ) {
        //     setFilteruser([]);
        // }
    
        userlist.filter((item) => {
          if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
            arr.push(item);
            setFilteruser(arr);
          } 
          else if (item.username.toLowerCase().includes(e.target.value.toLowerCase()) == 0) {
            setFilteruser(arr);
            setserchRemove(true);
          }
        });
      };

  return (
    <div className='Userlist-list'>
        <div className='Userlist-header'>
            <h3>User List</h3>
        </div>
        <div>
        <div className='search-box'>
            <div className='search-icon'>
                <AiOutlineSearch/>
            </div>
            <div className='input-box'>
                <input onChange={handleSearch} type='text' placeholder='Search Box..' />
            </div>
        </div>
    </div>
    {
        serchRemove & filteruser.length == 0 ? <Alert severity="error" className='alert'>Friends Not found</Alert> : 
        filteruser.length > 0 ?
        filteruser && filteruser.map((item, i)=> (
            <div key={i} className='Userlist-items-wrapper'>
                <div className='Userlist-item'>
                    <div className='Userlist-img'>
                        <img
                            src={ item.profilePicture ?? defaultProfile}
                            onError={(e) => {
                                e.target.src = defaultProfile;
                            }}
                            alt=""
                        />
                    </div>
                    <div className='userlist-items'>
                        <div className='Userlist-name'>
                            <h4>{item.username}</h4>
                        </div>
                        <div className='Userlist-list-btn'>
                            {blocklist.includes(item.id + users.uid) || blocklist.includes(users.uid + item.id) ?
                                (<div className='cancelbtn'>
                                <button className='frndbtn' type='text' disabled>
                                      Blocked
                                 </button>
                              </div>) :
                                frndlist.includes(item.id + users.uid) || frndlist.includes(users.uid + item.id) ? 
                                (<div className='cancelbtn'>
                                       <button className='frndbtn' type='text' disabled>
                                             Friend
                                        </button>
                                     </div>) :
                                friendreq.includes(item.id + users.uid) || friendreq.includes(users.uid + item.id) ? (<div className='cancelbtn'>
                                        <h5>Request Sent</h5>
                                       <button type='text' disabled>
                                             Cancel Request
                                        </button>
                                     </div>) : (
                                    <div className='Userlist-list-btn'>
                                        <button type='text' onClick={()=>handleAdd(item)}>Add</button>
                                        <button type='text' onClick={()=> handleRemove(item.id)}>Remove</button>
                                    </div>
                                 )
                            }
                        </div>
                    </div>
                </div>
            </div>
        )) :
        userlist && userlist.map((item, i)=> (
            <div key={i} className='Userlist-items-wrapper'>
                <div className='Userlist-item'>
                    <div className='Userlist-img'>
                        <img
                            src={ item.profilePicture ?? defaultProfile}
                            onError={(e) => {
                                e.target.src = defaultProfile;
                            }}
                            alt=""
                        />
                    </div>
                    <div className='userlist-items'>
                        <div className='Userlist-name'>
                            <h4>{item.username}</h4>
                        </div>
                        <div className='Userlist-list-btn'>
                            {blocklist.includes(item.id + users.uid) || blocklist.includes(users.uid + item.id) ?
                                (<div className='cancelbtn'>
                                <button className='frndbtn' type='text' disabled>
                                      Blocked
                                 </button>
                              </div>) :
                                frndlist.includes(item.id + users.uid) || frndlist.includes(users.uid + item.id) ? 
                                (<div className='cancelbtn'>
                                       <button className='frndbtn' type='text' disabled>
                                             Friend
                                        </button>
                                     </div>) :
                                friendreq.includes(item.id + users.uid) || friendreq.includes(users.uid + item.id) ? (<div className='cancelbtn'>
                                        <h5>Request Sent</h5>
                                       <button type='text' disabled>
                                             Cancel Request
                                        </button>
                                     </div>) : (
                                    <div className='Userlist-list-btn'>
                                        <button type='text' onClick={()=>handleAdd(item)}>Add</button>
                                        <button type='text' onClick={()=> handleRemove(item.id)}>Remove</button>
                                    </div>
                                 )
                            }
                        </div>
                    </div>
                </div>
            </div>
        ))
    }

    </div>
  )
}
export default Userlist;

