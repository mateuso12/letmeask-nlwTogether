import logoImg from "../assets/images/logo.svg";
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { useParams } from "react-router";

import { RoomCode } from "../components/RoomCode/Index";
import { Button } from "../components/Button/Index";
import { useRoom } from "../hooks/useRoom";
import { Question } from "../components/Question/Index";
// import { useAuth } from "../hooks/useAuth";

import "../styles/room.scss";
import { database } from "../services/firebase";
import { useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

type RoomParams = {
  id: string;
};


export function AdminRoom() {
  // const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions, admin, loading, isEnded } = useRoom(roomId);
  const [isOpen, setIsOpen] = useState(false)
  const {user, userLoading} = useAuth()

  const history = useHistory()

  
  useEffect(() => {
    if(!userLoading && !loading) {
      if (!user || user.id !== admin) {
        history.push(`/rooms/${roomId}`);
      }
    }
  }, [history, loading, admin, roomId, user, userLoading])

  useEffect(() => {
    if(!loading && isEnded) {
      history.push("/");
      toast.error("A sala que você estava foi encerrada!")
    }
  }, [history, isEnded, loading])

  async function handleExitRoom() {
    try {
      database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      })
      history.push('/');
      toast.success('Sala encerrada')
    } catch {
      toast.error('Ocorreu um erro ao encerrar a sala')
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    setIsOpen(true) 
    try {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
      toast.success('Pergunta removida')
    }
    catch {
      toast.error('Erro na remoção da pergunta')
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered:true
    })
  }
  
  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted:true
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={() => handleExitRoom()}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                  <button type='button' onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                  <img src={checkImg} alt="Marcar pergunta como respondida" />
                </button>
                <button type='button' onClick={() => handleHighlightQuestion(question.id)}>
                  <img src={answerImg} alt="Dar destaque a pergunta" />
                </button>
                </>
                )}
                <button type='button' onClick={() => handleDeleteQuestion(question.id)}>
                  {isOpen ? <h1>Modal</h1> : null}
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
