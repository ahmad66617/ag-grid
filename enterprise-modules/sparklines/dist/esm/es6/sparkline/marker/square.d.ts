import { Marker } from './marker';
export declare class Square extends Marker {
    static className: string;
    isPointInStroke(x: number, y: number): boolean;
    isPointInPath(x: number, y: number): boolean;
    render(ctx: CanvasRenderingContext2D): void;
}
