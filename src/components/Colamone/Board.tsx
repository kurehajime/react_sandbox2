import Params from "../../static/params";
import Background from './Background';
import PieceElement from './Piece';
import { useRef, useState } from "react";
import { Piece } from "../../model/Piece";
import Cover from "./Cover";
import Score from "./Score";
import Shadow from "./Shadow";
import Message from "./Message";
import { Hand } from "../../static/rule";

type Props = {
    map: number[]
    hover: number | null
    cover: boolean
    score: boolean
    blueScore: number
    redScore: number
    message: string
    hand: Hand | null
    clickCell: (cellNumber: number) => void
}
export default function Board(props: Props) {
    const svg = useRef<SVGSVGElement>(null)
    const [hoverX, setHoverX] = useState(0)
    const [hoverY, setHoverY] = useState(0)

    const makePiece = (number: number): Piece => {
        return {
            number: number,
            x: 0,
            y: 0,
            goal: false,
            display: "none"
        };
    }
    const makePieces = (): Piece[] => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8];
        const pieces = [];
        for (const i of numbers) {
            pieces.push(makePiece(i));
        }
        return pieces;
    }
    const cellNumberToPoint = (width: number, height: number, cellNumber: number) => {
        const cellSize = width / 6;
        const x = ~~(cellNumber / 10) * cellSize;
        const y = ~~(cellNumber % 10) * cellSize;
        return { x, y };
    }
    const mapToPieces = (width: number, height: number, map: number[]): Piece[] => {
        const pieces = makePieces();
        for (let m = 0; m < map.length; m++) {
            for (let p = 0; p < pieces.length; p++) {
                if (pieces[p].number === map[m]) {
                    pieces[p].display = "inline";
                    const { x, y } = cellNumberToPoint(width, height, m);
                    pieces[p].x = x;
                    pieces[p].y = y;
                    const yy = ~~(m % 10);
                    if (map[m] > 0 && yy === 0) {
                        pieces[p].goal = true;
                    } else if (map[m] < 0 && yy === 5) {
                        pieces[p].goal = true;
                    }
                }
            }
        }
        return pieces;
    }

    const pointToCellNumber = (width: number, height: number, x: number, y: number) => {
        const cellSize = width / 6;
        return Math.floor(x / cellSize) * 10 + Math.floor(y / cellSize);
    }

    const mouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (props.hover == null) {
            return;
        }
        const plus = (Params.CANV_SIZE / 6) / 2;
        setHoverX(e.nativeEvent.offsetX - plus)
        setHoverY(e.nativeEvent.offsetY - plus)
    }
    const mouseClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (svg.current) {
            const cellNumber = pointToCellNumber(
                svg.current.getBoundingClientRect().width,
                svg.current.getBoundingClientRect().height,
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );
            props.clickCell(cellNumber)
            mouseMove(e);
        }
    }

    const pieces = mapToPieces(Params.CANV_SIZE, Params.CANV_SIZE, props.map);
    const hover_piece: Piece[] = []
    if (props.hover) {
        const hp = makePiece(props.hover)
        hp.display = 'inline'
        hover_piece.push(hp)
    }

    return (<svg ref={svg} width={Params.CANV_SIZE} height={Params.CANV_SIZE} onMouseMove={mouseMove} onMouseDown={mouseClick} >
        <Background x={0} y={0} w={Params.CANV_SIZE} h={Params.CANV_SIZE} />
        <Shadow
            map={props.map}
            hand={props.hand}
            x={0}
            y={0}
            w={Params.CANV_SIZE}
            h={Params.CANV_SIZE}
        ></Shadow>
        {
            pieces.filter(p => { return p.number !== props.hover }).map(p => {
                return (
                    <PieceElement
                        key={p.number}
                        x={p.x}
                        y={p.y}
                        number={p.number}
                        goal={p.goal}
                        display={p.display}
                    />
                )
            })
        }
        {
            hover_piece.map(p => {
                return (<PieceElement
                    key={p.number}
                    x={hoverX}
                    y={hoverY}
                    number={p.number}
                    goal={p.goal}
                    display={p.display}
                />)
            })
        }
        <Score
            x={0}
            y={0}
            w={Params.CANV_SIZE}
            h={Params.CANV_SIZE}
            redScore={props.blueScore}
            blueScore={props.redScore}
            show={props.score}
        ></Score>
        <Message
            x={0}
            y={0}
            w={Params.CANV_SIZE}
            h={Params.CANV_SIZE}
            message={props.message}
        ></Message>
        <Cover
            x={0}
            y={0}
            w={Params.CANV_SIZE}
            h={Params.CANV_SIZE}
            show={props.cover}
            demo_inc={0}
        ></Cover>
    </svg >)
}