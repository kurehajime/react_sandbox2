import { useEffect, useState } from 'react';
import Board from './Board';
import Panel from './Panel';
import Footer from './Footer';
import Header from './Header';
import { $auto_log, $blueScore, $cover, $demo, $goaled, $hand, $hover, $level, $log_pointer, $map, $map_list, $message, $mode, $redScore, $thinktime, $turn_player, $winner, $wins } from '../GameState';
import { useRecoilState } from 'recoil';
import { Hand, MapArray, Rule } from '../static/rule';
import Cookie from '../static/cookie';
import { Aijs } from '../static/ai';
import { Util } from '../static/util';

export default function Colamone() {
    const [map, setMap] = useRecoilState($map)
    const [cover] = useRecoilState($cover)
    const [hand, setHand] = useRecoilState($hand)
    const [message, setMessage] = useRecoilState($message)
    const [blueScore, setBlueScore] = useRecoilState($blueScore)
    const [redScore, setRedScore] = useRecoilState($redScore)
    const [hover, setHover] = useRecoilState($hover)
    const [mode] = useRecoilState($mode)
    const [level, setLevel] = useRecoilState($level)
    const [demo, setDemo] = useRecoilState($demo)
    const [goaled, setGoaled] = useRecoilState($goaled)
    const [winner, setWinner] = useRecoilState($winner)
    const [autoLog, setAutoLog] = useRecoilState($auto_log)
    const [turnPlayer, setTurnPlayer] = useRecoilState($turn_player)
    const [mapList, setMapList] = useRecoilState($map_list)
    const [wins, setWins] = useRecoilState($wins)
    const [thinktime, setThinktime] = useRecoilState($thinktime)
    const [logPointer, setLogPointer] = useRecoilState($log_pointer)

    //-------------------------------------
    const [cookie] = useState(new Cookie());
    const [intervalID] = useState<number | null>(null);
    const [intervalID_log] = useState<number | null>(null);
    const [startMap, setStartMap] = useState<Int8Array>(new Int8Array());
    const [logArray, setLogArray] = useState<Array<MapArray>>([]);
    const [logArray2, setLogArray2] = useState<Array<Hand>>([]);

    /** 
     * ゲーム開始
     */
    const Run = () => {

        Util.zoom(); // 小さい端末でズーム
        manual(window.innerHeight < window.innerWidth);

        setTurnPlayer(1)
        setDemo(true)

        window.addEventListener('orientationchange', Util.zoom);

        const _map = Rule.shuffleBoard()
        setMap(_map)
        setStartMap(_map)

        // 連勝記録初期化
        if (!cookie.storage.getItem('level_1')) {
            cookie.storage.setItem('level_1', 0);
        }
        if (!cookie.storage.getItem('level_2')) {
            cookie.storage.setItem('level_2', 0);
        }
        if (!cookie.storage.getItem('level_3')) {
            cookie.storage.setItem('level_3', 0);
        }
        if (!cookie.storage.getItem('level_4')) {
            cookie.storage.setItem('level_4', 0);
        }
        if (!cookie.storage.getItem('level_5')) {
            cookie.storage.setItem('level_5', 0);
        }
        // レベル記憶
        if (cookie.storage.getItem('level_save') !== undefined && cookie.storage.getItem('level_save') !== 'undefined' && cookie.storage.getItem('level_save') !== null) {
            setLevel(parseInt(cookie.storage.getItem('level_save')));
        } else {
            cookie.storage.setItem('level_save', 1);
            setLevel(1);
        }


        // パラメータを取得
        const paramObj = Util.getParam();

        // 盤面を初期化
        if (paramObj.init) {
            setStartMap(Util.getMapByParam(map, paramObj.init))
            setMap(Rule.copyMap(startMap))
        } else {
            setStartMap(map)
        }
        // ログをデコード
        if (paramObj.log) {
            setLogArray(Util.decodeLog(paramObj.log, startMap))
        }
        // レベル取得
        if (paramObj.lv) {
            setLevel(parseInt(paramObj.lv));
        }

        logMenu(logArray.length !== 0);

        updateMessage();
        Util.setTweet(); // ツイートボタンを生成

        if (logArray.length === 0) {
            if (Util.isBot() == false) {
                // TODO : DEMOをどうにかする
                // window.setTimeout(() => {
                //     if (demo == true) {
                //         this.intervalID = window.setInterval(() => { this.playDemo() }, 400);
                //         this.playDemo();
                //     }
                // }, 500);
            }
        } else {
            setDemo(false)
            setAutoLog(true)
            // TODO : DEMOをどうにかする
            // this.intervalID_log = window.setInterval(() => { this.playLog() }, 1000);
        }
        setGoaled(false)
    }

    /** 
     * Demoを再生
     */
    const playDemo = () => {
        // TODO : DEMO
        // if (this.intervalID !== null) {
        //     if (Math.random() > 0.3) {
        //         this.ai(2);
        //     } else {
        //         this.ai(1);
        //     }
        // }
        // this.view.ViewState.demo_inc++;
        // this.calcScore();
        // this.view.flush(this.gameState, false, false);
        // if (this.gameState.winner === 1 || this.gameState.winner === -1 || this.gameState.winner === 0) {
        //     this.gameState.goaled = true;
        //     this.gameState.winner = null;
        //     this.view.flush(this.gameState, false, false);
        //     this.shuffleBoard();
        // }
        // if (this.view.ViewState.demo_inc > 42) {
        //     window.clearInterval(this.intervalID as number);
        // }
    }

    /** 
     * Logを再生
     */
    const playLog = () => {
        // TODO : LOGS
        // if (intervalID_log !== null && autoLog == true) {
        //     move_next();
        // } else {
        //     clearInterval(this.intervalID_log as number);
        // }
    }

    /** 
     * マウスクリック時処理
     */
    const ev_mouseClick = (target: number): boolean => {

        if (winner !== null || logArray.length !== 0) {
            reloadnew();
            return true;
        }
        if (demo === true) {
            setDemo(false)
            setHand(null)
            setMap(startMap)
            setLogArray2([])
            setWinner(null)
            setGoaled(false)
            setTurnPlayer(1)
            // TODO : DEMO
            //window.clearInterval(this.intervalID as number);
            return true;
        }

        if (hover === null) {
            if (map[target] * turnPlayer > 0) {
                setHover(target)
            }
        } else {
            if (target == hover) {
                setHover(null)
                return true;
            }
            const canm = Rule.getCanMovePanelX(hover, map);
            if (canm.indexOf(target) >= 0) {
                if (Rule.isGoaled(target, turnPlayer)) {
                    setGoaled(true)
                    setTimeout(() => {
                        setGoaled(false)
                    }, 2000);
                }

                const _map = map.slice()
                _map[target] = map[hover];
                _map[hover] = 0;
                setMap(_map)
                setTurnPlayer(turnPlayer * -1)
                setLogArray2(logArray2.concat([hover, target]))
                setHand([hover, target])
                setHover(null)

                // AIが考える。
                setMessage('thinking...')
                updateMessage();
                if (winner === null) {
                    window.setTimeout(() => {
                        ai(level);
                        setMessage('')
                        updateMessage();
                    }, 250);
                } else {
                    // TODO:勝敗
                }
            }
        }

        return true;
    }

    /** 
     * ラジオボタン変更時処理
     */
    const ev_radioChange = () => {
        cookie.storage.setItem('level_save', level);
        if (cookie.storage.getItem('level_' + level) > 0) {
            setWins(cookie.storage.getItem('level_' + level))
        }
        setMap(Rule.copyMap(startMap))
        setHand(null)
        setMapList({});
        setLogArray2([])
        setBlueScore(0)
        setRedScore(0)
    }

    /** 
     * AIに考えてもらう。
     */
    const ai = (level: number) => {
        const startTime = new Date();
        let endTime = null;
        // 終盤になったら長考してみる。
        const count = Rule.getNodeCount(map) / 2;
        let plus = 0;
        switch (level) {
            case 1:
                if (count <= 7) {
                    plus++;
                }
                break;
            case 2:
                if (count <= 8) {
                    plus++;
                }
                break;
            case 3:
                if (count <= 10) {
                    plus++;
                }
                if (count <= 6) {
                    plus++;
                }
                break;
            case 4:
                if (count <= 11) {
                    plus++;
                }
                if (count <= 7) {
                    plus++;
                }
                break;
            case 5:
                if (count > 16) {
                    plus--;
                }
                if (count <= 12) {
                    plus++;
                }
                if (count <= 8) {
                    plus++;
                }
                break;
            case 6:
                if (count > 16) {
                    plus--;
                }
                if (count <= 12) {
                    plus++;
                }
                if (count <= 8) {
                    plus++;
                }
                break;
        }

        const _hand = Aijs.thinkAI(map, turnPlayer, level + plus + 1, undefined, undefined, undefined)[0];
        if (_hand) {
            if (Rule.isGoaled(_hand[1], turnPlayer)) {
                setGoaled(true)
                setTimeout(() => {
                    setGoaled(false)
                }, 2000);
            }
            const _map = map.slice()
            _map[_hand[1]] = map[_hand[0]];
            _map[_hand[0]] = 0;
            setMap(_map)
            setLogArray2(logArray2.concat([_hand[0], _hand[1]]))
        }
        setTurnPlayer(turnPlayer * -1)
        endTime = new Date();
        setThinktime((endTime.getTime() - startTime.getTime()) / 1000)
    }

    /** 
     * メッセージを更新
     */
    const updateMessage = () => {
        calcScore();
        if (logArray.length === 0) {
            if (winner == 1) {
                setMessage('You win!')
                cookie.storage.setItem('level_' + level,
                    parseInt(cookie.storage.getItem('level_' + level)) + 1);
                endgame(logArray);
            } else if (winner == -1) {
                setMessage('You lose...')
                cookie.storage.setItem('level_' + level, 0);
                endgame(logArray);
            } else if (winner === 0) {
                if (mapList[JSON.stringify(map)] >= Rule.LIMIT_1000DAY) {
                    setMessage('3fold repetition')
                } else {
                    setMessage('-- Draw --')
                }
                endgame(logArray);
            }
        }

        if (cookie.storage.getItem('level_' + level) > 0) {
            setWins(cookie.storage.getItem('level_' + level))
        }
    }
    /** 
     * 得点計算。
     */
    const calcScore = () => {
        let sum1 = 0;
        let sum2 = 0;
        const GoalTop = [0, 10, 20, 30, 40, 50];
        const GoalBottom = [5, 15, 25, 35, 45, 55];
        // 点数勝利        
        for (const i in GoalTop) {
            if (map[GoalTop[i]] * 1 > 0) {
                sum1 += map[GoalTop[i]];
            }
        }
        for (const i in GoalBottom) {
            if (map[GoalBottom[i]] * -1 > 0) {
                sum2 += map[GoalBottom[i]];
            }
        }
        if (sum1 >= 8) {
            setWinner(1)
        } else if (sum2 <= -8) {
            setWinner(-1)
        }

        // 手詰まりは判定
        if (Rule.isNoneNode(map)) {
            if (Math.abs(sum1) > Math.abs(sum2)) {
                setWinner(1)
            } else if (Math.abs(sum1) < Math.abs(sum2)) { // 引き分けは後攻勝利
                setWinner(-1)
            } else if (Math.abs(sum1) == Math.abs(sum2)) {
                setWinner(0)
            }
        } else {
            const [is1000day, map_list] = Rule.is1000day(map, Object.assign({}, mapList))
            setMapList(map_list)
            if (is1000day) {
                setWinner(0)
            }
        }
        setBlueScore(sum1)
        setRedScore(sum2)
    }

    /** 
     * ログを全部巻き戻す
     */
    const move_start = () => {
        setLogPointer(0)
        setAutoLog(false)
        setMap(Rule.copyMap(logArray[logPointer]))
        setWinner(null)
        setGoaled(false)
        updateMessage();
    }

    /** 
     * ログを戻す
     */
    const move_prev = () => {
        if (logPointer <= 0) { return; }
        setAutoLog(false)
        setLogPointer(logPointer - 1)
        setMap(Rule.copyMap(logArray[logPointer]))
        setWinner(null)
        setGoaled(false)
        updateMessage();
    }

    /** 
     * ログを進める
     */
    const move_next = () => {
        if (logPointer + 1 > logArray.length - 1) { return; }
        setLogPointer(logPointer + 1)
        setMap(Rule.copyMap(logArray[logPointer]))
        updateMessage();
    }

    /** 
     * ログを最後まで進める。
     */
    const move_end = () => {
        setLogPointer(logArray.length - 1)
        setAutoLog(false)
        setMap(Rule.copyMap(logArray[logPointer]))
        updateMessage();
    }

    /** 
     * リセット
     */
    const reloadnew = () => {
        let url = document.location.href.split('?')[0];

        //demo中ならdemoを終了
        if (demo === true) {
            ev_mouseClick(0);
            return;
        }

        // パラメータを取得
        const paramObj = Util.getParam();
        if (paramObj.lang) {
            url += '?lang=' + paramObj.lang;
        }
        if (navigator.onLine) {
            location.href = url;
        } else {
            setMap(Rule.copyMap(startMap))
            setMap(Rule.shuffleBoard());
            setLogArray2([])
            setMessage('')
            setWinner(null)
            setTurnPlayer(1)
        }
    }

    const manual = (show: boolean) => {
        if (show) {
            document.querySelector('.manual')?.classList.remove("hide");
        } else {
            document.querySelector('.manual')?.classList.add("hide");
        }
    }
    const logMenu = (show: boolean) => {
        return
    }
    /** 
     * ゲーム終了
     */
    const endgame = (logArray: Array<MapArray>) => {
        if (logArray.length === 0) {
            document.querySelector('#span_replay')?.classList.remove("hide");
            document.querySelector('#span_tweetlog')?.classList.remove("hide");
        }
    }

    //------------------------------------

    useEffect(() => {
        Run()
    }, [])

    return (
        <span>
            <Header></Header>
            <div id="page">
                <div id="main">
                    <div id="canv">
                        <Board
                            map={Array.from(map)}
                            hover={hover ? map[hover] : null}
                            cover={demo}
                            score={goaled}
                            blueScore={blueScore}
                            redScore={redScore}
                            hand={hand}
                            message={message}
                            clickCell={(cellNumber: number) => {
                                ev_mouseClick(cellNumber)
                            }}
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
        </span >
    );
}
