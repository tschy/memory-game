import type {CardProps, PictureSet} from '../model';
import {BACKSIDE, cardPicSize, getPicPosition} from '../pictures';

export type PictureCardProps =  CardProps & {
    picSet: PictureSet,
    index: number;
}

export function PictureCard({picSet, index, open, solved, onClick}: PictureCardProps) {
    const idx = open || solved ? index : BACKSIDE;
    const dims = cardPicSize(picSet);
    const pos = getPicPosition(idx, picSet);
    const x = -pos.col * dims.width;
    const y = -pos.row * dims.height;
    return <div class={"picture-card " + (solved ? "solved" : open ? "open" : "hidden")}
                onClick={() => onClick()}
    >
        <img src={picSet.path} alt={`Card ${idx}`}
             style={`width: ${dims.width}px; height: ${dims.height}px; ` +
             `object-position: ${x}px ${y}px;`}
        />
    </div>
}