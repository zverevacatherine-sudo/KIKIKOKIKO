// Utility functions

// Load image helper
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Load multiple images
async function loadImages(sources) {
    const promises = sources.map(src => loadImage(src));
    return Promise.all(promises);
}

// Check collision between two rectangles
function rectCollide(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Check if point is inside rectangle
function pointInRect(x, y, rect) {
    if (!rect) return false;
    return x >= rect.x && 
           x <= rect.x + rect.width &&
           y >= rect.y && 
           y <= rect.y + rect.height;
}

// Check if point is inside circle
function pointInCircle(x, y, centerX, centerY, radius) {
    const dx = x - centerX;
    const dy = y - centerY;
    return dx * dx + dy * dy <= radius * radius;
}

// Wrap text to multiple lines
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Measure text width
function measureText(ctx, text, font) {
    ctx.save();
    ctx.font = font;
    const width = ctx.measureText(text).width;
    ctx.restore();
    return width;
}

