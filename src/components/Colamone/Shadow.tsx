import { useEffect, useRef } from "react";
import Params from "../../static/params";
import { Hand } from "../../static/rule";
type Props = {
    map: number[]
    x: number
    y: number
    h: number
    w: number
    hand: Hand | null
}
export default function Shadow(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)

    /**
     * 盤面を描画してCANVASを返す。
     */
    function drawShadow(element: SVGImageElement, canvas: HTMLCanvasElement) {
        const ctx_shadow = canvas.getContext('2d');
        const canvSize = Params.CANV_SIZE * 3;
        const cellSize = (Params.CANV_SIZE / 6) * 3;
        canvas.width = canvSize;
        canvas.height = canvSize;
        if (ctx_shadow) {
            ctx_shadow.clearRect(0, 0, canvSize, canvSize);
            if (!props.hand) {
                element.setAttribute("href", canvas.toDataURL());
                return;
            }
            if (props.hand.length !== 2) {
                element.setAttribute("href", canvas.toDataURL());
                return;
            }
            const x0 = (props.hand[0] / 10 | 0);
            const y0 = props.hand[0] % 10;
            const x1 = (props.hand[1] / 10 | 0);
            const y1 = props.hand[1] % 10;
            const h = cellSize - 1 * cellSize / 5;
            const w = cellSize - 1 * cellSize / 5;
            let x = x1 * cellSize + cellSize / 10;
            let y = y1 * cellSize + cellSize / 10;
            let shadow_start_x = x + w / 2;
            let shadow_start_y = y + h / 2;
            let shadow_end_x = shadow_start_x;
            let shadow_end_y = shadow_start_y;
            const number = props.map[props.hand[1]];
            let wkColor = '';
            let center = 0;
            let grad;
            if (number > 0) {
                wkColor = Params.COLOR_BLUE; // "#EAEFFD";   
            } else {
                wkColor = Params.COLOR_RED; // "#FDEAFA";           
            }
            if (x0 == x1 || y0 == y1) { // 直角移動
                if ((x0 + y0) % 2 === 0 && y0 !== 0 && y0 != 5) {
                    center = 0.5;
                } else {
                    center = 0.3;
                }
                if (x0 < x1) {
                    x = x - w + 10;
                    shadow_end_x = shadow_end_x - w;
                }
                if (x0 > x1) {
                    x = x + w - 10;
                    shadow_end_x = shadow_end_x + w;
                }
                if (y0 < y1) {
                    y = y - h + 10;
                    shadow_end_y = shadow_end_y - h;
                }
                if (y0 > y1) {
                    y = y + h - 10;
                    shadow_end_y = shadow_end_y + h;
                }
                grad = ctx_shadow.createLinearGradient(shadow_start_x, shadow_start_y, shadow_end_x, shadow_end_y);

                grad.addColorStop(0, wkColor);
                grad.addColorStop(center, wkColor);
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx_shadow.fillStyle = grad;
                ctx_shadow.fillRect(x, y, h, w);
            } else { // 斜め移動
                if ((x0 + y0) % 2 === 0 && y0 !== 0 && y0 != 5) {
                    center = 0.3;
                } else {
                    center = 0.5;
                }
                let [px1, py1, px2, py2, px3, py3, px4, py4] = [0, 0, 0, 0, 0, 0, 0, 0];
                if (x0 < x1 && y0 < y1) {
                    px1 = x;
                    py1 = y - h;
                    px2 = x + w;
                    py2 = y;
                    px3 = x;
                    py3 = y + h;
                    px4 = x - w;
                    py4 = y;
                    shadow_end_x = shadow_end_x - w;
                    shadow_end_y = shadow_end_y - h;
                    shadow_start_x = shadow_start_x + w * 2;
                    shadow_start_y = shadow_start_y + h * 2;
                }
                if (x0 > x1 && y0 > y1) {
                    px1 = x + w;
                    py1 = y;
                    px2 = x + w + w;
                    py2 = y + h;
                    px3 = x + w;
                    py3 = y + h + h;
                    px4 = x;
                    py4 = y + h;
                    shadow_end_x = shadow_end_x + w;
                    shadow_end_y = shadow_end_y + h;
                    shadow_start_x = shadow_start_x - w * 2;
                    shadow_start_y = shadow_start_y - h * 2;
                }
                if (x0 < x1 && y0 > y1) {
                    px1 = x;
                    py1 = y;
                    px2 = x + w;
                    py2 = y + h;
                    px3 = x;
                    py3 = y + h + h;
                    px4 = x - w;
                    py4 = y + h;
                    shadow_end_x = shadow_end_x - w;
                    shadow_end_y = shadow_end_y + h;
                    shadow_start_x = shadow_start_x + w * 2;
                    shadow_start_y = shadow_start_y - h * 2;
                }
                if (x0 > x1 && y0 < y1) {
                    px1 = x + w;
                    py1 = y - h;
                    px2 = x + w + w;
                    py2 = y;
                    px3 = x + w;
                    py3 = y + h;
                    px4 = x;
                    py4 = y;
                    shadow_end_x = shadow_end_x + w;
                    shadow_end_y = shadow_end_y - h;
                    shadow_start_x = shadow_start_x - w * 2;
                    shadow_start_y = shadow_start_y + h * 2;
                }
                ctx_shadow.beginPath();
                ctx_shadow.moveTo(px1, py1);
                ctx_shadow.lineTo(px2, py2);
                ctx_shadow.lineTo(px3, py3);
                ctx_shadow.lineTo(px4, py4);
                ctx_shadow.lineTo(px1, py1);
                ctx_shadow.closePath();
                grad = ctx_shadow.createLinearGradient(shadow_start_x, shadow_start_y, shadow_end_x, shadow_end_y);
                grad.addColorStop(0, wkColor);
                grad.addColorStop(center, wkColor);
                grad.addColorStop(0.97, 'rgba(255, 255, 255, 0)');
                ctx_shadow.fillStyle = grad;
                ctx_shadow.fill();
            }
        }

        element.setAttribute("href", canvas.toDataURL());
    }

    useEffect(() => {
        if (bg1.current) {
            const canvas = document.createElement("canvas");
            drawShadow(bg1.current, canvas);
        }
    }, [props.map, props.hand])

    return (<g className="piece_shadow" display={props.hand?.length === 2 ? "inline" : "none"}>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
    </g >)

}