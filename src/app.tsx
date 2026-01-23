import {TextCard} from "./components/TextCard";
import {randomize, randomPick} from "./util";
import {useState} from "preact/hooks";
import {CardType, type PictureSet} from './model';
import {PictureCard} from './components/PictureCard';
import {allPictureSets, numberOfPics} from './pictures';

const words = ["flow", "joy", "fun", "thrill", "love", "smile",
    "peace", "hope", "charm", "glow", "grace", "cheer", "bliss", "pride",
    "faith", "light", "trust", "zeal"];

const wordIndexes = words.map((_, index) => index);

export function App() {
    const [cardType, setCardType] = useState(null as CardType | null);
    if (cardType) return <ActiveGame cardType={cardType} picSet={allPictureSets[0]}/>;

    return Object.values(CardType).map((cardType) => (
        <button onClick={() => {setCardType(cardType )}}
                class={"card-type-button"}
        >{cardType}
        </button>
    ))
}

type ActiveGameProps = {
    cardType: CardType,
    picSet?: PictureSet,
}

export function ActiveGame({cardType, picSet}: ActiveGameProps) {
    const numCards = cardType == CardType.PICTURES ? numberOfPics(picSet!) : 10;
    // wrap this in useState() so that randomization is only done when creating the component.
    // this probably needs to change when we add starting a new game
    const [activeIndexes] = useState(cardType == CardType.PICTURES
        ? Array.from({ length: numCards }, (_, i) => i)
        : randomPick(numCards, wordIndexes));
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
                    ? (count % 2 === 0 ? "win-pulse-grow" : "win-pulse-shrink")
                    : "";

                return cardType == CardType.WORDS ? (
                    <TextCard
                        word={words[cardIndex]}
                        key={cardIndex + "-" + i}
                        solved={solvedCards.includes(cardIndex)}
                        open={openCards.includes(i)}
                        onClick={() => clickCard(cardIndex, i)}
                        extraClass={pulseClass}
                    />
                ) : (
                    <PictureCard
                        solved={solvedCards.includes(cardIndex)}
                        open={openCards.includes(i)}
                        onClick={() => clickCard(cardIndex, i)}
                        picSet={picSet!}
                        index={cardIndex}
                        extraClass={pulseClass}
                    />
                );
            })}
        </div>
    )
}
