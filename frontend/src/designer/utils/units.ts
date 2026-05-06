export const LETTER_WIDTH_PT = 612;
export const LETTER_HEIGHT_PT = 792;
export const CANVAS_ZOOM = 0.85;
export const ptToPx = (points: number, zoom = CANVAS_ZOOM) => points * zoom;
export const pxToPt = (pixels: number, zoom = CANVAS_ZOOM) => Math.round(pixels / zoom);
