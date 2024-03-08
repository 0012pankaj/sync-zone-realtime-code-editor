import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../../Actions';



const Editor = ({socketRef,roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            editorRef.current =  Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
                 //codemirror event listner 'change
            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes; //give action perform on editor input,delete,paste
                const code = instance.getValue(); //give value of editer whatever present on editor
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, { //send to server 
                        roomId,
                        code,
                    });
                }
                // console.log('changes',changes);
                // console.log(code);
            });
            
           

        }
       
        
        return () => {
            // This code will run when the component unmounts
            init();
          };

       

    },[]);//only render one time
    //-------------------------------------------

     //recive code from server
     useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) { //if null whole editor clean up
                    editorRef.current.setValue(code);
                }
            });
        }
          
        //cleanup events
        return () => {
            socketRef.current?.off(ACTIONS.CODE_CHANGE);
        };

    }, [socketRef.current]);

  return   <textarea id="realtimeEditor"></textarea>;
  
}

export default Editor;
