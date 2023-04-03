import { useState, useEffect } from "react";
import {addDoc, serverTimestamp,collection, onSnapshot, query, where, orderBy} from "firebase/firestore";
import {db, auth} from '../firebase-config.js';
import '../styles/Chat.css';




export const Chat = (props) => {
    const [newMessage, setNewMessage] = useState("");
    const messagesRef = collection(db, "messages");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const queryMessages = query(messagesRef, where("room", "==", props.room), orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
          let messagesArray = [];
          snapshot.forEach((doc) => {messagesArray.push({...doc.data(), id: doc.id})})
          setMessages(messagesArray);
        });
        return () => {
          unsubscribe();
        }
      }, [])

    const handleSubmit = async  (e) => {
        e.preventDefault();
        if (newMessage === "") {
            return;
        }
        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room: props.room,
        });
        setNewMessage("");
        console.log(messages);

    }

    return(
        <div className="chat-app">
            <div className="header">
                <h1> Welcome to Room: {props.room}</h1>
            </div>
            <div>{messages.map((messages) => 
                <div className="message" key ={messages.id}>
                    <span className = "user">{messages.user}:</span>
                    {messages.text}
                </div>)}
            </div>
            <form onSubmit = {handleSubmit} className = "new-message-form">
                <input onChange={(e) => {setNewMessage(e.target.value)}} className = "new-message-input" placeholder = "Type your message NOW" value = {newMessage}/>
                <button type = "submit" className="send-button">send</button>
            </form>
        </div>
    );
}