import { useEffect, useState } from 'react';
import Board from './Board';
import Panel from './Panel';
import Footer from './Footer';
import Header from './Header';
import { $auto_log, $blueScore, $cover, $demo, $goaled, $hand, $hover, $level, $log_pointer, $map, $map_list, $message, $mode, $redScore, $thinktime, $turn_player, $winner, $wins } from '../GameState';
import { useRecoilState } from 'recoil';
import { Hand, MapArray, Rule } from '../logic/rule';
import Cookie from '../logic/cookie';
import { Aijs } from '../logic/ai';

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

        zoom(); // 小さい端末でズーム
        manual(window.innerHeight < window.innerWidth);

        setTurnPlayer(1)
        setDemo(true)

        window.addEventListener('orientationchange', zoom);

        shuffleBoard();

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
        const paramObj = getParam();

        // 盤面を初期化
        if (paramObj.init) {
            setStartMap(getMapByParam(paramObj.init))
            setMap(Rule.copyMap(startMap))
        } else {
            setStartMap(map)
        }
        // ログをデコード
        if (paramObj.log) {
            setLogArray(decodeLog(paramObj.log, startMap))
        }
        // レベル取得
        if (paramObj.lv) {
            setLevel(parseInt(paramObj.lv));
        }

        logMenu(logArray.length !== 0);

        updateMessage();
        setTweet(); // ツイートボタンを生成

        if (logArray.length === 0) {
            if (isBot() == false) {
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
                if (isGoaled(target, turnPlayer)) {
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
        const count = getNodeCount(map) / 2;
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

        const hand = Aijs.thinkAI(map, turnPlayer, level + plus + 1, undefined, undefined, undefined)[0];
        if (hand) {
            setHand(hand);
            if (isGoaled(hand[1], turnPlayer)) {
                setGoaled(true)
                setTimeout(() => {
                    setGoaled(false)
                }, 2000);
            }
            const _map = map.slice()
            _map[hand[1]] = map[hand[0]];
            _map[hand[0]] = 0;
            setMap(_map)
            setLogArray2(logArray2.concat([hand[0], hand[1]]))
        }
        setTurnPlayer(turnPlayer * -1)
        endTime = new Date();
        setThinktime((endTime.getTime() - startTime.getTime()) / 1000)
    }
    /** 
     * ゴールしたか
     */
    const isGoaled = (afterHand: number, turn: number) => {
        if (turn > 0) {
            if (afterHand % 10 === 0) {
                return true;
            }
        } else if (turn < 0) {
            if (afterHand % 10 === 5) {
                return true;
            }
        }

        return false;
    }
    /** 
     * 盤面をシャッフル。
     */
    const shuffleBoard = () => {
        const _map = new Int8Array([
            -1, 0, 0, 0, 0, 6, 0, 0, 0, 0, -2, -8,
            0, 0, 7, 5, 0, 0, 0, 0, -3, 0, 0, 0,
            0, 4, 0, 0, 0, 0, -4, 0, 0, 0, 0,
            3, 0, 0, 0, 0, -5, -7, 0, 0, 8, 2,
            0, 0, 0, 0, -6, 0, 0, 0, 0, 1
        ]);
        for (const num in _map) {
            _map[num] = 0;
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
            _map[blue_num[num]] = arr[num];
        }
        for (const num in red_num) {
            _map[red_num[num]] = -1 * arr[num];
        }
        setMap(_map);
        setStartMap(_map)
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
        if (isNoneNode(map)) {
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
     * 手詰まり判定。
     */
    const isNoneNode = (wkMap: MapArray) => {
        let flag1 = false;
        let flag2 = false;
        for (const panel_num in wkMap) {
            if (wkMap[panel_num] === 0) {
                continue;
            }
            const canMove = Rule.getCanMovePanelX(parseInt(panel_num), wkMap);
            if (canMove.length !== 0) {
                if (wkMap[panel_num] > 0) {
                    flag1 = true;
                } else if (wkMap[panel_num] < 0) {
                    flag2 = true;
                }
            }
            if (flag1 && flag2) {
                return false;
            }
        }
        return true;
    }



    /** 
     * 手の数を取得
     */
    const getNodeCount = (wkMap: MapArray) => {
        let count = 0;
        for (const panel_num in wkMap) {
            if (wkMap[panel_num] === 0) {
                continue;
            }
            const canMove = Rule.getCanMovePanelX(parseInt(panel_num), wkMap);
            count += canMove.length;
        }
        return count;
    }


    /** 
     * パラメータ取得
     */
    const getParam = () => {
        const obj: any = {};
        if (1 < document.location.search.length) {
            const paramstr = document.location.search.substring(1).split('&');
            for (let i = 0; i < paramstr.length; i++) {
                const entry = paramstr[i].split('=');
                const key = decodeURIComponent(entry[0]);
                const value = decodeURIComponent(entry[1]);
                obj[key] = decodeURIComponent(value);
            }
        }
        return obj;
    }

    /** 
     * パタメータから初期配置を取得
     */
    const getMapByParam = (initString: string): MapArray => {
        let wkMap;
        if (initString) {
            wkMap = Rule.copyMap(map);
            // クリア
            for (const num in wkMap) {
                wkMap[num] = 0;
            }
            let arr = initString.split(',');
            if (arr.length < 8) {
                arr = ["1", "2", "3", "4", "5", "6", "7", "8"];
            }
            const red_num = [0, 10, 20, 30, 40, 50, 11, 41];
            const blue_num = [55, 45, 35, 25, 15, 5, 44, 14];

            for (const num in blue_num) {
                wkMap[blue_num[num]] = parseInt(arr[num]);
            }
            for (const num in red_num) {
                wkMap[red_num[num]] = -1 * parseInt(arr[num]);
            }
        }

        return wkMap as MapArray;
    }
    /** 
     * ログをデコード。
     */
    const decodeLog = (logstr: string, wkInitMap: MapArray) => {
        const wklogArray = [];
        let wkMap = Rule.copyMap(wkInitMap);
        const arrow: { [index: string]: number; } = {
            'q': 0, 'w': 1, 'e': 2,
            'a': 3, 's': 4, 'd': 5,
            'z': 6, 'x': 7, 'c': 8
        };
        logstr = logstr.replace(/q/g, 'q,').replace(/w/g, 'w,').replace(/e/g, 'e,');
        logstr = logstr.replace(/a/g, 'a,').replace(/s/g, 's,').replace(/d/g, 'd,');
        logstr = logstr.replace(/z/g, 'z,').replace(/x/g, 'x,').replace(/c/g, 'c,');
        const logArr = logstr.split(',');

        wklogArray.push(wkMap);
        for (let i = 0; i < logArr.length; i++) {
            if (logArr[i] === '') { continue; }
            const arw = arrow[logArr[i].match(/[qweasdzxc]/)![0]];
            const from = parseInt(logArr[i].match(/\d*/)![0]);
            const to = (Math.floor(from / 10) + Math.floor(arw % 3) - 1) * 10 +
                (Math.floor(from % 10) + Math.floor(arw / 3) - 1);
            wkMap = Rule.copyMap(wkMap);
            wkMap[to] = wkMap[from];
            wkMap[from] = 0;
            wklogArray.push(wkMap);
        }
        return wklogArray;
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
        const paramObj = getParam();
        if (paramObj.lang) {
            url += '?lang=' + paramObj.lang;
        }
        if (navigator.onLine) {
            location.href = url;
        } else {
            setMap(Rule.copyMap(startMap))
            shuffleBoard();
            setLogArray2([])
            setMessage('')
            setWinner(null)
            setTurnPlayer(1)
        }
    }

    /** 
     * botかどうか判定
     */
    const isBot = () => {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf('bot') != -1 ||
            ua.indexOf('lighthouse') != -1 ||
            ua.indexOf('headless') != -1) {
            return true;
        }
        return false;
    }

    /** 
     * ツイートボタンを読み込む。
     */
    const setTweet = () => {
        /*jshint -W030 */
        (function f(d: any, s: string, id: string) {
            // eslint-disable-next-line prefer-const
            let js, fjs = d.getElementsByTagName(s)[0];
            if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.async = true; js.src = 'https://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); }
        })(document, 'script', 'twitter-wjs');
    }
    /** 
     * ログをツイートする。
     */
    const tweetlog = (startMap: MapArray, logArray2: Array<Hand>, level: number) => {
        const url = document.location.href.split('?')[0];
        const init = '?init=' + startMap[55] + ',' +
            startMap[45] + ',' +
            startMap[35] + ',' +
            startMap[25] + ',' +
            startMap[15] + ',' +
            startMap[5] + ',' +
            startMap[44] + ',' +
            startMap[14];
        let log = '%26log=' + encodeLog(logArray2);
        log += '%26lv=' + level;
        window.open('https://twitter.com/intent/tweet?text=' + url + init + log + '%20%23colamone');
    }

    /** 
     * 検討画面に飛ぶ
     */
    const jumpkento = (startMap: MapArray, logArray2: Array<Hand>, level: number) => {
        const url = document.location.href.split('?')[0];
        const init = '?init=' + startMap[55] + ',' +
            startMap[45] + ',' +
            startMap[35] + ',' +
            startMap[25] + ',' +
            startMap[15] + ',' +
            startMap[5] + ',' +
            startMap[44] + ',' +
            startMap[14];
        let log = '&log=' + encodeLog(logArray2);
        log += '&lv=' + level;
        location.href = url + init + log;
    }


    /** 
     * ログをエンコード
     */
    const encodeLog = (wklogArray: Hand[]) => {
        let logstr = '';
        for (const i in wklogArray) {
            const from = wklogArray[i][0];
            const to = wklogArray[i][1];
            const x_vec = ((Math.floor(to / 10)) - Math.floor(from / 10));
            const y_vec = ((Math.floor(to % 10)) - Math.floor(from % 10));
            let arw = '';
            if (x_vec === -1 && y_vec === -1) { arw = 'q'; }
            if (x_vec === 0 && y_vec === -1) { arw = 'w'; }
            if (x_vec === 1 && y_vec === -1) { arw = 'e'; }
            if (x_vec === -1 && y_vec === 0) { arw = 'a'; }
            if (x_vec === 0 && y_vec === 0) { arw = 's'; }
            if (x_vec === 1 && y_vec === 0) { arw = 'd'; }
            if (x_vec === -1 && y_vec === 1) { arw = 'z'; }
            if (x_vec === 0 && y_vec === 1) { arw = 'x'; }
            if (x_vec === 1 && y_vec === 1) { arw = 'c'; }
            logstr += from + arw;
        }
        return logstr;
    }

    const updateScore = (blue: number, red: number, time: number | null = null, wins: number | null = null) => {
        document.querySelector('#blue')!.innerHTML = 'Blue: ' + blue + '/8';
        document.querySelector('#red')!.innerHTML = ' Red: ' + red + '/8';
        document.querySelector('#time')!.innerHTML = time === null ? '' : '(' + (time.toFixed(3)) + 'sec)';
        document.querySelector('#wins')!.innerHTML = wins === null ? '' : wins + ' win!';
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
    /** 
     * 小さい画面ではViewportを固定化
     */
    const zoom = () => {
        const viewport = document.querySelector('meta[name=viewport]');
        if (screen.width < 500 && screen.height < 500) {
            if (screen.width < screen.height) {
                viewport?.setAttribute('content', 'width=500,user-scalable=no');
            } else {
                viewport?.setAttribute('content', 'height=500,user-scalable=no');
            }
        } else if (screen.width < 500) {
            viewport?.setAttribute('content', 'width=500,user-scalable=no');
        } else if (screen.height < 500) {
            viewport?.setAttribute('content', 'height=500,user-scalable=no');
        }
        // iOS9のViewportはなぜか機能してくれない。
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            let w = screen.width;
            let w2 = 520;
            if (Math.abs(window.orientation as number) !== 0) {
                w = screen.height;
                w2 = 900;
            }
            let rate = Math.round((w / w2) * 1000) / 1000.0;
            if (rate == Math.round(rate)) { // iOS 9のViewportは整数指定すると機能しない
                rate += 0.0001;
            }

            viewport?.setAttribute(
                'content',
                'initial-scale=' + rate + ', minimum-scale=' + rate + ', maximum-scale=' + rate + ', user-scalable=no'
            );
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
