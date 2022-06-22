import { useEffect, useState } from 'react';
import Board from './Colamone/Board';
import Panel from './Colamone/Panel';
import Footer from './Colamone/Footer';
import Header from './Colamone/Header';
import { Rule } from '../static/Rule';
import Cookie from '../static/Cookie';
import { Aijs } from '../static/Ai';
import { Util } from '../static/Util';
import { GameState } from '../model/GameState';
import { $GameState, $goaled } from '../GameState';
import { useRecoilState } from 'recoil';
import GameStateManager from '../static/GameStateManager';

export default function Colamone() {
    const [originalGameState, _setGameState] = useRecoilState($GameState)
    const [goaled, setGoaled] = useRecoilState($goaled)
    const [cookie] = useState(new Cookie());
    let gameState = {...originalGameState};

    const initDom = ()=>{
        Util.zoom(); // 小さい端末でズーム
        manual(window.innerHeight < window.innerWidth);
        window.addEventListener('orientationchange', Util.zoom);
    }

    const loopDemo = ()=>{
        if (gameState.logArray.length === 0) {
            if (Util.isBot() == false) {
                          // TODO : DEMOをどうにかする
                // window.setTimeout(() => {
                //     if (demo == true) {
                //         this.intervalID = window.setInterval(() => { this.playDemo() }, 400);
                //         this.playDemo();
                //     }
                // }, 500);
            }
        }
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

        if (gameState.winner !== null || gameState.logArray.length !== 0) {
            reloadnew();
            return true;
        }
        if (gameState.demo === true) {
            gameState.demo = false
            gameState.hand = null
            gameState.map = gameState.startMap
            gameState.logArray2 = []
            gameState.winner = null
            setGoaled(false)
            gameState.turnPlayer = 1
            // TODO : DEMO
            //window.clearInterval(this.intervalID as number);
            setGameState(gameState)
            return true;
        }

        if (gameState.hover === null) {
            if (gameState.map[target] * gameState.turnPlayer > 0) {
                gameState.hover = target
                setGameState(gameState)
            }
        } else {
            if (target == gameState.hover) {
                gameState.hover = null
                setGameState(gameState)
                return true;
            }
            const canm = Rule.getCanMovePanelX(gameState.hover, gameState.map);
            if (canm.indexOf(target) >= 0) {
                if (Rule.isGoaled(target, gameState.turnPlayer)) {
                    setGoaled(true)
                    setTimeout(() => {
                        setGoaled(false)
                    }, 2000);
                }

                const _map = gameState.map.slice()
                _map[target] = gameState.map[gameState.hover];
                _map[gameState.hover] = 0;
                gameState.map = _map
                gameState.turnPlayer = gameState.turnPlayer * -1
                gameState.logArray2 = gameState.logArray2.concat([gameState.hover, target])
                gameState.hand = [gameState.hover, target]
                gameState.hover = null

                // AIが考える。
                gameState.message = 'thinking...'
                gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
                gameState = GameStateManager.calcWinner(gameState,cookie)
                setGameState(gameState)
                if (gameState.winner === null) {
                    window.setTimeout(() => {
                        _ai(gameState.level);
                        setGameState(gameState)
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
        cookie.storage.setItem('level_save', gameState.level);
        if (cookie.storage.getItem('level_' + gameState.level) > 0) {
            gameState.wins = (cookie.storage.getItem('level_' + gameState.level))
        }
        gameState.map = Rule.copyMap(gameState.startMap)
        gameState.hand = null
        gameState.mapList = {};
        gameState.logArray2  = [];
        gameState.blueScore = 0
        gameState.redScore = 0
        setGameState(gameState)
    }

    /** 
     * AIに考えてもらう。
     */
    const _ai = (level: number) => {
        const startTime = new Date();
        let endTime = null;
        // 終盤になったら長考してみる。
        const count = Rule.getNodeCount(gameState.map) / 2;
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

        const _hand = Aijs.thinkAI(gameState.map, gameState.turnPlayer, level + plus + 1, undefined, undefined, undefined)[0];
        if (_hand) {
            if (Rule.isGoaled(_hand[1], gameState.turnPlayer)) {
                setGoaled(true)
                setTimeout(() => {
                    setGoaled(false)
                }, 2000);
            }
            const _map = gameState.map.slice()
            _map[_hand[1]] = gameState.map[_hand[0]];
            _map[_hand[0]] = 0;
            gameState.map = _map
            gameState.logArray2 = gameState.logArray2.concat([_hand[0], _hand[1]])
        }
        gameState.turnPlayer= (gameState.turnPlayer * -1)
        endTime = new Date();
        gameState.thinktime = ((endTime.getTime() - startTime.getTime()) / 1000)
        gameState.message = ''
        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        gameState = GameStateManager.calcWinner(gameState,cookie)
    }


    /** 
     * ログを全部巻き戻す
     */
    const move_start = () => {
        gameState.logPointer = 0
        gameState.auto_log = false
        gameState.map = Rule.copyMap(gameState.logArray[gameState.logPointer])
        gameState.winner = null
        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        gameState = GameStateManager.calcWinner(gameState,cookie)
        setGoaled(false)
        setGameState(gameState)
    }

    /** 
     * ログを戻す
     */
    const move_prev = () => {
        if (gameState.logPointer <= 0) { return; }
        gameState.auto_log = false
        gameState.logPointer = gameState.logPointer - 1
        gameState.map = Rule.copyMap(gameState.logArray[gameState.logPointer])
        gameState.winner = null
        setGoaled(false)
        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        gameState = GameStateManager.calcWinner(gameState,cookie)
        setGameState(gameState)
    }

    /** 
     * ログを進める
     */
    const move_next = () => {
        if (gameState.logPointer + 1 > gameState.logArray.length - 1) { return; }
        gameState.logPointer = (gameState.logPointer + 1)
        gameState.map = Rule.copyMap(gameState.logArray[gameState.logPointer])
        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        gameState = GameStateManager.calcWinner(gameState,cookie)
        setGameState(gameState)
    }

    /** 
     * ログを最後まで進める。
     */
    const move_end = () => {
        gameState.logPointer =(gameState.logArray.length - 1)
        gameState.auto_log = false
        gameState.map = Rule.copyMap(gameState.logArray[gameState.logPointer])
        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        gameState = GameStateManager.calcWinner(gameState,cookie)
        setGameState(gameState)
    }

    /** 
     * リセット
     */
    const reloadnew = () => {
        let url = document.location.href.split('?')[0];

        //demo中ならdemoを終了
        if (gameState.demo === true) {
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
            gameState.map = Rule.copyMap(gameState.startMap)
            gameState.map = Rule.shuffleBoard();
            gameState.logArray2 = []
            gameState.message = ''
            gameState.winner = null
            gameState.turnPlayer = 1
        }
        setGameState(gameState)
    }

    const manual = (show: boolean) => {
        if (show) {
            document.querySelector('.manual')?.classList.remove("hide");
        } else {
            document.querySelector('.manual')?.classList.add("hide");
        }
    }
    /** 
     * ゲーム終了
     */
    const  setGameState= (gs:GameState)=>{
        _setGameState({...gs})
    }

    //------------------------------------

    useEffect(() => {
        setGoaled(false)
        initDom()
        gameState = GameStateManager.InitGame(gameState,cookie)
        setGameState(gameState)
    }, [])

    return (
        <span>
            <Header></Header>
            <div id="page">
                <div id="main">
                    <div id="canv">
                        <Board
                            map={Array.from(gameState.map)}
                            hover={gameState.hover ? gameState.map[gameState.hover] : null}
                            cover={gameState.demo}
                            score={goaled}
                            blueScore={gameState.blueScore}
                            redScore={gameState.redScore}
                            hand={gameState.hand}
                            message={gameState.message}
                            clickCell={(cellNumber: number) => {
                                ev_mouseClick(cellNumber)
                            }}
                        ></Board>
                    </div>
                    <Panel
                        blueScore={gameState.blueScore}
                        redScore={gameState.redScore}
                        level={gameState.level}
                        setLevel={
                            (x) =>{
                                gameState.level = x
                                setGameState(gameState)
                            }
                        }
                        mode={gameState.mode}
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
