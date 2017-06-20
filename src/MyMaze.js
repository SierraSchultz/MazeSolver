import React, {Component} from 'react';
export default class MyMaze extends Component{
    constructor(){
        super();
        this.state = {
            mazeArray: this.mazeArray,
            lastBite: this.lastBite
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
                switch (this.mazeArray[j][i].type){
                    case 0:
                    case 4:
                        ctx.fillStyle = "#ffffff"
                        ctx.fillRect((i + 1) * 10, (1 + j) * 10, 10, 10)
                        break
                    case 1:
                        ctx.fillStyle = "#000000"
                        ctx.fillRect((i + 1) * 10, (1 + j) * 10, 10, 10)
                        break
                    case 2:
                        ctx.fillStyle = "#613065"
                        ctx.fillRect((i + 1) * 10, (j + 1) * 10, 10, 10)
                        break
                    case 3:
                        ctx.fillStyle = "#456545"
                        ctx.fillRect((1 + i) * 10, (1 + j) * 10, 10, 10)
                        break
                    case 5:
                        ctx.fillStyle = "#650302"
                        ctx.fillRect((i + 1) * 10, (1 + j) * 10, 10, 10)
                        break
                    default:
                }
                y= j;
            }
            x = i;
        }
        ctx.font = "24px Arial";
        ctx.fillText("Path Length: " + this.shortestPath, x*3.5, y*12);
        return ctx;
    };
    render() {
        return null
    }
}
