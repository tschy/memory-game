import {TextCard} from "./components/TextCard";
import {randomize, randomPick} from "./util";
import {useState} from "preact/hooks";
import {CardType} from './model';

const words = ["flow", "joy", "fun", "thrill", "love", "smile",
    "peace", "hope", "charm", "glow", "grace", "cheer", "bliss", "pride",
    "faith", "light", "trust", "zeal"];

const activeWords = randomPick(10, words);

const wordOrder = randomize(activeWords.concat(...activeWords));

export function App() {
    const [cardType, setCardType] = useState(null as CardType | null);
    if (cardType) return <ActiveGame cardType={cardType} />;

    return Object.values(CardType).map((cardType) => (
        <button onClick={() => {setCardType(cardType )}}
                class={"card-type-button"}
        >{cardType}
        </button>
    ))
}

type ActiveGameProps = {
    cardType: CardType,
}

export function ActiveGame({cardType}: ActiveGameProps) {
    const [openCards, setOpenCards] = useState([] as number[]);
    const [solvedWords, setSolvedWords] = useState([] as string[]);
    function clickCard(word: string, index: number) {
        if (openCards.includes(index)) return;
        console.log("start", word, index, openCards, solvedWords);

        // if there are two other open cards, hide them.
        if (openCards.length == 2) {
            console.log("hide");
            setOpenCards([index]);
            return;
        }

        // if there is another open card with the same word, mark both as solved
        if (openCards.length == 1 && wordOrder[openCards[0]] == word) {
            setSolvedWords([...solvedWords, word]);
            setOpenCards([]);
            return;
        }
        console.log("end", word, index);

        setOpenCards([index, ...openCards]);
    }

    return (
        <div class={"cards-container"}>
            {wordOrder.map((word, i) =>
                <TextCard
                    word={word}
                    key={word + "-" + i}
                    solved={solvedWords.includes(word)}
                    open={openCards.includes(i)}
                    onClick={() => clickCard(word, i)}
                />
            )}
        </div>
    )
}
