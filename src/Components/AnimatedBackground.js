import React from "react";

//
// need to create types as well
//

/*
T
L (right and left)
S (right and left)
square
long
*/

const type_T = 0;
const type_L_right = 1;
const type_L_left = 2;
const type_S_right = 3;
const type_S_left = 4;
const type_square = 5;
const type_long = 6;

class AnimatedBackground extends React.Component {

    generateShape = (index, previousDelay) => {
        const shape = {
            type: Math.floor(Math.random() * 7),
            delay: Math.floor(Math.random() * 40)/4,
            left: 2*index - 1
        };

        if (shape.delay >= previousDelay && shape.delay - previousDelay <= 1){
            shape.delay -= 3;
        }
        else if(previousDelay >= shape.delay && previousDelay - shape.delay <= 1){
            shape.delay -= 3;
        }

        console.log("shape", shape);

        return shape;
    }

    render() {

        let prevDelay = 0;
        const shapes = [...new Array(50)].map((v, index) => {
            const shape = this.generateShape(index, prevDelay);
            prevDelay = shape.delay;
            return shape;
        });

        return (
            <div className="animated-background">
                {
                    shapes.map((shape, index) => {
                        return <BackgroundBlock key={index} {...shape} />
                    })
                }
            </div>
        )
    }
}

class BackgroundBlock extends React.Component {
    render() {

        const left = `${this.props.left}%`;
        const delay = `${this.props.delay}s`;

        const classes = ["block ", "block ", "block "];

        switch(this.props.type){
            case type_T:
                classes[0] += "down1 left1";
                classes[1] += "down1";
                classes[2] += "down1 right1";
                break;
            case type_L_right:
                classes[0] += "right1";
                classes[1] += "down1 right1";
                classes[2] += "down2 right1";
                break;
            case type_L_left:
                classes[0] += "down1";
                classes[1] += "right1";
                classes[2] += "right2";
                break;
            case type_S_right:
                classes[0] += "left1";
                classes[1] += "down1";
                classes[2] += "down1 right1";
                break;
            case type_S_left:
                classes[0] += "down1";
                classes[1] += "down1 right1";
                classes[2] += "down2 right1";
                break;
            case type_square:
                classes[0] += "right1";
                classes[1] += "down1";
                classes[2] += "down1 right1";
                break;
            case type_long:
                classes[0] += "down1";
                classes[1] += "down2";
                classes[2] += "down3";
                break;
        }

        return (
            <div className="shape" style={{left: left, "animation-delay": delay}}>
                <div className="block"></div>
                <div className={classes[0]}></div>
                <div className={classes[1]}></div>
                <div className={classes[2]}></div>
            </div>
        )
    }
}

export default AnimatedBackground;