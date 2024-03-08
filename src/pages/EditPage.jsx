import React, { useEffect, useRef, useState } from 'react'
import Client from '../Componenets/Client'
import Editor from '../Componenets/Editor'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { initSocket } from '../Socket'
import ACTIONS from '../../Actions'
import toast from 'react-hot-toast'


const EditPage = () => {
    const socketRef=useRef(null);
    const  codeRef=useRef(null);
    const location=useLocation();
    const rNavigator=useNavigate();
    const {roomId}=useParams();
    const [clients,setClients]=useState([]);
   
    // useEffect(() => {
       
    //     const init = async  () => {
    //         socketRef.current =await initSocket();
    //         socketRef.current.on('connect_error', (err) => handleErrors(err));
    //         socketRef.current.on('connect_failed', (err) => handleErrors(err));

    //         function handleErrors(e) {
    //             console.log('socket error', e);
    //             toast.error('Socket connection failed, try again later.');
    //             rNavigator('/');
    //         }

    //         socketRef.current?.emit(ACTIONS.JOIN, {
    //             roomId,
    //             username: location.state?.username,
    //         });
     
    //         // Listening for joined event
    //         socketRef.current.on(
    //             ACTIONS.JOINED,
    //             ({ clients, username, socketId }) => {
    //                 if (username !== location.state?.username) {
    //                     toast.success(`${username} joined the room.`);
    //                     console.log(`${username} joined`);
    //                 }
    //                 setClients(clients);
    //                 socketRef.current.emit(ACTIONS.SYNC_CODE, {
    //                     code: codeRef.current,
    //                     socketId,
    //                 });
    //             }
    //         );

    //         // Listening for disconnected
    //         socketRef.current.on(
    //             ACTIONS.DISCONNECTED,
    //             ({ socketId, username }) => {
    //                 toast.success(`${username} left the room.`);
    //                 setClients((prev) => {
    //                     return prev.filter(
    //                         (client) => client.socketId !== socketId
    //                     );
    //                 });
    //             }
    //         );
    //     };
       
       
    //    //we need to clear all event listners to avoid memory breach
      
    //     return () => {
    //         init();
    //         socketRef.current?.disconnect();
    //         socketRef.current?.off(ACTIONS.JOINED);
    //         socketRef.current?.off(ACTIONS.DISCONNECTED);
    //     };
    // },[]);

    useEffect(() => {
        const init = async () => {
            socketRef.current =  initSocket();
            socketRef.current?.on('connect_error', handleErrors);
            socketRef.current?.on('connect_failed', handleErrors);
    
            socketRef.current?.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
    
            socketRef.current?.on(ACTIONS.JOINED, handleJoined);
            socketRef.current?.on(ACTIONS.DISCONNECTED, handleDisconnected);
        };
    
        
    
       
        const handleErrors = (err) => {
            console.log('socket error', err);
            toast.error('Socket connection failed, try again later.');
            rNavigator('/');
        };
        const handleJoined = ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
                toast.success(`${username} joined the room.`);
                console.log(`${username} joined`);
            }
            setClients(clients);
            socketRef.current?.emit(ACTIONS.SYNC_CODE, {
                code: codeRef.current,
                socketId,
            });
        };
    
        const handleDisconnected = ({ socketId, username }) => {
            toast.success(`${username} left the room.`);
            setClients((prev) => prev.filter((client) => client.socketId !== socketId));
            
        };
            
    
       
        init();
         // Component Unmount Cleanup
        return () => {
          
            socketRef.current?.disconnect();
            socketRef.current?.off(ACTIONS.JOINED, handleJoined);
            socketRef.current?.off(ACTIONS.DISCONNECTED, handleDisconnected);
        };
    }, []);
    

   async function copyroomId(){
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied !');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }
    
    function leaveRoom() {
        rNavigator('/');
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }


  return (
    <>
    <div className='mainWrap'>
      <div className="aside">
                <div className="asideInner">
                <div className="logo">
                        <img
                            className="logoImage"
                            src="/llg1.png"
                            alt="logo"
                        />
                </div>

                <h3>Connected</h3>

                <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                </div>


           </div>   

           <button className='btn copyBtn' onClick={copyroomId}>copy Room Id</button>  

           <button  className='btn leaveBtn' onClick={leaveRoom}>Leave</button>  
     </div>

     <div className='editorWrap'>
        <Editor socketRef={socketRef} roomId={roomId}  
                     onCodeChange={(code) => {
                        codeRef.current = code;
                    }} />
     </div>
  </div>
  </>
  )
}

export default EditPage

