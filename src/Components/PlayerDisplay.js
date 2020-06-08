import React from "react";

class PlayerDisplay extends React.Component {
    render() {
        return (
            <div>Player: {this.props.name} - {this.props.rank}</div>
        );
    }
}

export default PlayerDisplay;