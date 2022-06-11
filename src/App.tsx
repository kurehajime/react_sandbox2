import { useEffect, useState } from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import Board from './components/Board';

function App() {
  const [map, setMap] = useState<number[]>([])
  const shuffleBoard = (): number[] => {
    const map: number[] = [];
    for (const num in map) {
      map[num] = 0;
    }
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const red_num = [0, 10, 20, 30, 40, 50, 11, 41];
    const blue_num = [55, 45, 35, 25, 15, 5, 44, 14];
    for (let i = arr.length - 1; i >= 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[r];
      arr[r] = tmp;
    }
    for (const num in blue_num) {
      map[blue_num[num]] = arr[num];
    }
    for (const num in red_num) {
      map[red_num[num]] = -1 * arr[num];
    }
    return map;
  }
  useEffect(() => {
    setMap(shuffleBoard())
  }, [])

  const mock = (cellNumber: number) => {
    console.log(cellNumber)
  }

  return (
    <div className="App">
      <header className="App-header">
        <RecoilRoot>
          <Board
            map={map}
            hover={3}
            clickCell={mock}
          ></Board>
        </RecoilRoot>
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
