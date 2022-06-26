import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();


    return (<div id="message">
        <div id="head">
            <span id="gamename">{t('colamone')}</span> by <a href="https://twitter.com/kurehajime">@kurehajime</a><br />
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
                <button type="button" id="replay"> {t('replay')} </button>
            </span>
        }
        {props.mode === Mode.result &&
            <span id="span_tweetlog">
                <button type="button" id="tweetlog"> {t('tweetlog')}</button>
            </span>
        }
        <div id="collapsible">
            <h5 className="howtoplay"><span id="htp">{t('howtoplay')}</span></h5>
            <div className="manual">
                <p id="manual_en" lang="en">
                    {t('manual')}</p>
            </div>
            <span id="sns"> <a href="https://twitter.com/share" className="twitter-share-button" data-dnt="true"
                data-url="https://xiidec.appspot.com/colamone/colamone.html" data-hashtags="colamone, boardgames"
                data-lang="en" data-size="default"></a>
            </span>
        </div>
    </div >)

}