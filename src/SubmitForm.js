/**
 * Created by sschultz on 6/19/2017.
 */
import React, {Component} from 'react'
import MyMaze from './MyMaze'
import MazeBite from './MazeBite'
import MakeMazeArray from './MakeMazeArray'
//import TextareaAutosize from 'react-textarea-autosize'
import TextArea from 'react-text-input'
export default class SubmitForm extends Component {
    
    constructor() {
        super();
        this.state = {
            value: null,
            isSubmitted: false
        }
    }
    textChanged = (event) => {
        this.setState({value: event.target.value})
    }
    handleSubmit = () => {
        let lengths = this.getLengths(this.state.value)
        let maze = this.MakeMazeArray(lengths.colLength, lengths.rowLength, lengths.charArray)
        let lastBite = this.mazeSolver(maze.maze, maze.startBite, maze.endBite, lengths.rowLength, lengths.colLength)
        let finalRealMaze = new MyMaze()
        finalRealMaze.shortestPath = lastBite.shortestPath
        finalRealMaze.mazeArray = lastBite.maze
        finalRealMaze.buildMaze()
    }
    render() {
        return (
            <div>
                <div>
                    <textarea onChange={this.textChanged} cols={this.getLengths(this.state.value).rowLength+10}
                              rows={this.getLengths(this.state.value).colLength} >
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

        let charArray
        let rowLength = 1;
        let colLength
        if(text === null){
            colLength = 1
            rowLength =1
        }
        else {
            charArray = text.toString().split("")
            while (charArray[rowLength] !== '\n') {
                rowLength++;
            }
            colLength = Math.ceil(text.length / rowLength) - 1
        }
        return {
            colLength: colLength,
            rowLength: rowLength,
            charArray: charArray
        };
    }

    MakeMazeArray(colLength, rowLength, charArray) {
        let x = 0
        let startBite = new MazeBite(-1, false, -1, -1, null, null, -1)
        let maze = [colLength]
        let endBite = new MazeBite(-1, false, -1, -1, null, null, -1)
        for (let i = 0; i < colLength; i++) {
            maze[i] = [rowLength]
        }
        for (let i = 0; i < colLength; i++) {
            for (let j = 0; j < rowLength + 1; j++) {
                let temp = new MazeBite(-1, false, -1, -1, null, null, -1)
                temp.col1 = i
                temp.row = j
                switch(charArray[x]){
                    case '\n':
                        break
                    case '.':
                        temp.type = 0;
                        break
                    case '#':
                        temp.type = 1
                        break
                    case 'A':
                        temp.type = 2
                        temp.length = 0
                        startBite = temp
                        break
                    case 'B':
                        temp.type = 3
                        endBite.col1 = i
                        endBite.row = j
                        endBite.type = 3
                        break
                    default:
                }
                x++
                maze[i][j] = temp
            }
        }
        return {
            maze: maze,
            startBite: startBite,
            endBite: endBite
        }
    }
    MazeSolverHelper(col, row, maze, bag, currentBite, rowLength, colLength) {
        if ( col >= colLength || row >= rowLength) {
        }
        else{
            if ((maze[col][row].type === 0 || maze[col][row].type === 3) && !maze[col][row].visited) {
                bag.push(maze[col][row])
                if(maze[col][row].type === 0)
                    maze[col][row].type = 4
                maze[col][row].prevRow = currentBite.row
                maze[col][row].prevCol = currentBite.col1
            }
        }
        return {
            maze:maze,
            bag: bag
        };
    }
    mazeSolver(maze, startBite, endBite, rowLength, colLength) {
        let bag = []
        bag.push(startBite)
        let currentBite = startBite
        while (!(currentBite.type === 3)) {
            currentBite.visited = true;
            maze = this.MazeSolverHelper(currentBite.col1 - 1, currentBite.row, maze, bag, currentBite, rowLength, colLength).maze
            bag = this.MazeSolverHelper(currentBite.col1 - 1, currentBite.row, maze, bag, currentBite, rowLength, colLength).bag
            maze = this.MazeSolverHelper(currentBite.col1 + 1, currentBite.row, maze, bag, currentBite, rowLength, colLength).maze
            bag = this.MazeSolverHelper(currentBite.col1 + 1, currentBite.row, maze, bag, currentBite, rowLength, colLength).bag
            maze = this.MazeSolverHelper(currentBite.col1, currentBite.row - 1, maze, bag, currentBite, rowLength, colLength).maze
            bag = this.MazeSolverHelper(currentBite.col1, currentBite.row - 1, maze, bag, currentBite, rowLength, colLength).bag
            maze = this.MazeSolverHelper(currentBite.col1, currentBite.row + 1, maze, bag, currentBite, rowLength, colLength).maze
            bag = this.MazeSolverHelper(currentBite.col1, currentBite.row + 1, maze, bag, currentBite, rowLength, colLength).bag
            if (bag.length === 0) {
                break
            }
            currentBite = bag.shift()
        }
        let mouse = maze[endBite.col1][endBite.row]
        mouse = maze[mouse.prevCol][mouse.prevRow]
        let shortestPath = 2
        while (!(mouse.prevRow === startBite.row && mouse.prevCol === startBite.col1)) {
            shortestPath++
            mouse.visited = true
            mouse.type = 5
            mouse = maze[mouse.prevCol][mouse.prevRow]
        }
        mouse.type=5
        maze[endBite.col1][endBite.row].type = 3
        return {
            shortestPath: shortestPath,
            maze: maze
        }
    }
}