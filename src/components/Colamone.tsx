import { useEffect, useState } from 'react';
import Board from './Colamone/Board';
import Panel from './Colamone/Panel';
import Footer from './Colamone/Footer';
import Header from './Colamone/Header';
import {MapArray, Rule } from '../static/rule';
import Cookie from '../static/cookie';
import { Aijs } from '../static/ai';
import { Util } from '../static/util';
import { GameState } from '../model/GameState';
import { Mode } from '../model/Mode';

export default function Colamone() {
    const [originalGameState, _setGameState] = useState<GameState>({
        turnPlayer:0,
        map:new Int8Array([
              -1, 0, 0, 0, 0, 6, 0, 0, 0, 0, -2, -8,
              0, 0, 7, 5, 0, 0, 0, 0, -3, 0, 0, 0,
              0, 4, 0, 0, 0, 0, -4, 0, 0, 0, 0,
              3, 0, 0, 0, 0, -5, -7, 0, 0, 8, 2,
              0, 0, 0, 0, -6, 0, 0, 0, 0, 1
            ]),
        startMap:new Int8Array(),
        hover:null,
        demo:false,
        auto_log:false,
        hand:null,
        message:'',
        blueScore:0,
        redScore:0,
        level:0,
        wins:0,
        log_pointer:0,
        thinktime:null,
        winner:null,
        mapList:{},
        mode:Mode.game,
        logArray:[],
        logArray2:[],
        logPointer:0
      })
    const gameState = {...originalGameState};
    const [goaled, setGoaled] = useState(false)
    const [cookie] = useState(new Cookie());

    /** 
     * ゲーム開始
     */
    const Run = () => {

        Util.zoom(); // 小さい端末でズーム
        manual(window.innerHeight < window.innerWidth);
        gameState.turnPlayer = 1
        gameState.demo = true

        window.addEventListener('orientationchange', Util.zoom);

        const _map = Rule.shuffleBoard()
        gameState.map = _map
        gameState.startMap = _map

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
            gameState.level = parseInt(cookie.storage.getItem('level_save'))
        } else {
            cookie.storage.setItem('level_save', 1);
            gameState.level =1
        }


        // パラメータを取得
        const paramObj = Util.getParam();

        // 盤面を初期化
        if (paramObj.init) {
            gameState.startMap=Util.getMapByParam(gameState.map, paramObj.init)
            gameState.map = Rule.copyMap(gameState.startMap)
        } else {
            gameState.startMap = gameState.map
        }
        // ログをデコード
        if (paramObj.log) {
            gameState.logArray = Util.decodeLog(paramObj.log, gameState.startMap)
        }
        // レベル取得
        if (paramObj.lv) {
            gameState.level = parseInt(paramObj.lv)
        }

        logMenu(gameState.logArray.length !== 0);

        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        Util.setTweet(); // ツイートボタンを生成

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
        } else {
            gameState.demo =false
            gameState.auto_log=true
            // TODO : DEMOをどうにかする
            // this.intervalID_log = window.setInterval(() => { this.playLog() }, 1000);
        }
        setGoaled(false)
        _updateMessage();
        setGameState(gameState)
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
                _updateMessage();
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
        _updateMessage();
    }

    /** 
     * メッセージを更新
     */
    const _updateMessage = () => {
        _calcScore();
        if (gameState.logArray.length === 0) {
            if (gameState.winner == 1) {
                gameState.message = 'You win!'
                cookie.storage.setItem('level_' + gameState.level,
                    parseInt(cookie.storage.getItem('level_' + gameState.level)) + 1);
                endgame(gameState.logArray);
            } else if (gameState.winner == -1) {
                gameState.message ='You lose...'
                cookie.storage.setItem('level_' + gameState.level, 0);
                endgame(gameState.logArray);
            } else if (gameState.winner === 0) {
                if (gameState.mapList[JSON.stringify(gameState.map)] >= Rule.LIMIT_1000DAY) {
                    gameState.message ='3fold repetition'
                } else {
                    gameState.message ='-- Draw --'
                }
                endgame(gameState.logArray);
            }
        }

        if (cookie.storage.getItem('level_' + gameState.level) > 0) {
            gameState.wins = cookie.storage.getItem('level_' + gameState.level)
        }
    }
    /** 
     * 得点計算。
     */
    const _calcScore = () => {
        let sum1 = 0;
        let sum2 = 0;
        const GoalTop = [0, 10, 20, 30, 40, 50];
        const GoalBottom = [5, 15, 25, 35, 45, 55];
        // 点数勝利        
        for (const i in GoalTop) {
            if (gameState.map[GoalTop[i]] * 1 > 0) {
                sum1 += gameState.map[GoalTop[i]];
            }
        }
        for (const i in GoalBottom) {
            if (gameState.map[GoalBottom[i]] * -1 > 0) {
                sum2 += gameState.map[GoalBottom[i]];
            }
        }
        if (sum1 >= 8) {
            gameState.winner =  1
        } else if (sum2 <= -8) {
            gameState.winner = -1
        }

        // 手詰まりは判定
        if (Rule.isNoneNode(gameState.map)) {
            if (Math.abs(sum1) > Math.abs(sum2)) {
                gameState.winner = 1
            } else if (Math.abs(sum1) < Math.abs(sum2)) { // 引き分けは後攻勝利
                gameState.winner = -1
            } else if (Math.abs(sum1) == Math.abs(sum2)) {
                gameState.winner = 0
            }
        } else {
            if (Rule.is1000day(gameState.map, Object.assign({}, gameState.mapList))) {
                gameState.winner = 0
            }
        }
        gameState.blueScore = sum1
        gameState.redScore = sum2
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
        _updateMessage();
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
        _updateMessage();
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
        _updateMessage();
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
        _updateMessage();
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
        setGameState(gameState)
    }

    const  setGameState= (gs:GameState)=>{
        _setGameState({...gs})
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
