import {useState} from "preact/hooks";

export type CardProps = {
    word: string;
    solved: boolean;
    open: boolean;
    onClick: () => void;
}

export function Card({word, open, solved, onClick}: CardProps) {
    return <div class={"card " + (solved ? "solved-card" : open ? "open-card" : "hidden-card")}
                onClick={() => onClick()}
    >
        {open || solved ? word : "Look at me."}
    </div>
}