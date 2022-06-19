import { useEffect } from 'react';
import Board from './Board';
import Panel from './Panel';
import Footer from './Footer';
import Header from './Header';
import { $blueScore, $cover, $hand, $hover, $level, $map, $message, $mode, $redScore, $score } from '../GameState';
import { useRecoilState } from 'recoil';

export default function Colamone() {
    const [map, setMap] = useRecoilState($map)
    const [cover] = useRecoilState($cover)
    const [score] = useRecoilState($score)
    const [hand] = useRecoilState($hand)
    const [message] = useRecoilState($message)
    const [blueScore] = useRecoilState($blueScore)
    const [redScore] = useRecoilState($redScore)
    const [hover] = useRecoilState($hover)
    const [mode] = useRecoilState($mode)
    const [level, setLevel] = useRecoilState($level)
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
        <span>
            <Header></Header>
            <div id="page">
                <div id="main">
                    <div id="canv">
                        <Board
                            map={map}
                            hover={hover}
                            cover={cover}
                            score={score}
                            blueScore={blueScore}
                            redScore={redScore}
                            hand={hand}
                            message={message}
                            clickCell={mock}
                        ></Board>
                    </div>
                    <Panel
                        blueScore={blueScore}
                        redScore={redScore}
                        level={level}
                        setLevel={setLevel}
                        mode={mode}
                        newGame={() => { return }}
                        prevprev={() => { return }}
                        prev={() => { return }}
                        next={() => { return }}
                        nextnext={() => { return }}
                        tweet={() => { return }}
                    ></Panel>

                </div>
            </div>
            <Footer></Footer>
        </span>
    );
}
