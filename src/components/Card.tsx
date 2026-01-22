import {useState} from "preact/hooks";

export type CardProps = {
    word: string;
    solved: boolean;
    hidden: boolean;
    onClick: () => void;
}

export function Card({word}: CardProps) {
    const [hidden, setHidden] = useState(true);
    return <div class={"card " + (hidden ? "hidden-card" : "open-card")}
                onClick={() => setHidden(!hidden)}
    >
        {hidden ? "Look at me." : word}
    </div>
}