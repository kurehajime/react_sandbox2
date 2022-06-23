import { atom } from 'recoil';
import { GameState } from './model/GameState';
import { Mode } from './model/Mode';

export const $GameState = atom<GameState>({
  key: 'GameState',
  default: {
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
  },
});