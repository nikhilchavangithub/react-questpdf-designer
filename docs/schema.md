# Versioned Document Schema

Phase 1 uses a schema-first contract rather than HTML/CSS conversion. The React designer stores a `DocumentSchema` with stable element IDs, point-based Letter page settings, template data, and absolute elements.

Supported Phase 1 element types are `text`, `box`, `line`, `image`, and `table`. The schema also reserves `container`, `row`, `column`, and `absolute` for later flow and mixed-mode work.

Validation covers required version/page settings, unique IDs, supported element types, absolute x/y/width/height values, text content, and hex colors.
