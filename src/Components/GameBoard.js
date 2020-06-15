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

let timeout = 500;
let timer = null;
const rate = 0.99;

const completed_delay = 500;

let penaltyRows = 0;

let penaltyUpdated = false;

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
        // timer: null,
        nextPiece: null,
        move_number: 0,
        buttonText: "Start",
        cleared:null,
        penaltyRows: 0,
        updated: false
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
        // if(!this.state.timer){
        //     return;
        // }

        if(!timer){
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
            this.setGridAllInactive();
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
        // if(!this.state.timer){
        //     return false;
        // }

        if(!timer){
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
        // if(!this.state.timer){
        //     return false;
        // }

        if(!timer){
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
        if(this.state.active || this.state.cleared){
            // for now, for the sake of testing
            if(this.state.cleared){

                const clearedCount = this.state.cleared.length;

                const copy = [...this.state.grid];
                console.log("CLEARED", this.state.cleared);
                let cleared_index = 0;
                let downShift = 0;
    
                for(let r_index = height-1; r_index >= 0 ; r_index--){
                    if(r_index === this.state.cleared[cleared_index]){
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

                this.setState({grid: copy, active: null, cleared: null, move_number: this.state.move_number+1}, () => {
                    if(this.props.sendUpdate && typeof this.props.sendUpdate === "function"){
                        console.log("SEND UPDATE", this.state);
                        this.props.sendUpdate(this.state);
                    }
                });
            }
            else{                
                // commented out for now to test the penalty rows
                this.moveDown();
            }
        }
        else{
            if(this.state.penaltyRows > 0){
                console.log("we have penalty rows", this.state.penaltyRows);

                // check for whether the game is over, update the grid
                let gameOver = false;

                const copy = [...this.state.grid];

                outer:
                for(let i = 0; i < this.state.penaltyRows; i++){
                    copy.shift();
                    copy.push(this.createPenaltyRow());

                    for(let j = 0; j < width; j++){
                        if(this.state.grid[i][j]){
                            gameOver = true;
                            break outer;
                        }
                    }
                }

                if(gameOver){
                    // clearInterval(this.state.timer);
                    clearTimeout(timer);
                    timer = null;
                    // this.setState({gameOver: true, timer: null}, () => {
                    this.setState({gameOver: true}, () => {
                        if(this.props.sendUpdate && typeof this.props.sendUpdate === "function"){
                            console.log("MATCH LOST", this.state);
                            this.props.sendUpdate(this.state);
                        }
                    });
                }
                else{
                    console.log("PENALTY ROWS APPLIES, GAME NOT OVER");
                    this.setState({penaltyRows: 0, grid: copy, move_number: this.state.move_number + 1}, () => {
                        if(this.props.sendUpdate && typeof this.props.sendUpdate === "function"){
                            console.log("PENALTY ROWS APPLIED", this.state);
                            this.props.sendUpdate(this.state);
                        }
                    });
                }
            }

            timeout *= rate;
            console.log("TIMEOUT", timeout);
            this.generateNewPiece();
        }

        timer = setTimeout(this.nextStep, timeout);
    }

    createPenaltyRow = () => {
        const hole = Math.floor(Math.random() * width);
        const row = [];

        for(let i = 0; i < width; i++){
            if(i === hole){
                row.push(0);
            }
            else{
                row.push(1);
            }
        }

        return row;
    }

    //
    //
    //
    setGridAllInactive = () => {

        const copy = [...this.state.grid];
        copy.forEach((row, row_index) => {
            row.forEach((cell, cell_index) => {
                if(copy[row_index][cell_index] === 2){
                    copy[row_index][cell_index] = 1;
                }
            });
        });

        this.clearCompletedLines(copy);        
    }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

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

            // // clear the timer
            // clearTimeout(timer);
            // timer = null;

            const clearingCopy = [...this.state.grid];

            // replace the cleared lines
            cleared.forEach(r_index => {
                clearingCopy[r_index].forEach((cell, c_index) => {
                    clearingCopy[r_index][c_index] = 3;
                });
            });
            
            console.log("CLEARED CLEARED CLEARED", cleared);

            // set state
            this.setState({grid: clearingCopy, cleared, active: null, move_number: this.state.move_number+1}, () => {
                if(this.props.sendUpdate && typeof this.props.sendUpdate === "function"){
                    console.log("SEND UPDATE", this.state);
                    this.props.sendUpdate(this.state);
                }
            });
        }
        else{
            this.setState({grid, active: null, move_number: this.state.move_number+1}, () => {
                if(this.props.sendUpdate && typeof this.props.sendUpdate === "function"){
                    console.log("SEND UPDATE", this.state);
                    this.props.sendUpdate(this.state);
                }
            });
        }
    }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

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
        // if(this.state.timer){
        //     return true;
        // }
        // else{
        //     return false;
        // }

        if(timer){
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
            // clearInterval(this.state.timer);
            clearTimeout(timer);
            timer = null;
            // this.setState({gameOver: true, timer: null}, () => {
            this.setState({gameOver: true}, () => {
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
        // if(this.state.timer){
        //     clearInterval(this.state.timer);
        //     this.setState({timer: null});
        // }
        // else{
        //     this.setState({timer: setInterval(this.nextStep, 500)});
        // }

        if(timer){
            clearTimeout(timer);
            timer = null;
            this.setState({buttonText:"Start"});
        }
        else{
            timer = setTimeout(this.nextStep, timeout);
            this.setState({buttonText:"Pause"});
        }
    }

    //
    //
    //
    componentDidMount(){

        timeout = 500;
        penaltyRows = 0;
        penaltyUpdated = false;

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
        // console.log(this.props.gamestate, prevProps.gamestate);

        console.log("update?", this.props);

        if(this.props.gamestate && this.props.gamestate.game_id === this.state.game_id){
            console.log("we have a gamestate", !prevProps.gamestate, this.props);
            if(!prevProps.gamestate
                || 
                this.props.gamestate.move_number != prevProps.gamestate.move_number
            ){
                console.log("set the gamestate for the board");

                this.setState({
                    updated: true,
                    move_number: this.props.gamestate.move_number,
                    grid: this.props.gamestate.grid,
                    gameOver: this.props.gamestate.gameOver,
                });
            }
        }
        else if(!penaltyUpdated && this.props.penaltyRows > 0){
            console.log("penalty rows", this.props.penaltyRows);
            console.log("new penalty rows", this.props.penaltyRows + this.state.penaltyRows);
            this.setState({
                penaltyRows: Math.max(this.props.penaltyRows, this.state.penaltyRows)
            });
            penaltyUpdated = true;
        }
        else{
            penaltyUpdated = false;
        }
    }
    
    //
    //
    //
    componentWillUnmount(){
        document.body.removeEventListener('keydown', this.handleKeyDown);

        // clear the timer on unmount
        // if(this.state.timer){
        //     clearInterval(this.state.timer);
        //     this.setState({timer: null});
        // }

        if(timer){
            clearTimeout(timer);
            timer = null;
        }
    }

    //
    //
    //
    returnToLobby = () => {
        enterLobby(this.context.token);
        // be sure to kill the timer
        // if(this.state.timer){
        //     clearInterval(this.state.timer);
        //     this.setState({timer: null});
        // }

        if(timer){
            clearTimeout(timer);
            timer = null;
        }

        this.props.history.push("/");
    }

    //
    //
    //
    render(){
        return (
            <div>                
                <div className="split">                    
                    <div className="main-game">
                        {
                            this.props.is_remote
                            && !this.state.updated
                            ? <div className="flashing">Waiting for stream display...</div>
                            : ""
                        }
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
                                                else if(cell_value === 3){
                                                    classesForCell = "clearing";
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
                            {
                                !this.state.gameOver
                                ? <button onClick={this.toggleGame}>
                                    {
                                        `${this.state.buttonText} Game`
                                    }
                                </button>
                                : ""
                            }                            
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
                                                        if(cell_index < 2 || cell_index > (width-3)){
                                                            return;
                                                        }

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
                            {
                                this.state.penaltyRows > 0
                                ? (
                                    <table className="game-board">
                                    <tbody>
                                        {
                                            [...Array(this.state.penaltyRows)].map((rval, row_index) => {
                                                console.log("penalty row");
                                                return (<tr key={`r_${row_index}`}>
                                                {
                                                    [...Array(width-4)].map((cval, cell_index) => {
                                                        return <td className={`game-cell penalty`} key={`c_${cell_index}`}></td>
                                                    })
                                                }
                                            </tr>)
                                            })
                                        }
                                    </tbody>
                                    </table>
                                )
                                : ""
                            }
                            {
                                this.state.gameOver && <h2 className="game-over">Game Over!</h2>
                            }
                            {
                                this.props.solo
                                ? <div className="controls">
                                    <p>
                                        USE THE ARROW KEYS
                                    </p>
                                    <p>
                                    <i class="fas fa-arrow-up"></i> rotate current piece
                                    </p>
                                    <p>
                                    <i class="fas fa-arrow-left"></i>/<i class="fas fa-arrow-down"></i>/<i class="fas fa-arrow-right"></i> move current piece
                                    </p>
                                </div>
                                : ""
                            }
                        </div>
                        : ""
                    }
                </div>                
            </div>
        )
    }
}

export default withRouter(GameBoard);