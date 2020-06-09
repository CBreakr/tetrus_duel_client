import React from "react";

class Dashboard extends React.Component {
    render() {

        console.log("DASHBOARD PROPS", this.props);

        return (
            <>
            <div>DASHBOARD</div>
            <div>OPPONENT INFO</div>
            </>
        );
    }
}

export default Dashboard;