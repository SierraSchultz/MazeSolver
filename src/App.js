import React, { Component } from 'react';


import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to The Maze</h2>
        </div>
          <div>
              <SubmitForm />
          </div>
          <myMaze />
      </div>
    );
  }
}
class MazeBite extends Component{

    constructor(){
        super();
        this.MazeBite={
            type: this.type,
            visited: this.visited,
            color: this.color,
            row: this.row,
            col1: this.col1,
            prevRow: this.prevRow,
            prevCol: this.prevCol,
            length: this.length
        };
    }
}
class myMaze extends Component{
    constructor(){
        super();
        this.state = {
            mazeArray: this.wholeMaze,
            lastBite: this.finalMazeBite
        }
    }
    buildMaze = () => {
        let canvas = document.getElementById('canvas');
        let x = 0;
        let y = 0;
        let ctx = canvas.getContext('2d');
        for(let i = 0; i<this.mazeArray[0].length; i++){
            for( let j = 0; j<this.mazeArray.length; j++){

                if(this.mazeArray[j][i].color === "white"){
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect((i+1)*10,(1+j)*10,10,10);
                }
                if(this.mazeArray[j][i].color === "black"){
                    ctx.fillStyle = "#650302";
                    ctx.fillRect((i+1)*10,(1+j)*10,10,10);
                }
                if(this.mazeArray[j][i].color === "orange"){
                    ctx.fillStyle = "#000000";
                    ctx.fillRect((i+1)*10,(1+j)*10,10,10);
                }
                if(this.mazeArray[j][i].color === "grey"){
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect((i+1)*10,(1+j)*10,10,10);
                }
                if(this.mazeArray[j][i].color === "red"){
                    ctx.fillStyle = "#613065";
                    ctx.fillRect((i+1)*10,(j+1)*10,10,10);
                }
                if(this.mazeArray[j][i].color === "green"){
                    ctx.fillStyle = "#456545";
                    ctx.fillRect((1+i)*10,(1+j)*10,10,10);
                }
                y= j;
            }
            x = i;
        }
        ctx.font = "50px Arial";
        ctx.fillText("Path Length: " + this.lastBite.length, x*3.5, y*12);
    };
}
class SubmitForm extends Component{

