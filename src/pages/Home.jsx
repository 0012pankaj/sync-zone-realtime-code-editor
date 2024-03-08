import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    let navigate=useNavigate();
     const [roomId,setRoomId]=useState("");
     const [username,setUserName]=useState("");

    const createNewRoom =(e)=>{
         e.preventDefault();
         const id=uuidv4();
         setRoomId(id);
        //  console.log(id);

        toast.success('New Room created!');

        
    }

    const joinRoom=()=>{
     if(!roomId || !username){
        toast.error('ROOM ID & USER NAME is required!!');
        return;
     }
     navigate(`/editor/${roomId}`,{
        state:{
           username,
        },
    });
    }
 
    //during fill form on press enter perorm join room functionality
    const handelKeyup=(e)=>{
     if(e.code === "Enter"){
        joinRoom();
     }
    }

  return (
        <div className='homePageWrapper'>
            <div className='formWrapper'>
                <img  className="homePageLogo" src="/llg2.png" alt="logo-pic" />
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input 
                      
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e)=>setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handelKeyup}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USER NAME"
                        onChange={(e)=>setUserName(e.target.value)}
                        value={username}
                        onKeyUp={handelKeyup}
                    />

                    <button className='btn joinBtn' onClick={joinRoom}> join</button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                        <a  href="" onClick={createNewRoom}  className="createNewBtn">
                              new room
                        </a>
    
                    </span>
                </div>    
            </div>

            <footer>
                <h4> &copy; SyncZone 2024
                    | Created   &#128498;  by &nbsp;
                    <a href="https://github.com/0012pankaj">Pankaj</a>
                </h4>
            </footer>
        </div>

 
  )
}

export default Home