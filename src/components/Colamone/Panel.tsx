import { Mode } from "../../model/Mode"

type Props = {
    level: number
    blueScore: number
    redScore: number
    setLevel: (level: number) => void
    newGame: () => void
    prevprev: () => void
    prev: () => void
    next: () => void
    nextnext: () => void
    tweet: () => void
    mode: Mode
}

export default function Panel(props: Props) {


    return (<div id="message">
        <div id="head">
            <span id="gamename">colamone</span> by <a href="https://twitter.com/kurehajime">@kurehajime</a><br />
            <span id="blue" className="score">{`Blue: ${props.blueScore}/8`}</span> - <span id="red" className="score">{` Red: ${props.redScore}/8`}</span><span
                id="wins"></span>
        </div>
        <div id="lvs">
            <select id="level" value={props.level} onChange={e => { props.setLevel(parseInt(e.target.value)); }}>
                <option value="1" className="lv">Lv.1</option>
                <option value="2" className="lv">Lv.2</option>
                <option value="3" className="lv">Lv.3</option>
                <option value="4" className="lv">Lv.4</option>
                <option value="5" className="lv">Lv.5</option>
                <option value="6" className="lv">Lv.6</option>
            </select>
            <button type="button" id="newgame" onClick={() => props.newGame()}>New Game</button>
        </div>
        {props.mode === Mode.log &&
            <span id="log">
                <button type="button" id="prevprev"> |&lt; </button>
                <button type="button" id="prev"> &lt; </button>
                <button type="button" id="next"> &gt; </button>
                <button type="button" id="nextnext"> &gt;|</button>
            </span>
        }
        {props.mode === Mode.result &&
            <span id="span_replay">
                <button type="button" id="replay"> View log </button>
            </span>
        }
        {props.mode === Mode.result &&
            <span id="span_tweetlog">
                <button type="button" id="tweetlog"> Tweet result</button>
            </span>
        }
        <div id="collapsible">
            <h5 className="howtoplay"><span id="htp">How to play Colamone</span></h5>
            <div className="manual">
                <p id="manual_en" lang="en">
                    {`(1) Colamone is similar to chess.
But there are some differences.
(2) Each piece can move 1 tile in the direction
of any of it's dots.
(3) If a piece reaches the other side,
you get the points it's worth.
(4) If you reach 8 points, you win.
(5) When a piece reaches the other side, you can
no longer move it and the enemy cannot take it.
(6) When there's no movement available to a player,
the player with the highest score wins.
(7) if the current position on the board
appeared 3 times then the result is a draw.`}</p>
            </div>
            <span id="sns"> <a href="https://twitter.com/share" className="twitter-share-button" data-dnt="true"
                data-url="https://xiidec.appspot.com/colamone/colamone.html" data-hashtags="colamone, boardgames"
                data-lang="en" data-size="default"></a>
            </span>
        </div>
    </div >)

}