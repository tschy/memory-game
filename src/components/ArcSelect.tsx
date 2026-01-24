import {FunctionalComponent, JSX} from 'preact';

interface ArcSelectProps {
    min: number;
    max: number;
    val: number;
    title: string;
    setVal: (val: number) => void;
}

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    polarToCartesian(radius: number, angle: number): Point {
        return new Point(
            this.x + radius * Math.cos(angle),
            this.y + radius * Math.sin(angle)
        );
    }
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function buildArcPath(
    center: Point,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
): string {
    const p1 = center.polarToCartesian(innerRadius, startAngle);
    const p2 = center.polarToCartesian(innerRadius, endAngle);
    const p3 = center.polarToCartesian(outerRadius, endAngle);
    const p4 = center.polarToCartesian(outerRadius, startAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `
        M ${p1.x} ${p1.y}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${p2.x} ${p2.y}
        L ${p3.x} ${p3.y}
        A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${p4.x} ${p4.y}
        Z
    `.trim();
}

function getColor(position: number, min: number, max: number): string {
    const range = max - min;
    if (range <= 0) {
        return 'rgb(0, 255, 0)';
    }
    const normalized = clamp((position - min) / range, 0, 1); // 0 to 1
    const orangeGreen = 165;
    
    // Color scale: green -> yellow -> orange -> red -> purple
    if (normalized <= 0.25) {
        // green to yellow
        const t = normalized / 0.25;
        const r = Math.round(255 * t);
        const g = 255;
        const b = 0;
        return `rgb(${r}, ${g}, ${b})`;
    } else if (normalized <= 0.5) {
        // yellow to orange
        const t = (normalized - 0.25) / 0.25;
        const r = 255;
        const g = Math.round(255 - (255 - orangeGreen) * t);
        const b = 0;
        return `rgb(${r}, ${g}, ${b})`;
    } else if (normalized <= 0.75) {
        // orange to red
        const t = (normalized - 0.5) / 0.25;
        const r = 255;
        const g = Math.round(orangeGreen * (1 - t));
        const b = 0;
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        // red to purple
        const t = (normalized - 0.75) / 0.25;
        const r = 255;
        const g = 0;
        const b = Math.round(255 * t);
        return `rgb(${r}, ${g}, ${b})`;
    }
}

export const ArcSelect: FunctionalComponent<ArcSelectProps> = ({val, setVal, min, max, title}) => {
    const numSegments = max - min + 1;
    if (numSegments <= 0) {
        return null;
    }
    const radius = 120;
    const center = new Point(200, 180);
    const startAngle = Math.PI * 0.75; // 135 degrees (bottom left)
    const endAngle = Math.PI * 2.25; // 405 degrees (bottom right, wrapping around)
    const totalAngle = endAngle - startAngle; // 3/4 of circle
    const gapPerSegment = 0.08; // radians, space between segments
    const totalGap = gapPerSegment * Math.max(numSegments - 1, 0);
    const availableAngle = Math.max(totalAngle - totalGap, 0);
    const segmentAngle = availableAngle / numSegments;
    
    const paths: JSX.Element[] = [];
    
    for (let i = 0; i < numSegments; i++) {
        const number = min + i;
        const angle1 = startAngle + i * (segmentAngle + gapPerSegment);
        const angle2 = angle1 + segmentAngle;
        
        const isSelected = number === val;
        const currentRadius = isSelected ? radius + 20 : radius;
        const outerRadius = isSelected ? radius + 20 + 30 : radius + 30;
        
        const color = getColor(number, min, max);
        const pathData = buildArcPath(center, currentRadius, outerRadius, angle1, angle2);

        paths.push(
            <g key={`segment-${i}`}>
                <path
                    d={pathData}
                    fill={color}
                    stroke={isSelected ? '#fff' : 'none'}
                    strokeWidth={isSelected ? 3 : 0}
                    style={{cursor: 'pointer'}}
                    onClick={() => setVal(number)}
                />
            </g>
        );
    }
    
    return (
        <svg width="400" height="400" viewBox="0 0 400 360" style={{display: 'block', margin: '0 auto'}}>
            {paths}
            <text
                x={center.x}
                y={center.y}
                textAnchor="middle"
                dominantBaseline="middle"
                class="arc-select-center-text"
                pointerEvents="none"
            >
                <tspan x={center.x} dy="-0.6em">{val}</tspan>
                <tspan x={center.x} dy="1.2em">{title}</tspan>
            </text>
        </svg>
    );
};
