import { useEffect, useState } from 'react';
import Board from './Colamone/Board';
import Panel from './Colamone/Panel';
import Footer from './Colamone/Footer';
import Header from './Colamone/Header';
import { Rule } from '../static/Rule';
import Cookie from '../static/Cookie';
import { Util } from '../static/Util';
import { GameState } from '../model/GameState';
import GameStateManager from '../static/GameStateManager';
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
    let gameState = {...originalGameState};

    const initDom = ()=>{
        Util.zoom(); // 小さい端末でズーム
        manual(window.innerHeight < window.innerWidth);
        window.addEventListener('orientationchange', Util.zoom);
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
                const _map = gameState.map.slice()
                _map[target] = gameState.map[gameState.hover];
                _map[gameState.hover] = 0;
                gameState.map = _map
                gameState.turnPlayer = gameState.turnPlayer * -1
                gameState.logArray2 = gameState.logArray2.concat([[gameState.hover, target]])
                gameState.hand = [gameState.hover, target]
                gameState.hover = null

                // AIが考える。
                gameState.message = 'thinking...'
                gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
                gameState = GameStateManager.calcWinner(gameState)
                setGameState(gameState)
                if (gameState.winner === null) {
                    window.setTimeout(() => {
                        gameState = GameStateManager.ai(gameState);
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
        Cookie.setItem('level_save', gameState.level);
        if (Cookie.getItem('level_' + gameState.level) > 0) {
            gameState.wins = (Cookie.getItem('level_' + gameState.level))
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
     * ログを全部巻き戻す
     */
    const move_start = () => {
        gameState.logPointer = 0
        gameState.auto_log = false
        gameState.map = Rule.copyMap(gameState.logArray[gameState.logPointer])
        gameState.winner = null
        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        gameState = GameStateManager.calcWinner(gameState)
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
        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        gameState = GameStateManager.calcWinner(gameState)
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
        gameState = GameStateManager.calcWinner(gameState)
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
        gameState = GameStateManager.calcWinner(gameState)
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
        initDom()
        gameState = GameStateManager.InitGame(gameState)
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
                            hand={gameState.hand}
                            message={gameState.message}
                            clickCell={(cellNumber: number) => {
                                ev_mouseClick(cellNumber)
                            }}
                        ></Board>
                    </div>
                    <Panel
                        blueScore={ Math.abs(gameState.blueScore)}
                        redScore={Math.abs(gameState.redScore)}
                        level={gameState.level}
                        setLevel={
                            (x) =>{
                                gameState.level = x
                                setGameState(gameState)
                            }
                        }
                        mode={gameState.mode}
                        newGame={() => { reloadnew() }}
                        prevprev={() => { move_start() }}
                        prev={() => { move_prev() }}
                        next={() => { move_next() }}
                        nextnext={() => { move_end() }}
                        replay={() => { 
                            Util.jumpkento(gameState.startMap,gameState.logArray2,gameState.level)
                         }}
                        tweet={() => { Util.tweetlog(gameState.startMap,gameState.logArray2,gameState.level) }}
                    ></Panel>

                </div>
            </div>
            <Footer></Footer>
        </span >
    );
}
