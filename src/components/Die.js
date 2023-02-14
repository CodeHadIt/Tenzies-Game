
const Die = (props) => {
    const styles = {
            backgroundColor: props.isHeld ? "#B3FDA4" : "white",
            color: props.isHeld ? "white" : "#232946"
        }

    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            <h2 className="die-num">{props.value}</h2>
        </div>
    )
}

export default Die