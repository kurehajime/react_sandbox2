import React from 'react';
import logo from './logo.svg';
import './App.css';
import Piece from './components/Piece';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <svg className="App-logo">
          <Piece
            x={1}
            y={1}
            number={3}
            display={'inline'}
            goal={false}
          ></Piece>
        </svg>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

      </header>
    </div >
  );
}

export default App;
