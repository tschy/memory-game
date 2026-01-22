import {Card} from "./components/Card";
import {randomize} from "./util";
import {useState} from "preact/hooks";

const words = ["flow", "joy", "fun", "thrill", "love", "smile",
    "peace", "hope", "charm", "glow", "grace", "cheer", "bliss", "pride",
    "faith", "light", "trust", "zeal"];

const wordOrder = randomize(words.concat(...words));

export function App() {
    const [openCards, setOpenCards] = useState([] as number[]);
    const [solvedWords, setSolvedWords] = useState([] as string[]);
    function clickCard(word: string, index: number) {
        if (openCards.includes(index)) return;

        // if there is another open card with the same word, mark both as solved

        // if there are tow other open cards, hide them.

        setOpenCards([index, ...openCards]);
    }

    return (
        <>
            <h1>Memory Game</h1>
            {wordOrder.map((word, i) =>
                <Card
                    word={word}
                    key={word + "-" + i}
                    solved={solvedWords.includes(word)}
                    open={openCards.includes(i)}
                    onClick={() => clickCard(word, i)}
                />
            )}
        </>
    )
}
