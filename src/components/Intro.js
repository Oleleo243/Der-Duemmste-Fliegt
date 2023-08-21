export const Intro = ({player,  uid, randomQuestion}) => {
   
    return(
   
        <div>
            <h1>{player.playerName}</h1>
            {player.playerID === uid && (
                <h1>Das bist du!!!</h1>
            )}
            <h1>{randomQuestion}?</h1>

        </div>
    )
}