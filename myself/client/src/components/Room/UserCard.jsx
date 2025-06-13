

export const UserCard = ({user})=>{


    return(
        <div className="usercard">
            <img src={`https://robohash.org/${user.id}?size=200x200`} alt="" />
            <h2>{user.name}</h2>
            
        </div>
    )
}