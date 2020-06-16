import React from "react";

const RankDisplay = (props) => {

    console.log("RANK DISPLAY", props);

    return (
        <>
        {
            props
            ? <span className="rank-outer">
                <span className="rank-display">
                    <span className="username">
                        {props.name}
                    </span>
                    {
                        isNumber(props.rank)
                        ? <span className="rank">{props.rank}</span>
                        : ""
                    }
                </span>
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