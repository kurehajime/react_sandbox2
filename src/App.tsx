import { useEffect, useState } from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import Board from './components/Board';
import { Hand } from './Hand';

function App() {
  const [map, setMap] = useState<number[]>([])
  const [cover, setCover] = useState(false)
  const [score, setScore] = useState(false)
  const [hand, setHand] = useState<Hand | null>([33, 44])
  const [message, setMessage] = useState('')
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
            cover={cover}
            score={score}
            blueScore={2}
            redScore={3}
            hand={hand}
            message={message}
            clickCell={mock}
          ></Board>
        </RecoilRoot>
        <input type='checkbox' id="cover"
          onChange={(e) => { setCover(e.target.checked) }}
          checked={cover}
        ></input><label htmlFor="cover">Cover</label>
        <input type='checkbox' id="cover"
          onChange={(e) => { setScore(e.target.checked) }}
          checked={score}
        ></input><label htmlFor="score">Score</label>
        <input type='checkbox' id="shadow"
          onChange={(e) => {
            if (e.target.checked) {
              setHand([33, 44])
            } else {
              setHand(null)
            }
          }}
          checked={hand !== null}
        ></input><label htmlFor="shadow">Shadow</label>
        <label htmlFor="message">Message</label><input type='text' id="message"
          onChange={(e) => {
            setMessage(e.target.value)
          }}
          value={message}
        ></input>
      </header>
    </div >
  );
}

export default App;
