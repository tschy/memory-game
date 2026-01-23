import type {CardProps} from '../model';

export type TextCardProps = CardProps & {
    word: string;
}

export function TextCard({word, open, solved, onClick}: TextCardProps) {
    return <div class={"text-card " + (solved ? "solved" : open ? "open" : "hidden")}
                onClick={() => onClick()}
    >
        {open || solved ? word : "Look at me."}
    </div>
}