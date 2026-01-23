export enum CardType {
    WORDS = 'words',
    PICTURES = 'pics',
}

export type Position = {
    // counting from 0 !
    row: number;
    col: number;
}

export type PictureSet = {
    path: string,
    rows: number,
    cols: number,
    backside?: Position,
}
