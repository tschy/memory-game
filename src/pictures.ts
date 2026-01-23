import type {Dimensions, PictureSet, PixelPosition, Position} from './model';
import {pairwiseDifferences} from './util';

export const allPictureSets: PictureSet[] = [
    {
        path: 'sheep with green.png',
        width: 1038,
        height: 1038,
        rows: 3,
        cols: 3,
        rowBounds: [0, 355, 684, 1038],
        colBounds: [0, 355, 681, 1038],
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

export function getCardPicSize(pos: Position, set: PictureSet): Dimensions {
    const width = set.colBounds ? set.colBounds[pos.col + 1] - set.colBounds[pos.col] : set.width / set.cols;
    const height = set.rowBounds ? set.rowBounds[pos.row + 1] - set.rowBounds[pos.row]: set.height / set.rows;
    return {width: width, height: height,}
}

export function getPixelPosition(pos: Position, set: PictureSet): PixelPosition {
    const size = getCardPicSize(pos, set);
    const x = set.colBounds ? set.colBounds[pos.col] : pos.col * size.width;
    const y = set.rowBounds ? set.rowBounds[pos.row] : pos.row * size.height;
    return {x, y};
}

export function cardPicMaxSize(set: PictureSet): Dimensions {
    const width = set.colBounds ? Math.max(...pairwiseDifferences(set.colBounds)) : set.width / set.cols;
    const height = set.rowBounds ? Math.max(...pairwiseDifferences(set.rowBounds)) : set.height / set.rows;
    return {width, height,}
}