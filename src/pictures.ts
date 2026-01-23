import type {Dimensions, PictureSet, Position} from './model';

export const allPictureSets: PictureSet[] = [
    {
        path: 'sheep with green.png',
        width: 1038,
        height: 1038,
        rows: 3,
        cols: 3,
        backsideIndex: 1 * 3 + 1,
    },
];

export function numberOfPics(set: PictureSet) {
    const base = set.rows * set.cols;
    return set.backsideIndex ? base - 1 : base;
}

// since getPicPosition jumps over the backside position, we need this special value to get the actual backside.
export const BACKSIDE = -1;

export function getPicPosition(index: number, set: PictureSet): Position {
    const idx = index == BACKSIDE ? set.backsideIndex
        : index >= set.backsideIndex ? index + 1 : index;
    let row = Math.floor(idx / set.cols);
    return {row, col: idx - row * set.cols };
}

export function cardPicSize(set: PictureSet): Dimensions {
    return {
        width: set.width / set.cols,
        height: set.height / set.rows,
    }
}