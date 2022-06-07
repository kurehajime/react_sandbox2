import { useEffect, useState } from 'react';
import './App.css';
import Board from './components/Board';

function App() {
  let [map, setMap] = useState([])
  const shuffleBoard = () => {
    let map: any = [];
    for (let num in map) {
      map[num] = 0;
    }
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    let red_num = [0, 10, 20, 30, 40, 50, 11, 41];
    let blue_num = [55, 45, 35, 25, 15, 5, 44, 14];
    for (let i = arr.length - 1; i >= 0; i--) {
      let r = Math.floor(Math.random() * (i + 1));
      let tmp = arr[i];
      arr[i] = arr[r];
      arr[r] = tmp;
    }
    for (let num in blue_num) {
      map[blue_num[num]] = arr[num];
    }
    for (let num in red_num) {
      map[red_num[num]] = -1 * arr[num];
    }
    return map;
  }
  useEffect(() => {
    setMap(shuffleBoard())
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <Board
          map={map}
          hover={null}
        ></Board>
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
