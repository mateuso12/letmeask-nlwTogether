import logoImg from "../assets/images/logo.svg";

import { useParams } from "react-router";
import { RoomCode } from "../components/RoomCode";
import { Button } from "../components/Button";

import "../styles/room.scss"
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

type RoomParams = {
  id: string;
}

export function Room() {
  const user = useAuth()
  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = useState('');

  const roomId = params.id;

  async function handleSendQuestion() {
    if(newQuestion.trim() === '') {
      return;
    }
    
    if(!user) {
     toast.error('You must be logged in')
    }
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

        <form>
          <textarea placeholder="O que você quer perguntar?" onChange={event => setNewQuestion(event.target.value)} value={newQuestion}/>

          <div className="form-footer">
            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
            <Button type='submit' onClick={handleSendQuestion}>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
