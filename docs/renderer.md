# QuestPDF Renderer

The backend translates schema nodes directly into QuestPDF primitives. It does not render HTML and does not parse arbitrary CSS.

Phase 1 renders a single Letter page with zero margin and places schema elements in QuestPDF layers using x/y/width/height point coordinates. The renderer dispatches by element type and applies basic font, color, background, padding, border, line, table, and binding behavior.

Unsupported node types render a red fallback if they reach the renderer, allowing future schema evolution without renderer crashes.
