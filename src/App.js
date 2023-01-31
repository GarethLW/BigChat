import './App.css';
import React, { useRef, useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection  } from 'react-firebase-hooks/firestore';


import { getFirestore, collection } from 'firebase/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBm4dAeBgyDenx4xhrk4aA--nOZ2AyxpWk",
  authDomain: "superchat-3d811.firebaseapp.com",
  projectId: "superchat-3d811",
  storageBucket: "superchat-3d811.appspot.com",
  messagingSenderId: "224209036844",
  appId: "1:224209036844:web:7bc460c0307cba82e6d389",
  measurementId: "G-DXJ0M5N5RH"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>

      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}



function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={'message ${messageClass}'}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}




function ChatRoom (){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [value, loading, error] = useCollection(
    query, {idField: 'id'}
  );

  const[formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <>
      <div>
          {value && value.docs.map((doc) => <ChatMessage key={doc.data().id} message={doc.data()}/>)}
          
          <div ref={dummy}></div>
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">🕊️</button>
      </form>
    </>
  );
};

export default App;
