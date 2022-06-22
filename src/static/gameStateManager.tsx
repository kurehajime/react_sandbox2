import { GameState } from "../model/GameState"
import { Mode } from "../model/Mode";
import cookie from "./Cookie";
import { Rule } from "./Rule";
import { Util } from "./Util";

export default class GameStateManager{
    static InitGame(_gameState: GameState,cookie:cookie): GameState  {
        let gameState ={..._gameState}
        gameState.turnPlayer = 1
        gameState.demo = true
    
    
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
    
        if(gameState.logArray.length !== 0){
            gameState.mode = Mode.log
        }
        
        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        Util.setTweet(); // ツイートボタンを生成
    
        if (gameState.logArray.length !== 0) {
            gameState.demo =false
            gameState.auto_log=true
        }
        gameState = GameStateManager.calcWinner(gameState,cookie)
        return gameState
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
     static calcWinner(_gameState:GameState,cookie:cookie):GameState{
        let gameState=GameStateManager.calcScore({..._gameState});
        
        if (gameState.logArray.length === 0) {
            if (gameState.winner == 1) {
                gameState.message = 'You win!'
                cookie.storage.setItem('level_' + gameState.level,
                    parseInt(cookie.storage.getItem('level_' + gameState.level)) + 1);
                    gameState = GameStateManager.endgame(gameState);
            } else if (gameState.winner == -1) {
                gameState.message ='You lose...'
                cookie.storage.setItem('level_' + gameState.level, 0);
                gameState = GameStateManager.endgame(gameState);
            } else if (gameState.winner === 0) {
                if (gameState.mapList[JSON.stringify(gameState.map)] >= Rule.LIMIT_1000DAY) {
                    gameState.message ='3fold repetition'
                } else {
                    gameState.message ='-- Draw --'
                }
                gameState = GameStateManager.endgame(gameState);
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