import Params from "../params";
import Background from './Background';
import PieceElement from './Piece';

type Props = {
    map: number[]
    hover: number | null
}
type Piece = {
    number: number
    x: number
    y: number
    goal: boolean
    display: string
}
export default function Board(props: Props) {
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
        let pieces = [];
        for (const i of numbers) {
            pieces.push(makePiece(i));
        }
        return pieces;
    }
    const cellNumberToPoint = (width: number, height: number, cellNumber: number) => {
        let cellSize = width / 6;
        let x = ~~(cellNumber / 10) * cellSize;
        let y = ~~(cellNumber % 10) * cellSize;
        return { x, y };
    }
    const mapToPieces = (width: number, height: number, map: number[]): Piece[] => {
        let pieces = makePieces();
        for (let m = 0; m < map.length; m++) {
            for (let p = 0; p < pieces.length; p++) {
                if (pieces[p].number === map[m]) {
                    pieces[p].display = "inline";
                    let { x, y } = cellNumberToPoint(width, height, m);
                    pieces[p].x = x;
                    pieces[p].y = y;
                    let yy = ~~(m % 10);
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
    const mouseMove = (e: React.MouseEvent<SVGSVGElement>) => {

    }

    const pieces = mapToPieces(Params.CANV_SIZE, Params.CANV_SIZE, props.map);
    const hover_piece: Piece[] = []

    return (<svg width={Params.CANV_SIZE} height={Params.CANV_SIZE} onMouseMove={mouseMove} >
        <Background x={0} y={0} w={Params.CANV_SIZE} h={Params.CANV_SIZE} />
        {
            pieces.map(p => {
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
                    x={p.x}
                    y={p.y}
                    number={p.number}
                    goal={p.goal}
                    display={p.display}
                />)
            })
        }
    </svg >)
}