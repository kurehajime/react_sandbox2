import { useEffect, useRef } from "react";
import Params from "../params";
import bg from '../bk.gif';

type Props = {
    x: number
    y: number
    number: number
    goal: boolean
    display: string
}

export default function Piece(props: Props) {
    const piece1 = useRef<SVGImageElement>(null)
    const piece2 = useRef<SVGImageElement>(null)

    let canvas = document.createElement("canvas");
    let canv_bk = document.createElement("canvas");

    // 角丸
    const fillRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, 0, false);
        ctx.lineTo(x + w, y + h - r);
        ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5, false);
        ctx.lineTo(x + r, y + h);
        ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI, false);
        ctx.lineTo(x, y + r);
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
        ctx.closePath();
        ctx.fill();
    };
    const drawPiece1 = (element: SVGImageElement, canvas: HTMLCanvasElement, number: number, goal: boolean, img_bk: HTMLImageElement | null = null) => {
        let cellSize = (Params.CANV_SIZE / 6) * 3;
        canvas.width = (Params.CANV_SIZE / 6) * 3;
        canvas.height = (Params.CANV_SIZE / 6) * 3;
        let ctx = canvas.getContext("2d");
        let color;
        let x = 0;
        let y = 0;
        // 外枠を描画
        if (number === 0) {
            return ctx;
        } else if (number > 0) {
            color = Params.COLOR_BLUE;
        } else {
            color = Params.COLOR_RED;
        }
        if (ctx) {
            let grad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
            grad.addColorStop(0, "rgb(255, 255, 255)");
            grad.addColorStop(0.4, color);
            grad.addColorStop(1, color);
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(0, 0, 0, 1)";
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillStyle = grad;
            ctx.beginPath();
            fillRoundRect(
                ctx,
                x + cellSize / 10,
                y + cellSize / 10,
                cellSize - (1 * cellSize) / 5,
                cellSize - (1 * cellSize) / 5,
                cellSize / 20
            );
            ctx.shadowColor = "rgba(0, 0, 0, 0)";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            // 曇りエフェクト
            if (img_bk != null) {
                ctx.globalAlpha = 0.35;
                ctx.save();
                ctx.clip();
                ctx.drawImage(
                    drawBk(img_bk),
                    x + cellSize / 10,
                    y + cellSize / 10,
                    cellSize - (1 * cellSize) / 5,
                    cellSize - (1 * cellSize) / 5
                );
                ctx.restore();
                ctx.globalAlpha = 1;
            }
        }
        element.setAttribute("href", canvas.toDataURL());
    };
    const drawPiece2 = (element: SVGImageElement, canvas: HTMLCanvasElement, number: number, goal: boolean) => {
        let cellSize = (Params.CANV_SIZE / 6) * 3;
        canvas.width = (Params.CANV_SIZE / 6) * 3;
        canvas.height = (Params.CANV_SIZE / 6) * 3;
        let ctx = canvas.getContext("2d");
        let x = 0;
        let y = 0;
        if (ctx) {
            // 文字を描画。
            ctx.fillStyle = Params.COLOR_WHITE;
            let fontsize = Math.round(cellSize * 0.18);
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.font = fontsize + "pt 'Play',Arial";
            ctx.beginPath();
            // 数字を印字
            ctx.fillText(Math.abs(number).toString(), x + cellSize / 2, y + cellSize / 2);
            // 点を描画
            for (let i = 0; i <= Params.PIECES[number + 8].length - 1; i++) {
                if (Params.PIECES[number + 8][i] === 0) {
                    continue;
                }
                let x_dot =
                    x +
                    cellSize / 4.16 +
                    (Math.floor(cellSize - (1 * cellSize) / 5) / 3) * Math.floor(i % 3.0);
                let y_dot =
                    y +
                    cellSize / 4.16 +
                    (Math.floor(cellSize - (1 * cellSize) / 5) / 3) * Math.floor(i / 3.0);
                ctx.fillStyle = Params.COLOR_WHITE;
                ctx.beginPath();
                ctx.arc(x_dot, y_dot, cellSize * 0.06, 0, Math.PI * 2, false);
                ctx.fill();
            }
            if (goal) {
                // 得点を印字
                ctx.shadowBlur = 10;
                ctx.shadowColor = "rgba(0, 0, 0, 1)";
                ctx.globalAlpha = 1;
                ctx.fillStyle = Params.COLOR_WHITE;
                fontsize = Math.round(cellSize * 0.5);
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.font = "bolder " + fontsize + "pt Play,Arial ";
                ctx.beginPath();
                ctx.fillText(Math.abs(number).toString(), x + cellSize / 2, y + cellSize / 2);
                ctx.globalAlpha = 1;
                ctx.shadowColor = "rgba(0, 0, 0, 0)";
                ctx.shadowBlur = 0;
            }
        }

        element.setAttribute("href", canvas.toDataURL());
    }
    const drawBk = (img_bk: HTMLImageElement) => {
        let ctx_bk = canv_bk.getContext("2d");
        if (ctx_bk) {
            ctx_bk.drawImage(
                img_bk,
                0,
                0,
                Params.CANV_SIZE / Params.RATIO,
                Params.CANV_SIZE / Params.RATIO,
                0,
                0,
                Params.CANV_SIZE,
                Params.CANV_SIZE
            );
        }
        return canv_bk;
    };

    let img_bk = new Image();
    img_bk.src = bg;

    useEffect(() => {
        if (piece1.current && piece2.current) {
            drawPiece1(piece1.current, canvas, props.number, props.goal);
            drawPiece2(piece2.current, canvas, props.number, props.goal);
            // 背景画像の読み込みが完了したら再実行
            img_bk.onload = () => {
                if (piece1.current) {
                    drawPiece1(piece1.current, canvas, props.number, props.goal, img_bk);
                }
            };
            if (img_bk.width !== 0) {
                drawPiece1(piece1.current, canvas, props.number, props.goal, img_bk);
            }
        }
    })

    return (<g>
        <image ref={piece1} className="piece1" x={props.x} y={props.y} width="83" height="83" display={props.display} />
        <image ref={piece2} className="piece2" x={props.x} y={props.y} width="83" height="83" display={props.display} />
    </g>)
}