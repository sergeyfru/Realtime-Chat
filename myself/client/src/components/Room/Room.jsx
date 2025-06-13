import { UserCard } from "./UserCard";
import './room.css'


export const Room = ({roomCode,users}) => {


  return (
    <>
      <h3>Room Code: {roomCode}</h3>
    
    <div className="room">
      
        {users.map((user, i) => {
          return <UserCard user={user} key={i}></UserCard>;
        })}
    </div>
    </>
  );
};
