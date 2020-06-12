import React from "react";

const RankDisplay = (props) => {

    console.log();

    return (
        <>
        {
            props
            ? <span className="user-display">
                {props.name}
                {
                    Number.isInteger(props.rank)
                    ? `(${props.rank})`
                    : ""
                }
            </span>
            : ""
        }
        </>        
    )
}

export default RankDisplay;