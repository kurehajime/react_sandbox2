import { GameState } from "../model/GameState"
import { Mode } from "../model/Mode";
import { Aijs } from "./Ai";
import Cookie from "./Cookie";
import cookie from "./Cookie";
import { Rule } from "./Rule";
import { Util } from "./Util";

export default class GameStateManager{
    static InitGame(_gameState: GameState): GameState  {
        let gameState ={..._gameState}
        gameState.turnPlayer = 1
        gameState.demo = true
    
    
        const _map = Rule.shuffleBoard()
        gameState.map = _map
        gameState.startMap = _map
    
        // 連勝記録初期化
        if (!Cookie.getItem('level_1')) {
            Cookie.setItem('level_1', 0);
        }
        if (!Cookie.getItem('level_2')) {
            Cookie.setItem('level_2', 0);
        }
        if (!Cookie.getItem('level_3')) {
            Cookie.setItem('level_3', 0);
        }
        if (!Cookie.getItem('level_4')) {
            Cookie.setItem('level_4', 0);
        }
        if (!Cookie.getItem('level_5')) {
            Cookie.setItem('level_5', 0);
        }
        // レベル記憶
        if (Cookie.getItem('level_save') !== undefined && Cookie.getItem('level_save') !== 'undefined' && Cookie.getItem('level_save') !== null) {
            gameState.level = parseInt(Cookie.getItem('level_save'))
        } else {
            Cookie.setItem('level_save', 1);
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
    

        gameState = GameStateManager.calcWinner(gameState)
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
     static calcWinner(_gameState:GameState):GameState{
        let gameState=GameStateManager.calcScore({..._gameState});
        
        if (gameState.logArray.length === 0) {
            if (gameState.winner == 1) {
                gameState.message = 'You win!'
                Cookie.setItem('level_' + gameState.level,
                    parseInt(Cookie.getItem('level_' + gameState.level)) + 1);
                    gameState = GameStateManager.endgame(gameState);
            } else if (gameState.winner == -1) {
                gameState.message ='You lose...'
                Cookie.setItem('level_' + gameState.level, 0);
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

        if (Cookie.getItem('level_' + gameState.level) > 0) {
            gameState.wins = Cookie.getItem('level_' + gameState.level)
        }
        return gameState
    }
    static endgame(_gameState:GameState):GameState{
        const gameState={..._gameState}
        gameState.mode = Mode.result
        return gameState
    }
    static ai(_gameState:GameState):GameState{
        let gameState=GameStateManager.calcScore({..._gameState});
        const startTime = new Date();
        let endTime = null;
        // 終盤になったら長考してみる。
        const count = Rule.getNodeCount(gameState.map) / 2;
        let plus = 0;
        switch (gameState.level) {
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

        const _hand = Aijs.thinkAI(gameState.map, gameState.turnPlayer, gameState.level + plus + 1, undefined, undefined, undefined)[0];
        if (_hand) {
            const _map = gameState.map.slice()
            _map[_hand[1]] = gameState.map[_hand[0]];
            _map[_hand[0]] = 0;
            gameState.map = _map
            gameState.logArray2 = gameState.logArray2.concat([[_hand[0], _hand[1]]])
        }
        gameState.turnPlayer= (gameState.turnPlayer * -1)
        endTime = new Date();
        gameState.thinktime = ((endTime.getTime() - startTime.getTime()) / 1000)
        gameState.message = ''
        gameState.mapList = Rule.add1000day(gameState.map,gameState.mapList)
        gameState = GameStateManager.calcWinner(gameState)
        return gameState
    }

}