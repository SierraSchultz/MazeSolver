/**
 * Created by sschultz on 6/16/2017.
 */
import React, { Component } from 'react';
export default class MazeBite extends Component{
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