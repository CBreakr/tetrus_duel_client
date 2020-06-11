import React from "react";

const RankDisplay = (props) => {

    console.log();

    return (
        <>
        {
            props
            ? <span className="user-display">
                {`${props.name}(${props.rank})`}
            </span>
            : ""
        }
        </>        
    )
}

export default RankDisplay;