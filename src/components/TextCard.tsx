import type {CardProps} from '../model';

export type TextCardProps = CardProps & {
    word: string;
}

export function TextCard({word, open, solved, onClick, extraClass}: TextCardProps) {
    const stateClass = solved ? "solved" : open ? "open" : "hidden";
    const classes = ["text-card", stateClass, extraClass].filter(Boolean).join(" ");
    return <div class={classes}
                onClick={() => onClick()}
    >
        {open || solved ? word : "Look at me."}
    </div>
}
