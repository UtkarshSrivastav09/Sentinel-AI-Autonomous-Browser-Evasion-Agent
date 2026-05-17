/**
 * Simulates human-like mouse movement using Bezier curves and slight randomization.
 * This is crucial for bypassing advanced bot detection systems (like reCAPTCHA v3 or Cloudflare).
 */

interface Point {
    x: number;
    y: number;
}

// Helper to calculate a cubic bezier point
function cubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    let p: Point = { x: 0, y: 0 };
    p.x = uuu * p0.x;
    p.y = uuu * p0.y;

    p.x += 3 * uu * t * p1.x;
    p.y += 3 * uu * t * p1.y;

    p.x += 3 * u * tt * p2.x;
    p.y += 3 * u * tt * p2.y;

    p.x += ttt * p3.x;
    p.y += ttt * p3.y;

    return p;
}

/**
 * Generates an array of points simulating a human moving a mouse from start to end.
 */
export function generateHumanPath(start: Point, end: Point, steps: number = 30): Point[] {
    // Generate two random control points to create a curve instead of a straight line
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    // Add randomness to control points
    const cp1: Point = {
        x: start.x + dx * 0.3 + (Math.random() * 50 - 25),
        y: start.y + dy * 0.3 + (Math.random() * 50 - 25),
    };
    
    const cp2: Point = {
        x: start.x + dx * 0.7 + (Math.random() * 50 - 25),
        y: start.y + dy * 0.7 + (Math.random() * 50 - 25),
    };

    const path: Point[] = [];
    
    for (let i = 0; i <= steps; i++) {
        // Human movement isn't linear in time, they start slow, speed up, then slow down
        // We can simulate this by easing 't'
        let t = i / steps;
        
        // Simple ease-in-out calculation
        const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        const pt = cubicBezier(easeT, start, cp1, cp2, end);
        
        // Add tiny micro-jitters
        if (i !== 0 && i !== steps) {
            pt.x += Math.random() * 2 - 1;
            pt.y += Math.random() * 2 - 1;
        }
        
        path.push({ x: Math.round(pt.x), y: Math.round(pt.y) });
    }

    return path;
}
