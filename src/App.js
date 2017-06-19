import React from 'react'
import './App.css'
import MyMaze from './MyMaze.js'
import SubmitForm from './SubmitForm'
const App = () => {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Welcome to The Maze</h1>
        </div>
          <div>
              <SubmitForm />
          </div>
          <MyMaze />
      </div>
    )
  }
export default App;