import React, { Component } from 'react';
import './MazeBite';
import logo from './logo.svg';
import './App.css';
import'./Lengths';
import './myMaze.js';
//import {MazeBite} from './MazeBite.js';
// require('node_modules');
// let MazeBite = require("./MazeBite.js");
// require("./MazeBite");
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Welcome to The Maze</h1>
        </div>
          <div>

              <SubmitForm>
                  <script type="text/javascript" src="myMaze.js" />
              </SubmitForm>
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
            row: this.row,
            col1: this.col1,
            prevRow: this.prevRow,
            prevCol: this.prevCol,
            length: this.length,
            prev: this.prev
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
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        for(let i = 0; i<this.mazeArray[0].length; i++){
            for( let j = 0; j<this.mazeArray.length; j++){
                if(this.mazeArray[j][i].type === 0 || this.mazeArray[j][i].type === 4){
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect((i+1)*10,(1+j)*10,10,10);
                }
                if(this.mazeArray[j][i].type === 5){
                    ctx.fillStyle = "#650302";
                    ctx.fillRect((i+1)*10,(1+j)*10,10,10);
                }
                if(this.mazeArray[j][i].type === 1){
                    ctx.fillStyle = "#000000";
                    ctx.fillRect((i+1)*10,(1+j)*10,10,10);
                }
                if(this.mazeArray[j][i].type === 2){
                    ctx.fillStyle = "#613065";
                    ctx.fillRect((i+1)*10,(j+1)*10,10,10);
                }
                if(this.mazeArray[j][i].type === 3){
                    ctx.fillStyle = "#456545";
                    ctx.fillRect((1+i)*10,(1+j)*10,10,10);
                }
                y= j;
            }
            x = i;
        }
        ctx.font = "24px Arial";
        ctx.fillText("Path Length: " + this.shortestPath, x*3.5, y*12);
    };
}
class SubmitForm extends Component {
    constructor() {
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
        let lastBite = this.mazeSolver(maze.maze, maze.startBite, maze.endBite);
        let finalRealMaze = new myMaze();
        finalRealMaze.shortestPath = lastBite.shortestPath;
        finalRealMaze.mazeArray = lastBite.maze;
        finalRealMaze.buildMaze();
    }
    render() {
        return (
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
                    <canvas id="canvas">
                        {this.buildMaze}
                    </canvas>
                </div>
            </div>
        )
    }
    getLengths(text) {
        let charArray = text.toString().split("");
        let rowLength = 0;
        while (charArray[rowLength] !== '\n') {
            rowLength++;
        }
        let colLength = text.length / rowLength;
        return {
            colLength: colLength,
            rowLength: rowLength,
            charArray: charArray
        };
    }
    makeMazeArray(colLength, rowLength, charArray) {
        let x = 0;
        let startBite = new MazeBite(-1, false, -1, -1, null, null, -1);
        let maze = [colLength];
        let endBite = new MazeBite(-1, false, -1, -1, null, null, -1);
        for (let i = 0; i < colLength; i++) {
            maze[i] = [rowLength]
        }
        for (let i = 0; i < colLength; i++) {
            for (let j = 0; j < rowLength + 1; j++) {
                let temp = new MazeBite(-1, false, -1, -1, null, null, -1);
                temp.col1 = i;
                temp.row = j;
                switch(charArray[x]){
                    case '\n':
                        break;
                    case '.':
                        temp.type = 0;
                        break;
                    case '#':
                        temp.type = 1;
                        break;
                    case 'A':
                        temp.type = 2;
                        temp.length = 0;
                        startBite = temp;
                        break;
                    case 'B':
                        temp.type = 3;
                        endBite.col1 = i;
                        endBite.row = j;
                        endBite.type = 3;
                        break;
                    default:
                }
                x++;
                maze[i][j] = temp;
                }
            }
        return {
            maze: maze,
            startBite: startBite,
            endBite: endBite
        };
    }
    MazeSolverHelper(col, row, maze, bag, currentBite) {
        if((maze[col][row].type === 0 || maze[col][row].type === 3) && !maze[col][row].visited)
         {
            bag.push(maze[col][row]);
            maze[col][row].type = 4;
            maze[col][row].prevRow = currentBite.row;
            maze[col][row].prevCol = currentBite.col1;
        }
        return {
            maze:maze,
            bag: bag
        };
    }
    mazeSolver(maze, startBite, endBite) {
        let bag = [];
        bag.push(startBite);
        let currentBite = startBite;
        while (!(currentBite.type === 3)) {
            currentBite.visited = true;
                maze = this.MazeSolverHelper(currentBite.col1 - 1, currentBite.row, maze, bag, currentBite).maze;
                bag = this.MazeSolverHelper(currentBite.col1 - 1, currentBite.row, maze, bag, currentBite).bag;
                maze = this.MazeSolverHelper(currentBite.col1 + 1, currentBite.row, maze, bag, currentBite).maze;
                bag = this.MazeSolverHelper(currentBite.col1 + 1, currentBite.row, maze, bag, currentBite).bag;
                maze = this.MazeSolverHelper(currentBite.col1, currentBite.row - 1, maze, bag, currentBite).maze;
                bag = this.MazeSolverHelper(currentBite.col1, currentBite.row - 1, maze, bag, currentBite).bag;
                maze = this.MazeSolverHelper(currentBite.col1, currentBite.row + 1, maze, bag, currentBite).maze;
                bag = this.MazeSolverHelper(currentBite.col1, currentBite.row + 1, maze, bag, currentBite).bag;
            if (bag.length === 0) {
                break;
            }
            currentBite = bag.shift();
        }
        startBite.type = 2;
        let mouse = maze[endBite.col1][endBite.row];
        mouse = maze[mouse.prevCol][mouse.prevRow];
        let shortestPath = 2;
        while (!(mouse.prevRow === startBite.row && mouse.prevCol === startBite.col1)) {
            shortestPath++;
            mouse.visited = true;
            mouse.type = 5;
            mouse = maze[mouse.prevCol][mouse.prevRow];
        }
        mouse.type=5;
        maze[endBite.col1][endBite.row].type = 3;
        return {
            shortestPath: shortestPath,
            maze: maze
        };
    };
}
export default App;