import { Hand, MapArray } from "../static/Rule"
import { Mode } from "./Mode"

export type GameState = {
    turnPlayer:number
    map:Int8Array
    startMap:Int8Array
    hover:number | null
    demo:boolean
    auto_log:boolean
    hand:Hand | null
    message:string
    blueScore:number
    redScore:number
    level:number
    wins:number
    log_pointer:number
    thinktime:number | null
    winner:number | null
    mapList:{ [index: string]: number; }
    mode:Mode
    logArray:Array<MapArray>
    logArray2:Array<Hand>
    logPointer:number
}