    constructor(){
        super();
        this.state = {
            value: null,
            isSubmitted: false
        };
    }
    textChanged = (event) => {
        this.setState({value: event.target.value})
    }
    handleSubmit = () => {
        let lengths = this.getLengths(this.state.value);
        let maze = this.makeMazeArray(lengths.colLength, lengths.rowLength, lengths.charArray);
        let lastBite = this.mazeSolver(lengths.colLength, lengths.rowLength,  maze.maze, maze.startBite, maze.endBite);
        let finalRealMaze = new myMaze();
        finalRealMaze.lastBite = lastBite.currentBite;
        finalRealMaze.mazeArray = lastBite.maze;
        finalRealMaze.buildMaze();
    }
    render(){
        return(
            <div>
                <div>
                    <textarea onChange={this.textChanged}>
                        {this.state.value}
                    </textarea>
                </div>
                <div>
                    <button onClick={this.handleSubmit}>
                        Submit
                    </button>
                </div>
                <div>
                    <canvas id="canvas" height={1000} width={2000}>
                    {this.buildMaze}
                    </canvas>
                </div>
            </div>
        )
    }
    getLengths(text){
    let charArray = text.toString().split("");
    let rowLength = 0;
    while(charArray[rowLength] !== '\n'){
        rowLength++;
    }
    let colLength = text.length / rowLength;
    return{
        colLength: colLength,
        rowLength: rowLength,
        charArray: charArray
    };
};
    makeMazeArray(colLength, rowLength, charArray){
    let x = 0;
    let startBite = new MazeBite(-1,false,'white', -1, -1, null,null, -1);
        let maze = [colLength];

        for(let i = 0; i<colLength; i++){
            maze[i]=[rowLength]
        }
        let endBite = new MazeBite(-1, false, "white", -1, -1, null,null, -1);
    for (let i = 0; i < colLength; i++){
        for (let j=0; j < rowLength + 1; j++){
            let temp = new MazeBite(-1, false, "white", -1, -1, null,null, -1);
            temp.col1 = i;
            temp.row = j;

            if (charArray[x] === '\n'){
                x++;
            }else{
                if(charArray[x] === '.'){
                    temp.color = "white";
                    temp.type = 0;
                }
                else if(charArray[x] === '#'){
                    temp.color = "orange";
                    temp.type = 1;
                }
                else if(charArray[x] === 'A'){
                    temp.color = "red";
                    temp.type = 2;
                    temp.length = 0;
                    startBite = temp;
                }
                else if(charArray[x] === 'B'){
                    temp.type = 3;
                    temp.color = "green";
                    endBite.col1 = i;
                    endBite.row = j;
                    endBite.type = 3;
                    endBite.color = "green";
                }
                x++;
                maze[i][j] = temp;
            }
        }
    }
    return {
        maze: maze,
        startBite: startBite,
        endBite: endBite
    };
};
    mazeSolver(colLength, rowLength, maze, startBite, endBite) {
    let bag = [];
    bag.push(startBite);
    let currentBite = startBite;
    while (  !(currentBite.type === 3)) {
        currentBite.color = "grey";
        if (currentBite.col1 === colLength - 1 || currentBite.row === rowLength - 1) {
            if (currentBite.type === 2) {
                if (currentBite.row === rowLength - 1) {
                    if ((maze[currentBite.col1][currentBite.row - 1].type === 0 || maze[currentBite.col1][currentBite.row - 1].type === 3 ) && (maze[currentBite.col1][currentBite.row - 1].color === "white" || maze[currentBite.col1][currentBite.row - 1].color === "green")) {
                        bag.push(maze[currentBite.col1][currentBite.row - 1]);
                        maze[currentBite.col1][currentBite.row - 1].color = 'grey';
                        maze[currentBite.col1][currentBite.row - 1].length = currentBite.length + 1;
                        maze[currentBite.col1][currentBite.row - 1].prevRow = currentBite.row;
                        maze[currentBite.col1][currentBite.row - 1].prevCol = currentBite.col1;
                    }
                    if ((maze[currentBite.col1][currentBite.row + 1].type === 0 || maze[currentBite.col1][currentBite.row + 1].type === 3 ) && (maze[currentBite.col1][currentBite.row + 1].color === "white" || maze[currentBite.col1][currentBite.row + 1].color === "green")) {
                        bag.push(maze[currentBite.col1][currentBite.row + 1]);
                        maze[currentBite.col1][currentBite.row + 1].color = 'grey';
                        maze[currentBite.col1][currentBite.row + 1].length = currentBite.length + 1;
                        maze[currentBite.col1][currentBite.row + 1].prevRow = currentBite.row;
                        maze[currentBite.col1][currentBite.row + 1].prevCol = currentBite.col1;
                    }
                    if ((maze[currentBite.col1 - 1][currentBite.row].type === 0 || maze[currentBite.col1-1][currentBite.row].type === 3 ) && (maze[currentBite.col1 -1][currentBite.row].color === "white" || maze[currentBite.col1 -1][currentBite.row].color === "green")) {
                        bag.push(maze[currentBite.col1 - 1][currentBite.row]);
                        maze[currentBite.col1 - 1][currentBite.row].color = 'grey';
                        maze[currentBite.col1 - 1][currentBite.row].length = currentBite.length + 1;
                        maze[currentBite.col1 - 1][currentBite.row].prevRow = currentBite.row;
                        maze[currentBite.col1 - 1][currentBite.row].prevCol = currentBite.col;
                    }
                }
                if (currentBite.col1 === colLength - 1) {
                    if ((maze[currentBite.col1][currentBite.row - 1].type === 0 || maze[currentBite.col1][currentBite.row - 1].type === 3 ) && (maze[currentBite.col1][currentBite.row - 1].color === "white" || maze[currentBite.col1][currentBite.row - 1].color === "green")) {
                        bag.push(maze[currentBite.col1][currentBite.row - 1]);
                        maze[currentBite.col1][currentBite.row - 1].color = 'grey';
                        maze[currentBite.col1][currentBite.row - 1].length = currentBite.length + 1;
                        maze[currentBite.col1][currentBite.row - 1].prevRow = currentBite.row;
                        maze[currentBite.col1][currentBite.row - 1].prevCol = currentBite.col1;
                    }
                    if ((maze[currentBite.col1 - 1][currentBite.row].type === 0 || maze[currentBite.col1 -1 ][currentBite.row].type === 3 ) && (maze[currentBite.col1 -1 ][currentBite.row ].color === "white" || maze[currentBite.col1 -1 ][currentBite.row ].color === "green")) {
                        bag.push(maze[currentBite.col1 - 1][currentBite.row]);
                        maze[currentBite.col1 - 1][currentBite.row].color = 'grey';
                        maze[currentBite.col1 - 1][currentBite.row].length = currentBite.length + 1;
                        maze[currentBite.col1 - 1][currentBite.row].prevRow = currentBite.row;
                        maze[currentBite.col1 - 1][currentBite.row].prevCol = currentBite.col1;
                    }
                    if ((maze[currentBite.col1 + 1][currentBite.row].type === 0 || maze[currentBite.col1 + 1][currentBite.row].type === 3 ) && (maze[currentBite.col1 + 1][currentBite.row].color === "white" || maze[currentBite.col1 + 1][currentBite.row].color === "green")) {
                        bag.push(maze[currentBite.col1 + 1][currentBite.row]);
                        maze[currentBite.col1 + 1][currentBite.row].color = 'grey';
                        maze[currentBite.col1 + 1][currentBite.row].length = currentBite.length + 1;
                        maze[currentBite.col1 + 1][currentBite.row].prevRow = currentBite.row;
                        maze[currentBite.col1 + 1][currentBite.row].prevCol = currentBite.col1;
                    }
                }
            }
        } else {
            if ((maze[currentBite.col1][currentBite.row - 1].type === 0 || maze[currentBite.col1][currentBite.row - 1].type === 3 ) && (maze[currentBite.col1][currentBite.row - 1].color === "white" || maze[currentBite.col1][currentBite.row - 1].color === "green")) {
                bag.push(maze[currentBite.col1][currentBite.row - 1]);
                maze[currentBite.col1][currentBite.row - 1].color = 'grey';
                maze[currentBite.col1][currentBite.row - 1].length = currentBite.length + 1;
                maze[currentBite.col1][currentBite.row - 1].prevRow = currentBite.row;
                maze[currentBite.col1][currentBite.row - 1].prevCol = currentBite.col1;
            }
            if ((maze[currentBite.col1][currentBite.row + 1].type === 0 || maze[currentBite.col1][currentBite.row + 1].type === 3 ) && (maze[currentBite.col1][currentBite.row + 1].color === "white" || maze[currentBite.col1][currentBite.row + 1].color === "green")) {

                bag.push(maze[currentBite.col1][currentBite.row + 1]);
                maze[currentBite.col1][currentBite.row + 1].color = 'grey';
                maze[currentBite.col1][currentBite.row + 1].length = currentBite.length + 1;
                maze[currentBite.col1][currentBite.row + 1].prevRow = currentBite.row;
                maze[currentBite.col1][currentBite.row + 1].prevCol = currentBite.col1;
            }
            if ((maze[currentBite.col1 - 1][currentBite.row].type === 0 || maze[currentBite.col1 - 1][currentBite.row].type === 3 ) && (maze[currentBite.col1 -1][currentBite.row].color === "white" || maze[currentBite.col1 -1][currentBite.row].color === "green")) {
                bag.push(maze[currentBite.col1 - 1][currentBite.row]);
                maze[currentBite.col1 - 1][currentBite.row].color = 'grey';
                maze[currentBite.col1 - 1][currentBite.row].length = currentBite.length + 1;
                maze[currentBite.col1 - 1][currentBite.row].prevRow = currentBite.row;
                maze[currentBite.col1 - 1][currentBite.row].prevCol = currentBite.col1;
            }
            if ((maze[currentBite.col1 + 1][currentBite.row].type === 0 || maze[currentBite.col1 + 1][currentBite.row].type === 3 ) && (maze[currentBite.col1 + 1][currentBite.row].color === "white" || maze[currentBite.col1 + 1][currentBite.row].color === "green")) {
                bag.push(maze[currentBite.col1 + 1][currentBite.row]);
                maze[currentBite.col1 + 1][currentBite.row].color = 'grey';
                maze[currentBite.col1 + 1][currentBite.row].length = currentBite.length + 1;
                maze[currentBite.col1 + 1][currentBite.row].prevRow = currentBite.row;
                maze[currentBite.col1 + 1][currentBite.row].prevCol = currentBite.col1;
            }
        }
        currentBite = bag.shift();
    }
    startBite.color = "red";
    let mouse = maze[endBite.col1][endBite.row];
    mouse = maze[mouse.prevCol][mouse.prevRow];
    let shortestPath=2;
    while(!(mouse.prevRow === startBite.row && mouse.prevCol === startBite.col1)){
        shortestPath++;
        mouse.visited = true;
        mouse.color = "black";
        mouse = maze[mouse.prevCol][mouse.prevRow];
    }
    mouse.color = "black";
    maze[endBite.col1][endBite.row].color = "green";
    maze[endBite.col1][endBite.row].length=shortestPath;
    return {
        currentBite: currentBite,
        maze: maze
    };
    };
}
export default App;