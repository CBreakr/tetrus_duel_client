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
                    isNumber(props.rank)
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

function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}