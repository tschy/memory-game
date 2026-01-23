import {FunctionalComponent, JSX} from 'preact';

interface ArcSelectProps {
    min: number;
    max: number;
    val: number;
    setVal: (val: number) => void;
}

function getColor(position: number, min: number, max: number): string {
    const range = max - min;
    const normalized = (position - min) / range; // 0 to 1
    
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
        const g = Math.round(255 * (1 - t));
        const b = 0;
        return `rgb(${r}, ${g}, ${b})`;
    } else if (normalized <= 0.75) {
        // orange to red
        const t = (normalized - 0.5) / 0.25;
        const r = 255;
        const g = 0;
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

export const ArcSelect: FunctionalComponent<ArcSelectProps> = ({val, setVal, min, max}) => {
    const numSegments = max - min + 1;
    const radius = 120;
    const centerX = 200;
    const centerY = 180;
    const startAngle = Math.PI * 0.75; // 135 degrees (bottom left)
    const endAngle = Math.PI * 2.25; // 405 degrees (bottom right, wrapping around)
    const totalAngle = endAngle - startAngle; // 3/4 of circle
    const gapPerSegment = 0.08; // radians, space between segments
    const availableAngle = totalAngle - (gapPerSegment * numSegments);
    const segmentAngle = availableAngle / numSegments;
    
    const paths: JSX.Element[] = [];
    
    for (let i = 0; i < numSegments; i++) {
        const number = min + i;
        const angle1 = startAngle + i * (segmentAngle + gapPerSegment);
        const angle2 = angle1 + segmentAngle;
        
        const isSelected = number === val;
        const currentRadius = isSelected ? radius + 20 : radius;
        const outerRadius = isSelected ? radius + 20 + 30 : radius + 30;
        
        // Calculate points for the arc path
        const x1 = centerX + currentRadius * Math.cos(angle1);
        const y1 = centerY + currentRadius * Math.sin(angle1);
        const x2 = centerX + currentRadius * Math.cos(angle2);
        const y2 = centerY + currentRadius * Math.sin(angle2);
        
        const x3 = centerX + outerRadius * Math.cos(angle2);
        const y3 = centerY + outerRadius * Math.sin(angle2);
        const x4 = centerX + outerRadius * Math.cos(angle1);
        const y4 = centerY + outerRadius * Math.sin(angle1);
        
        const largeArc = segmentAngle > Math.PI ? 1 : 0;
        const color = getColor(number, min, max);
        
        const pathData = `
            M ${x1} ${y1}
            A ${currentRadius} ${currentRadius} 0 ${largeArc} 1 ${x2} ${y2}
            L ${x3} ${y3}
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${x4} ${y4}
            Z
        `;

        paths.push(
            <g key={`segment-${i}`}>
                <path
                    d={pathData}
                    fill={color}
                    stroke={isSelected ? '#fff' : 'none'}
                    stroke-width={isSelected ? 3 : 0}
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
                x={centerX}
                y={centerY}
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="32"
                font-weight="bold"
                class="arc-select-center-text"
                pointer-events="none"
            >
                {val}
            </text>
        </svg>
    );
};
