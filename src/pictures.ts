import type {Dimensions, PixelPosition, Position} from './model';
import {pairwiseDifferences} from './util';

// since getPicPosition jumps over the backside position, we need this special value to get the actual backside.
export const BACKSIDE = -1;

export class PictureSet {
    constructor(
        readonly path: string,
        readonly title: string,
        readonly source: string,
        // pixel dimensions of the image file
        readonly width: number,
        readonly height: number,
        // how many cards are in the image?
        readonly cols: number,
        readonly rows: number,
        // one of the pictures represents the back of a card (index counting from 0 in top left).
        // TODO: make this optional
        readonly backsideIndex: number,
        // When rows and cols are not of uniform size (which is often the case for AI generated ones),
        // this says where rows and cols end.
        // (For simplicity, this must include the first and last value 0 and total width/height. Thus n+1 entries.)
        readonly colBounds?: number[],
        readonly rowBounds?: number[],
    ) {}

    numberOfPics(): number {
        const base = this.rows * this.cols;
        return this.backsideIndex ? base - 1 : base;
    }

    getPosition(index: number): Position {
        const idx = index == BACKSIDE ? this.backsideIndex
            : index >= this.backsideIndex ? index + 1 : index;
        let row = Math.floor(idx / this.cols);
        return {row, col: idx - row * this.cols };
    }

    getCardSize(pos: Position): Dimensions {
        const width = this.colBounds ? this.colBounds[pos.col + 1] - this.colBounds[pos.col] : this.width / this.cols;
        const height = this.rowBounds ? this.rowBounds[pos.row + 1] - this.rowBounds[pos.row]: this.height / this.rows;
        return {width: width, height: height,}
    }

    getPixelPosition(pos: Position): PixelPosition {
        const size = this.getCardSize(pos);
        const x = this.colBounds ? this.colBounds[pos.col] : pos.col * size.width;
        const y = this.rowBounds ? this.rowBounds[pos.row] : pos.row * size.height;
        return {x, y};
    }

    getMaxCardSize(): Dimensions {
        const width = this.colBounds ? Math.max(...pairwiseDifferences(this.colBounds)) : this.width / this.cols;
        const height = this.rowBounds ? Math.max(...pairwiseDifferences(this.rowBounds)) : this.height / this.rows;
        return {width, height,}
    }
}

// Put them in order of rising size, so that the size can easily be used to select the smallest sufficient one!
export const allPictureSets: PictureSet[] = [
    new PictureSet(
        'sheep with green.png',
        'Sheep',
        'Nanobanana free, 2026-01-23',
        1038,
        1038,
        3,
        3,
        1 * 3 + 1,
        [0, 355, 681, 1038],
        [0, 355, 684, 1038],
    ),
    new PictureSet(
        'favorite flowers.png',
        'Flowers',
        'ChatGPT / Dall-E, 2026-01-24',
        1006,
        1006,
        4,
        4,
        15,
    ),
    new PictureSet(
        'dall-e kiddo variety.png',
        `Child's play`,
        'ChatGPT / Dall-E, 2026-01-22',
        957,
        1068,
        5,
        5,
        4 * 5 + 3,
        [0, 196, 385, 572, 761, 957],
        [0, 207, 415, 620, 846, 1068],
    ),
];

export function getPicSet(num: number) {
    return allPictureSets.filter(set => set.numberOfPics() >= num)[0];
}