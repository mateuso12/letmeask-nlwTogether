import logoImg from "../assets/images/logo.svg";

import { useParams } from "react-router";
import { RoomCode } from "../components/RoomCode";
import { Button } from "../components/Button";

import "../styles/room.scss"
import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = useState('');

  const roomId = params.id;

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if(newQuestion.trim() === '') {
      return;
    }
    
    if(!user) {
     toast.error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`/rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala React</h1>
          <span>x perguntas</span>
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea placeholder="O que você quer perguntar?" onChange={event => setNewQuestion(event.target.value)} value={newQuestion}/>

          <div className="form-footer">
            { user ? (
            <div className="user-info">
              <img src={user.avatar} alt={user.name} />
              <span>{user.name}</span>
            </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button></span>) }
            
            <Button type='submit' onClick={handleSendQuestion} disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
