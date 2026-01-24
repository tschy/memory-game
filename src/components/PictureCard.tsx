import type {CardProps} from '../model';
import {BACKSIDE, PictureSet} from '../pictures';

export type PictureCardProps =  CardProps & {
    picSet: PictureSet,
    index: number;
}

export function PictureCard({picSet, index, open, solved, onClick, extraClass}: PictureCardProps) {
    const idx = open || solved ? index : BACKSIDE;
    const cardSize = picSet.getMaxCardSize();
    const pos = picSet.getPosition(idx);
    const imgSize = picSet.getCardSize(pos)
    const pixelPos = picSet.getPixelPosition(pos);
    const stateClass = solved ? "solved" : open ? "open" : "hidden";
    const classes = ["picture-card", stateClass, extraClass].filter(Boolean).join(" ");
    return <div class={classes}
                style={`width: ${cardSize.width}px; height: ${cardSize.height}px;`}
                onClick={() => onClick()}
    >
        <img src={picSet.path} alt={`Card ${idx}`}
             draggable={false}
             style={`width: ${imgSize.width}px; height: ${imgSize.height}px; ` +
             `object-position: -${pixelPos.x}px -${pixelPos.y}px;`}
        />
    </div>
}
