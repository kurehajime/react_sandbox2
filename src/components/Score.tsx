import { useEffect, useRef } from "react";
import Params from "../params";
type Props = {
    show: boolean
    x: number
    y: number
    h: number
    w: number
    blueScore: number
    redScore: number
}
export default function Score(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)

    /**
     * 盤面を描画してCANVASを返す。
     */
    function drawScore(element: SVGImageElement, canvas: HTMLCanvasElement) {
        // 背景
        const cellSize = Params.CANV_SIZE / 6;
        const ctx_score = canvas.getContext('2d');
        let message = "";
        const fontsize = Math.round(cellSize * 1.5);
        const blue = Params.COLOR_BLUE2;
        const red = Params.COLOR_RED2;
        canvas.width = Params.CANV_SIZE;
        canvas.height = Params.CANV_SIZE;
        if (ctx_score) {
            ctx_score.clearRect(0, 0, Params.CANV_SIZE, Params.CANV_SIZE);

            ctx_score.globalAlpha = 0.4;
            ctx_score.textBaseline = 'middle';
            ctx_score.textAlign = 'center';
            ctx_score.shadowBlur = 10;
            ctx_score.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx_score.font = 'bold ' + fontsize + 'px Play,sans-serif';

            // 文字
            ctx_score.globalAlpha = 0.3;
            ctx_score.shadowBlur = 2;
            ctx_score.shadowColor = 'rgba(255, 255, 255, 1)';
            ctx_score.fillStyle = red;
            message = String(props.redScore);
            ctx_score.beginPath();
            ctx_score.fillText(message, cellSize * 1, cellSize * 3.8);
            // 文字
            message = "8";
            ctx_score.beginPath();
            ctx_score.fillText(message, cellSize * 2, cellSize * 5.3);
            //線
            ctx_score.lineWidth = cellSize * 0.2;
            ctx_score.strokeStyle = red;
            ctx_score.beginPath();
            ctx_score.moveTo(cellSize * 0.4, cellSize * 5.55);
            ctx_score.lineTo(cellSize * 2.6, cellSize * 3.55);
            ctx_score.closePath();
            ctx_score.stroke();


            // 文字
            message = String(props.blueScore);
            ctx_score.fillStyle = blue;
            ctx_score.beginPath();
            ctx_score.fillText(message, cellSize * 4, cellSize * 0.7);
            // 文字
            message = "8";
            ctx_score.beginPath();
            ctx_score.fillText(message, cellSize * 5, cellSize * 2.3);
            // 文字
            ctx_score.lineWidth = cellSize * 0.2;
            ctx_score.strokeStyle = blue;
            ctx_score.beginPath();
            ctx_score.moveTo(cellSize * 3.4, cellSize * 2.55);
            ctx_score.lineTo(cellSize * 5.6, cellSize * 0.55);
            ctx_score.closePath();
            ctx_score.stroke();
        }
        element.setAttribute("href", canvas.toDataURL());
    }

    useEffect(() => {
        if (bg1.current) {
            const canvas = document.createElement("canvas");
            drawScore(bg1.current, canvas);
        }
    }, [props.blueScore, props.redScore, props.show])

    return (<g display={props.show ? "inline" : "none"}>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
    </g >)

}