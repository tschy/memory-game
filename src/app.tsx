import {TextCard} from "./components/TextCard";
import {randomize, randomPick} from "./util";
import {useState} from "preact/hooks";
import {CardType, type PictureSet} from './model';
import {PictureCard} from './components/PictureCard';
import {getPicSet, numberOfPics} from './pictures';
import {ArcSelect} from './components/ArcSelect';

const words = [
    "flow", "joy", "fun", "thrill", "love", "smile",
    "peace", "hope", "charm", "glow", "grace", "cheer",
    "bliss", "pride", "faith", "light", "trust", "zeal",
    "calm", "glee", "warmth", "dream", "shine", "kind",
];

export function App() {
    const [cardType, setCardType] = useState(null as CardType | null);
    const [numCards, setNumCards] = useState(8);

    if (cardType) {
        return <ActiveGame numCards={numCards}
                           picSet={cardType == CardType.PICTURES ? getPicSet(numCards) : undefined}
        />;
    }

    return (
        <div>
            <p class={"setup-explanation"}>Choose how many different cards you'd like:</p>
            <div style={{marginBottom: '20px'}}>
                <ArcSelect val={numCards} setVal={setNumCards} min={4} max={24} />
            </div>
            <p class={"setup-explanation"}>And then click here to play:</p>
            <div style={{textAlign: 'center'}}>
                {Object.values(CardType).map((cardType) => (
                    <button onClick={() => {setCardType(cardType )}}
                            class={"card-type-button"}
                    >{cardType}
                    </button>
                ))}
            </div>
        </div>
    )
}

type ActiveGameProps = {
    // if undefined, use words.
    picSet?: PictureSet,
    numCards: number,
}

export function ActiveGame({numCards, picSet}: ActiveGameProps) {
    const allIndexes = picSet
        ? Array.from({ length: numberOfPics(picSet) }, (_, i) => i)
        : words.map((_, index) => index);

    // wrap this in useState() so that randomization is only done when creating the component.
    // this probably needs to change when we add starting a new game
    const [activeIndexes] = useState(randomPick(numCards, allIndexes));
    const [cardOrder] = useState(randomize(activeIndexes.concat(...activeIndexes)));

    const [openCards, setOpenCards] = useState([] as number[]);
    // ATTENTION ALL: you can initialize this with 'activeIndexes' for dev purposes to show the winning animation right away
    const [solvedCards, setSolvedCards] = useState([] as number[]);
    const isWin = solvedCards.length === numCards;

    function clickCard(cardIndex: number, index: number) {
        if (openCards.includes(index)) return;

        // if there are two other open cards, hide them.
        if (openCards.length == 2) {
            setOpenCards([index]);
            return;
        }

        // if there is another open card with the same word, mark both as solved
        if (openCards.length == 1 && cardOrder[openCards[0]] == cardIndex) {
            setSolvedCards([...solvedCards, cardIndex]);
            setOpenCards([]);
            return;
        }

        setOpenCards([index, ...openCards]);
    }

    const seenCounts: Record<number, number> = {};

    return (
        <div class={"cards-container"}>
            {cardOrder.map((cardIndex, i) => {
                const count = seenCounts[cardIndex] ?? 0;
                seenCounts[cardIndex] = count + 1;
                const pulseClass = isWin
                    ? (count % 2 === 0 ? "win-wiggle-left" : "win-wiggle-right")
                    : "";

                return picSet ? (
                    <PictureCard
                        solved={solvedCards.includes(cardIndex)}
                        open={openCards.includes(i)}
                        onClick={() => clickCard(cardIndex, i)}
                        picSet={picSet}
                        index={cardIndex}
                        extraClass={pulseClass}
                    />
                ) : (
                    <TextCard
                        word={words[cardIndex]}
                        key={cardIndex + "-" + i}
                        solved={solvedCards.includes(cardIndex)}
                        open={openCards.includes(i)}
                        onClick={() => clickCard(cardIndex, i)}
                        extraClass={pulseClass}
                    />
                );
            })}
        </div>
    )
}
