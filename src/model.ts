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


