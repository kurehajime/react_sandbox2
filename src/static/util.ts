import { GameState } from "../model/GameState";
import Cookie from '../static/cookie';
import { Hand, MapArray, Rule } from "./rule";

export class Util {

    /** 
     * パラメータ取得
     */
    static getParam(): any {
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
    static getMapByParam(map: Int8Array, initString: string): MapArray {
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
    static decodeLog(logstr: string, wkInitMap: MapArray) {
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
     * botかどうか判定
     */
    static isBot() {
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
    static setTweet() {
        /*jshint -W030 */
        (function f(d: any, s: string, id: string) {
            // eslint-disable-next-line prefer-const
            let js, fjs = d.getElementsByTagName(s)[0];
            if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.async = true; js.src = 'https://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); }
        })(document, 'script', 'twitter-wjs');
    }

    /** 
     * ログをエンコード
     */
    static encodeLog(wklogArray: Hand[]) {
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
    /** 
     * ログをツイートする。
     */
    static tweetlog = (startMap: MapArray, logArray2: Array<Hand>, level: number) => {
        const url = document.location.href.split('?')[0];
        const init = '?init=' + startMap[55] + ',' +
            startMap[45] + ',' +
            startMap[35] + ',' +
            startMap[25] + ',' +
            startMap[15] + ',' +
            startMap[5] + ',' +
            startMap[44] + ',' +
            startMap[14];
        let log = '%26log=' + Util.encodeLog(logArray2);
        log += '%26lv=' + level;
        window.open('https://twitter.com/intent/tweet?text=' + url + init + log + '%20%23colamone');
    }

    /** 
     * 検討画面に飛ぶ
     */
    static jumpkento(startMap: MapArray, logArray2: Array<Hand>, level: number) {
        const url = document.location.href.split('?')[0];
        const init = '?init=' + startMap[55] + ',' +
            startMap[45] + ',' +
            startMap[35] + ',' +
            startMap[25] + ',' +
            startMap[15] + ',' +
            startMap[5] + ',' +
            startMap[44] + ',' +
            startMap[14];
        let log = '&log=' + Util.encodeLog(logArray2);
        log += '&lv=' + level;
        location.href = url + init + log;
    }

    /** 
     * 小さい画面ではViewportを固定化
     */
    static zoom() {
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

    /** 
     * 得点計算。
     */
     static calcScore(_gameState:GameState):GameState{
        const gameState={..._gameState}
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
        return gameState
    }

    /** 
     * メッセージを更新
     */
     static calcWinner(_gameState:GameState,cookie:Cookie):GameState{
        let gameState=Util.calcScore({..._gameState});
        
        if (gameState.logArray.length === 0) {
            if (gameState.winner == 1) {
                gameState.message = 'You win!'
                cookie.storage.setItem('level_' + gameState.level,
                    parseInt(cookie.storage.getItem('level_' + gameState.level)) + 1);
                    gameState = Util.endgame(gameState);
            } else if (gameState.winner == -1) {
                gameState.message ='You lose...'
                cookie.storage.setItem('level_' + gameState.level, 0);
                gameState = Util.endgame(gameState);
            } else if (gameState.winner === 0) {
                if (gameState.mapList[JSON.stringify(gameState.map)] >= Rule.LIMIT_1000DAY) {
                    gameState.message ='3fold repetition'
                } else {
                    gameState.message ='-- Draw --'
                }
                gameState = Util.endgame(gameState);
            }
        }

        if (cookie.storage.getItem('level_' + gameState.level) > 0) {
            gameState.wins = cookie.storage.getItem('level_' + gameState.level)
        }
        return gameState
    }
    static endgame(_gameState:GameState):GameState{
        const gameState={..._gameState}
        // if (gameState.logArray.length === 0) {
        //     document.querySelector('#span_replay')?.classList.remove("hide");
        //     document.querySelector('#span_tweetlog')?.classList.remove("hide");
        // }
        return gameState
    }


}