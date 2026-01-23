export enum CardType {
    WORDS = 'words',
    PICTURES = 'pics',
}

export type CardProps = {
    solved: boolean;
    open: boolean;
    onClick: () => void;
}

export type Position = {
    // counting from 0 !
    row: number;
    col: number;
}

export type PictureSet = {
    path: string,
    // pixel dimensions of the image file
    width: number,
    height: number,
    // how many cards are in the image
    rows: number,
    cols: number,
    // one of the pictures represents the back of a card.
    // TODO: make this optional
    backsideIndex: number,
}

export type Dimensions = {
    width: number;
    height: number;
};
