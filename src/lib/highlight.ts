// Turns **bold** and money amounts into marker-highlighted HTML.
// Only use with trusted, static text (our own content), never user input.
export function highlightText(line: string): string {
    let t = line.replace(/\*\*([^*]+)\*\*/g, '<mark class="hl">$1</mark>');
    t = t.replace(
        /(^|[\s(])([$€£]\s?\d[\d,.]*(?:\s?-\s?[$€£]?\d[\d,.]*)?(?:\/(?:month|mo|day|year)(?![a-z]))?)/g,
        '$1<mark class="hl-num">$2</mark>'
    );
    return t;
}
