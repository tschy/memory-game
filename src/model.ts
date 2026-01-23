export enum CardType {
    WORDS = 'words',
    PICTURES = 'pics',
}

export type CardProps = {
    solved: boolean;
    open: boolean;
    onClick: () => void;
    extraClass?: string;
}

export type Position = {
    // counting from 0 !
    col: number;
    row: number;
}

export type PixelPosition = {
    x: number; // column
    y: number; // row
}

export type Dimensions = {
    width: number;
    height: number;
};

export type PictureSet = {
    path: string,
    // pixel dimensions of the image file
    width: number,
    height: number,
    // how many cards are in the image?
    cols: number,
    rows: number,
    // When rows and cols are not of uniform size (which is often the case for AI generated ones),
    // this says where rows and cols end.
    // (For simplicity, this must include the first and last value 0 and total width/height. Thus n+1 entries.)
    colBounds: number[],
    rowBounds: number[],
    // one of the pictures represents the back of a card (index counting from 0 in top left).
    // TODO: make this optional
    backsideIndex: number,
}
