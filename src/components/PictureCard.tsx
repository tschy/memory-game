import type {CardProps, PictureSet} from '../model';
import {BACKSIDE, cardPicMaxSize, getCardPicSize, getPicPosition, getPixelPosition} from '../pictures';

export type PictureCardProps =  CardProps & {
    picSet: PictureSet,
    index: number;
}

export function PictureCard({picSet, index, open, solved, onClick, extraClass}: PictureCardProps) {
    const idx = open || solved ? index : BACKSIDE;
    const cardSize = cardPicMaxSize(picSet);
    const pos = getPicPosition(idx, picSet);
    const imgSize = getCardPicSize(pos, picSet)
    const pixelPos = getPixelPosition(pos, picSet);
    const stateClass = solved ? "solved" : open ? "open" : "hidden";
    const classes = ["picture-card", stateClass, extraClass].filter(Boolean).join(" ");
    return <div class={classes}
                style={`width: ${cardSize.width}px; height: ${cardSize.height}px;`}
                onClick={() => onClick()}
    >
        <img src={picSet.path} alt={`Card ${idx}`}
             style={`width: ${imgSize.width}px; height: ${imgSize.height}px; ` +
             `object-position: -${pixelPos.x}px -${pixelPos.y}px;`}
        />
    </div>
}
