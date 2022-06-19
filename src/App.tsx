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
  const [level, setLevel] = useState(1)
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
    <RecoilRoot>
      <span id="dialogue"></span>
      <span id="dialogue2"></span>
      <div id="page">
        <div id="main">
          <div id="canv">
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
          </div>
          <div id="message">
            <div id="head">
              <span id="gamename">colamone</span> by <a href="https://twitter.com/kurehajime">@kurehajime</a><br />
              <span id="blue" className="score">Blue: 0/8</span> - <span id="red" className="score"> Red: 0/8</span><span
                id="wins"></span>
            </div>
            <div id="lvs">
              <select id="level" value={level} onChange={e => { setLevel(parseInt(e.target.value)); }}>
                <option value="1" className="lv">Lv.1</option>
                <option value="2" className="lv">Lv.2</option>
                <option value="3" className="lv">Lv.3</option>
                <option value="4" className="lv">Lv.4</option>
                <option value="5" className="lv">Lv.5</option>
                <option value="6" className="lv">Lv.6</option>
              </select>
              <button type="button" id="newgame">New Game</button>
            </div>
            <span id="log" className="hide"><button type="button" id="prevprev" className="hide"> |&lt; </button><button
              type="button" id="prev" className="hide"> &lt; </button><button type="button" id="next" className="hide"
              > &gt; </button><button type="button" id="nextnext" className="hide"> &gt;|</button></span>
            <span id="span_replay" className="hide"><button type="button" id="replay"> View log </button></span>
            <span id="span_tweetlog" className="hide"><button type="button" id="tweetlog"> Tweet result
            </button></span>
            <div id="collapsible">
              <h5 className="howtoplay"><span id="htp">How to play Colamone</span></h5>
              <div className="manual">
                <p id="manual_en" lang="en">
                  {`(1) Colamone is similar to chess.
    But there are some differences.
(2) Each piece can move 1 tile in the direction
    of any of it's dots.
(3) If a piece reaches the other side,
    you get the points it's worth.
(4) If you reach 8 points, you win.
(5) When a piece reaches the other side, you can
    no longer move it and the enemy cannot take it.
(6) When there's no movement available to a player,
    the player with the highest score wins.
(7) if the current position on the board
    appeared 3 times then the result is a draw.`}</p>
              </div>
              <span id="sns"> <a href="https://twitter.com/share" className="twitter-share-button" data-dnt="true"
                data-url="https://xiidec.appspot.com/colamone/colamone.html" data-hashtags="colamone, boardgames"
                data-lang="en" data-size="default"></a>
              </span>
            </div>
          </div>
          <div id="footer">
            <p>
              {'(c)2014–' + new Date().getFullYear().toString()}   <a
                href="https://twitter.com/kurehajime">@kurehajime</a>. All Rights Reserved. / Ver.<a
                  href="https://github.com/kurehajime/colamone_js">
                TIMESTAMP
              </a>/<span id="time"></span>
            </p>
          </div>
        </div>
      </div>
    </RecoilRoot>
  );
}

export default App;
