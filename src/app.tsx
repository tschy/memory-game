import {Card} from "./components/Card";
import {randomize} from "./util";

export function App() {
    const words = ["flow", "joy", "fun", "thrill", "love", "smile",
        "peace", "hope", "charm", "glow", "grace", "cheer", "bliss", "pride",
        "faith", "light", "trust", "zeal"];
    const wordOrder = randomize(words.concat(...words));
    const openCards = new Set<number>([0]);
    const solvedWords = new Set<string>();

    function clickCard(word: string, index: number) {
        if (openCards.has(index)) return;

        // if there is another open card with the same word, mark both as solved

        // if there are tow other open cards, hide them.

        openCards.add(index);
    }

    return (
        <>
            <h1>Memory Game</h1>
            {wordOrder.map((word, i) =>
                <Card
                    word={word}
                    key={word + "-" + i}
                    solved={solvedWords.has(word)}
                    open={openCards.has(i)}
                    onClick={() => clickCard(word, i)}
                />
            )}
        </>
    )
}
