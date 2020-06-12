import React from "react";

import { enterLobby } from "../requests";
import { withRouter } from "react-router-dom";
import AuthContext from "../AuthContext";

const left_key = 37;
const up_key = 38;
const right_key = 39;
const down_key = 40;

const square_piece = 1;
const t_piece = 2;
const row_piece = 3;
const l_right_piece = 4;
const l_left_piece = 5;
const s_right_piece = 6;
const s_left_piece = 7;

const height = 20;
const width = 10;

let nextRows = 0;

class GameBoard extends React.Component {

    state = {
        grid: [
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0] 
        ],
        game_id: null,
        paused: false,
        active: null,
        rotation: 0,
        gameOver: false,
        timer: null,
        nextPiece: null,
        move_number: 0     
    }

    static contextType = AuthContext;

    //
    //
    //
    handleKeyDown = (event) => {
        switch(event.keyCode){
            case left_key:
                // console.log("key left");
                this.moveLeft();
                break;
            case right_key:
                // console.log("key right");
                this.moveRight();
                break;
            case down_key:
                // console.log("key down");
                this.moveDown();
                break;
            case up_key:
                // console.log("rotate clockwise");
                this.rotateClockwise();
                break;
            default:
                // do nothing for now
        }
    }

    //
    //
    //
    moveDown = () => {

        // no motion allowed when paused
        if(!this.state.timer){
            return;
        }

        // if the piece can't move down, set it in place
        // move the piece down
        if(this.checkDown()){
            const copy = [...this.state.grid];

            // start from the bottom up
            for(let r_index = height-1; r_index >= 0; r_index--){
                for(let c_index = 0; c_index < width; c_index++){
                    if(copy[r_index][c_index] === 2){
                        copy[r_index+1][c_index] = 2;
                        copy[r_index][c_index] = 0;
                    }
                }
            }
    
            this.setState({grid:copy});
        }
        else{
            this.setGridAllInactve();
        }
    }

    //
    //
    //
    moveLeft = () => {
        if(this.checkLeft()){
            const copy = [...this.state.grid];
        
            for(let r_index = 0; r_index < height; r_index++){
                for(let c_index = 0; c_index < width; c_index++){
                    if(copy[r_index][c_index] === 2){
                        copy[r_index][c_index-1] = 2;
                        copy[r_index][c_index] = 0;
                    }
                }
            }
    
            this.setState({grid: copy});
        }        
    }

    //
    //
    //
    moveRight = () => {
        if(this.checkRight()){
            const copy = [...this.state.grid];
        
            for(let r_index = 0; r_index < height; r_index++){
                for(let c_index = width-1; c_index >= 0; c_index--){
                    if(copy[r_index][c_index] === 2){
                        copy[r_index][c_index+1] = 2;
                        copy[r_index][c_index] = 0;
                    }
                }
            }
    
            this.setState({grid: copy});
        }
    }

    //
    //
    //
    checkDown = () => {
        const copy = this.state.grid;

        for(let r_index = height-1; r_index >= 0; r_index--){
            for(let c_index = 0; c_index < width; c_index++){
                if(copy[r_index][c_index] === 2 
                    && (
                        r_index+1 === height
                        || copy[r_index+1][c_index] === 1
                    )
                ){
                    return false;
                }
            }
        }
        return true;
    }

    //
    //
    //
    checkLeft = () => {

        // no motion allowed when paused
        if(!this.state.timer){
            return false;
        }

        const copy = this.state.grid;

        for(let r_index = 0; r_index < height; r_index++){
            for(let c_index = 0; c_index < width; c_index++){
                if(copy[r_index][c_index] === 2 
                    && (
                        c_index === 0
                        || copy[r_index][c_index-1] === 1
                    )
                ){
                    return false;
                }
            }
        }

        return true;
    }

    //
    //
    //
    checkRight = () => {

        // no motion allowed when paused
        if(!this.state.timer){
            return false;
        }

        const copy = this.state.grid;

        for(let r_index = 0; r_index < height; r_index++){
            for(let c_index = width-1; c_index >= 0; c_index--){
                if(copy[r_index][c_index] === 2
                    && (
                        c_index+1 === width
                        || copy[r_index][c_index+1] === 1
                    )
                ){
                    return false;
                }
            }
        }

        return true;
    }

    //
    //
    //
    nextStep = () => {
        if(this.state.active){
            // for now, for the sake of testing
            this.moveDown();
        }
        else{
            this.generateNewPiece();
        }
    }

    //
    //
    //
    setGridAllInactve = () => {

        const copy = [...this.state.grid];
        copy.forEach((row, row_index) => {
            row.forEach((cell, cell_index) => {
                if(copy[row_index][cell_index] === 2){
                    copy[row_index][cell_index] = 1;
                }
            });
        });

        this.clearCompletedLines(copy);

        this.setState({grid: copy, active: null, move_number: this.state.move_number+1}, () => {
            if(this.props.sendUpdate && typeof this.props.sendUpdate === "function"){
                console.log("SEND UPDATE", this.state);
                this.props.sendUpdate(this.state);
            }
        });
    }

    //
    //
    //
    clearCompletedLines = (grid) => {
        const cleared = [];
        for(let r_index = height-1; r_index >= 0 ; r_index--){
            if(this.isLineComplete(grid[r_index])){
                cleared.push(r_index);
            }
        }

        if(cleared.length){
            const copy = [...this.state.grid];
            console.log("CLEARED", cleared);
            let cleared_index = 0;
            let downShift = 0;

            for(let r_index = height-1; r_index >= 0 ; r_index--){
                if(r_index === cleared[cleared_index]){
                    cleared_index++;
                    downShift++;
                    for(let c_index = 0; c_index < width; c_index++){
                        copy[r_index][c_index] = 0;
                    }
                }
                else if(downShift){
                    for(let c_index = 0; c_index < width; c_index++){
                        copy[r_index + downShift][c_index] = copy[r_index][c_index];
                        copy[r_index][c_index] = 0;
                    }
                }
            }

            this.setState({grid: copy});
        }
    }

    //
    //
    //
    isLineComplete = (row) => {
        // all 1's
        return row.every(cell => {
            return cell === 1;
        });
    }

    //
    //
    //
    rotateClockwise = () => {
        if(this.state.active && this.checkRotation()){
            // here there be dragons...
            const copy = [...this.state.grid];

            // I need to make sure that I don't rotate into walls or existing blocks
            // so this will require shifting the rotating block?

            // for now, just prevent the rotation in that case

            //... so what does this rotation actually mean?

            const [row, col] = this.scanGridForFirstActiveCell(copy);

            let change = false;

            switch(this.state.active){
                case square_piece:
                    // do nothing
                    return;
                case t_piece:
                    change = this.rotate_T(copy, row, col);
                    break;
                case row_piece:
                    change = this.rotate_Row(copy, row, col);
                    break;
                case l_right_piece:
                    change = this.rotate_right_L(copy, row, col);
                    break;
                case l_left_piece:
                    change = this.rotate_left_L(copy, row, col);
                    break;
                case s_right_piece:
                    change = this.rotate_right_S(copy, row, col);
                    break;
                case s_left_piece:
                    change = this.rotate_left_S(copy, row, col);
                    break;
                default:
                    // nothing
            }

            change && this.setState({grid: copy, rotation: (this.state.rotation+1)%4});
        }
    }

    //
    //
    //
    checkRotation = () => {
        if(this.state.timer){
            return true;
        }
        else{
            return false;
        }
    }

    //
    //
    //
    rotate_T = (grid, row, col) => {
        // find the center
        switch(this.state.rotation){
            case 0:
                if(this.checkCooridnatesForRotation(grid, [[row-1, col+1]])){
                    grid[row-1][col+1] = 2;
                    grid[row][col+2] = 0;
                    return true;
                }
                break;
            case 1:
                if(this.checkCooridnatesForRotation(grid, [[row+1, col+1]])){
                    grid[row+1][col+1] = 2;
                    grid[row+2][col] = 0;
                    return true;
                }
                break;
            case 2:
                if(this.checkCooridnatesForRotation(grid, [[row+2, col]])){
                    grid[row+2][col] = 2;
                    grid[row+1][col-1] = 0;
                    return true;
                }
                break;
            case 3:
                if(this.checkCooridnatesForRotation(grid, [[row+1, col-1]])){
                    grid[row+1][col-1] = 2;
                    grid[row][col] = 0;
                    return true;
                }
                break;
            default:
        }

        return false;
    }

    rotate_Row = (grid, row, col) => {
        // find the center
        switch(this.state.rotation){
            case 0:
            case 2:
                // we're going to lean right
                if(this.checkCooridnatesForRotation(grid, [[row-2, col+2], [row-1, col+2], [row+1, col+2]])){
                    grid[row-2][col+2] = 2;
                    grid[row-1][col+2] = 2;
                    grid[row+1][col+2] = 2;
                    grid[row][col] = 0;
                    grid[row][col+1] = 0;
                    grid[row][col+3] = 0;
                    return true;
                }
                break;
            case 1:
            case 3:
                if(this.checkCooridnatesForRotation(grid, [[row+2, col-2], [row+2, col-1], [row+2, col+1]])){
                    grid[row+2][col-2] = 2;
                    grid[row+2][col-1] = 2;
                    grid[row+2][col+1] = 2;
                    grid[row][col] = 0;
                    grid[row+1][col] = 0;
                    grid[row+3][col] = 0;
                    return true;
                }
                break;
            default:
        }

        return false;
    }

    rotate_right_L = (grid, row, col) => {
        // find the center
        switch(this.state.rotation){
            case 0:
                if(this.checkCooridnatesForRotation(grid, [[row-1, col+1], [row+1, col], [row+1, col+1]])){
                    grid[row-1][col+1] = 2;
                    grid[row+1][col] = 2;
                    grid[row+1][col+1] = 2;
                    grid[row][col] = 0;
                    grid[row][col+2] = 0;
                    grid[row+1][col+2] = 0;
                    return true;
                }
                break;
            case 1:
                if(this.checkCooridnatesForRotation(grid, [[row, col-1], [row+1, col-1], [row+1, col+1]])){
                    grid[row][col-1] = 2;
                    grid[row+1][col-1] = 2;
                    grid[row+1][col+1] = 2;
                    grid[row][col] = 0;
                    grid[row+2][col-1] = 0;
                    grid[row+2][col] = 0;
                    return true;
                }
                break;
            case 2:
                if(this.checkCooridnatesForRotation(grid, [[row, col+1], [row, col+2], [row+2, col+1]])){
                    grid[row][col+1] = 2;
                    grid[row][col+2] = 2;
                    grid[row+2][col+1] = 2;
                    grid[row][col] = 0;
                    grid[row+1][col] = 0;
                    grid[row+1][col+2] = 0;
                    return true;
                }
                break;
            case 3:
                if(this.checkCooridnatesForRotation(grid, [[row+1, col-1], [row+1, col+1], [row+2, col+1]])){
                    grid[row+1][col-1] = 2;
                    grid[row+1][col+1] = 2;
                    grid[row+2][col+1] = 2;
                    grid[row][col] = 0;
                    grid[row][col+1] = 0;
                    grid[row+2][col] = 0;
                    return true;
                }
                break;
            default:
        }

        return false;
    }

    rotate_left_L = (grid, row, col) => {
        // find the center
        switch(this.state.rotation){
            case 0:
                if(this.checkCooridnatesForRotation(grid, [[row-1, col], [row-1, col+1], [row+1, col+1]])){
                    grid[row-1][col] = 2;
                    grid[row-1][col+1] = 2;
                    grid[row+1][col+1] = 2;
                    grid[row][col] = 0;
                    grid[row+1][col] = 0;
                    grid[row][col+2] = 0;
                    return true;
                }
                break;
            case 1:
                if(this.checkCooridnatesForRotation(grid, [[row, col+2], [row+1, col], [row+1, col+2]])){
                    grid[row][col+2] = 2;
                    grid[row+1][col] = 2;
                    grid[row+1][col+2] = 2;
                    grid[row][col] = 0;
                    grid[row][col+1] = 0;
                    grid[row+2][col+1] = 0;
                    return true;
                }
                break;
            case 2:
                if(this.checkCooridnatesForRotation(grid, [[row, col-1], [row+2, col-1], [row+2, col]])){
                    grid[row][col-1] = 2;
                    grid[row+2][col-1] = 2;
                    grid[row+2][col] = 2;
                    grid[row][col] = 0;
                    grid[row+1][col-2] = 0;
                    grid[row+1][col] = 0;
                    return true;
                }
                break;
            case 3:
                if(this.checkCooridnatesForRotation(grid, [[row+1, col-1], [row+1, col+1], [row+2, col-1]])){
                    grid[row+1][col-1] = 2;
                    grid[row+1][col+1] = 2;
                    grid[row+2][col-1] = 2;
                    grid[row][col] = 0;
                    grid[row+2][col] = 0;
                    grid[row+2][col+1] = 0;
                    return true;
                }
                break;
            default:
        }

        return false;
    }

    rotate_right_S = (grid, row, col) => {
        // find the center
        switch(this.state.rotation){
            case 0:
            case 2:
                if(this.checkCooridnatesForRotation(grid, [[row+1, col], [row-1, col+1]])){
                    grid[row+1][col] = 2;
                    grid[row-1][col+1] = 2;
                    grid[row+1][col+1] = 0;
                    grid[row+1][col+2] = 0;
                    return true;
                }
                break;
            case 1:
            case 3:
                if(this.checkCooridnatesForRotation(grid, [[row+2, col], [row+2, col+1]])){
                    grid[row+2][col] = 2;
                    grid[row+2][col+1] = 2;
                    grid[row][col] = 0;
                    grid[row+2][col-1] = 0;
                    return true;
                }
                break;
            default:
        }

        return false;
    }

    rotate_left_S = (grid, row, col) => {
        // find the center
        switch(this.state.rotation){
            case 0:
            case 2:
                if(this.checkCooridnatesForRotation(grid, [[row-1, col-1], [row, col-1]])){
                    grid[row-1][col-1] = 2;
                    grid[row][col-1] = 2;
                    grid[row+1][col-1] = 0;
                    grid[row][col+1] = 0;
                    return true;
                }
                break;
            case 1:
            case 3:
                if(this.checkCooridnatesForRotation(grid, [[row+2, col], [row+1, col+2]])){
                    grid[row+2][col] = 2;
                    grid[row+1][col+2] = 2;
                    grid[row][col] = 0;
                    grid[row+1][col] = 0;
                    return true;
                }
                break;
            default:
        }

        return false;
    }

    scanGridForFirstActiveCell = (grid) => {
        for(let r_index = 0; r_index < height; r_index++){
            for(let c_index = 0; c_index < width; c_index++){
                if(grid[r_index][c_index] === 2){
                    return [r_index, c_index];
                }
            }
        }

        // we should never reach here
        return [null, null];
    }

    //
    // pass in an array of arrays
    //
    checkCooridnatesForRotation(grid, coords){
        let ret = true;
        coords.forEach(rowcol => {
            const row = rowcol[0];
            const col = rowcol[1];
            console.log(row, col);
            const outOfbounds = (row < 0 || col < 0 || row >= height || col >= width);
            if (outOfbounds || grid[row][col] === 1){
                ret = false;
            }
        });

        return ret;
    }

    //
    //
    //
    generateNewPiece = () => {
        const piece = this.state.nextPiece;
        const next = Math.ceil(Math.random()*7);

        const rows = this.getPieceCode(piece);

        this.insertNewPiece(rows, piece, next);
    }

    //
    //
    //
    insertNewPiece = (topRows, piece, next) => {
        const copy = [...this.state.grid];

        let collision = false;

        for(let r_index = 0; r_index <= 1; r_index++){
            for(let c_index = 0; c_index < width; c_index++){
                if(topRows[r_index][c_index] === 2){
                    if(copy[r_index][c_index] === 0){
                        copy[r_index][c_index] = 2;
                    }
                    else {
                        collision = true;
                    }
                }
            }
        }

        if(collision){
            clearInterval(this.state.timer);
            this.setState({gameOver: true, timer: null}, () => {
                if(this.props.sendUpdate && typeof this.props.sendUpdate === "function"){
                    console.log("MATCH LOST", this.state);
                    this.props.sendUpdate(this.state);
                }
            });
        }
        else{
            this.setState({grid: copy, active: piece, rotation: 0, nextPiece: next});
        }
    }

    getPieceCode = (piece) => {
        let topRows = [];

        switch(piece){
            case square_piece:
                topRows = [
                        [0,0,0,0,2,2,0,0,0,0], 
                        [0,0,0,0,2,2,0,0,0,0]
                    ];
                break;
            case t_piece:
                topRows = [
                    [0,0,0,2,2,2,0,0,0,0], 
                    [0,0,0,0,2,0,0,0,0,0]
                ];
                break;
            case row_piece:
                topRows = [
                    [0,0,0,2,2,2,2,0,0,0], 
                    [0,0,0,0,0,0,0,0,0,0]
                ];
                break;
            case l_right_piece:
                topRows = [
                    [0,0,0,0,2,2,2,0,0,0,], 
                    [0,0,0,0,0,0,2,0,0,0,]
                ];
                break;
            case l_left_piece:
                topRows = [
                    [0,0,0,2,2,2,0,0,0,0], 
                    [0,0,0,2,0,0,0,0,0,0]
                ];
                break;
            case s_right_piece:
                topRows = [
                    [0,0,0,0,2,2,0,0,0,0], 
                    [0,0,0,0,0,2,2,0,0,0]
                ];
                break;
            case s_left_piece:
                topRows = [
                    [0,0,0,0,2,2,0,0,0,0], 
                    [0,0,0,2,2,0,0,0,0,0]
                ];
                break;
            default:
                // nothing
        }

        return topRows;
    }

    getNextPieceCode = () => {
        return this.getPieceCode(this.state.nextPiece);
    }

    //
    //
    //
    insertNewLines = () => {
        // push this one off for later
    }

    //
    //
    //
    toggleGame = () => {
        if(this.state.timer){
            clearInterval(this.state.timer);
            this.setState({timer: null});
        }
        else{
            this.setState({timer: setInterval(this.nextStep, 500)});
        }
    }

    //
    //
    //
    componentDidMount(){
        // this is some brilliant hackery
        // https://stackoverflow.com/questions/39135912/react-onkeydown-onkeyup-events-on-non-input-elements
        document.body.addEventListener('keydown', this.handleKeyDown);
        const next = Math.ceil(Math.random()*7);
        
        // game_id: null,

        console.log("the props passed to the GameBoard", this.props);
        
        if(this.props.game_id){            
            this.setState({
                game_id: this.props.game_id,
                nextPiece: next
            });
        }
        else{
            this.setState({nextPiece: next});   
        }

        if(!this.props.solo && !this.props.is_remote){
            // just start it immediately
            this.toggleGame();
        }
    }

    //
    //
    //
    componentDidUpdate(prevProps, prevState){
        console.log(this.props.gamestate, prevProps.gamestate);
        if(this.props.gamestate && this.props.gamestate.game_id === this.state.game_id){
            console.log("we have a gamestate", !prevProps.gamestate);
            if(!prevProps.gamestate
                || 
                this.props.gamestate.move_number != prevProps.gamestate.move_number
            ){
                console.log("set the gamestate for the board");

                this.setState({
                    move_number: this.props.gamestate.move_number,
                    grid: this.props.gamestate.grid,
                    gameOver: this.props.gamestate.gameOver
                });
            }
        }
    }
    
    //
    //
    //
    componentWillUnmount(){
        document.body.removeEventListener('keydown', this.handleKeyDown);

        // clear the timer on unmount
        if(this.state.timer){
            clearInterval(this.state.timer);
            this.setState({timer: null});
        }
    }

    //
    //
    //
    returnToLobby = () => {
        enterLobby(this.context.token);
        // be sure to kill the timer
        if(this.state.timer){
            clearInterval(this.state.timer);
            this.setState({timer: null});
        }
        this.props.history.push("/");
    }

    //
    //
    //
    render(){
        return (
            <div>
                {
                    this.state.gameOver && <h2 className="game-over">Game Over!</h2>
                }
                <div className="split">
                    <div className="main-game">
                        <table className="game-board">
                            <tbody>
                            {
                                this.state.grid.map((row, row_index) => {
                                    return (<tr key={`r_${row_index}`}>
                                        {
                                            row.map((cell, cell_index) => {
                                                const cell_value = row[cell_index];
                                                let classesForCell = "";
                                                if(cell_value === 0){
                                                    classesForCell = "empty";
                                                }
                                                else if(cell_value === 1){
                                                    classesForCell = "filled";
                                                }
                                                else if(cell_value === 2){
                                                    classesForCell = "active";
                                                }
                                                return <td className={`game-cell ${classesForCell}`} key={`c_${cell_index}`}></td>
                                            })
                                        }
                                    </tr>)
                                })
                            }
                            </tbody>
                        </table>
                        <br />
                        {
                            this.props.solo
                            ? <> 
                            <button onClick={this.toggleGame}>
                                {
                                    this.state.timer 
                                    ? "Pause Game"
                                    : "Start Game"
                                }
                            </button>
                            <button onClick={this.returnToLobby}>Return To Lobby</button>
                            </>
                            : ""
                        }                        
                    </div>
                    {
                        !this.props.is_remote
                        ? <div className="next-piece">
                            <table className="game-board">
                                <tbody>
                                    {
                                        this.getNextPieceCode().map((row, row_index) => {
                                            return (<tr key={`r_${row_index}`}>
                                                {
                                                    row.map((cell, cell_index) => {
                                                        const cell_value = row[cell_index];
                                                        let classesForCell = "";
                                                        if(cell_value === 0){
                                                            classesForCell = "empty";
                                                        }
                                                        else if(cell_value === 2){
                                                            classesForCell = "active";
                                                        }
                                                        return <td className={`game-cell ${classesForCell}`} key={`c_${cell_index}`}></td>
                                                    })
                                                }
                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        : ""
                    }
                </div>                
            </div>
        )
    }
}

export default withRouter(GameBoard);