import {TextCard} from "./components/TextCard";
import {divides, randomize, randomPick} from "./util";
import {useLayoutEffect, useRef, useState} from "preact/hooks";
import {CardType} from './model';
import {PictureCard} from './components/PictureCard';
import {getPicSet, PictureSet} from './pictures';
import {ArcSelect} from './components/ArcSelect';
import {getWords} from './words';

export function App() {
    const [cardType, setCardType] = useState(null as CardType | null);
    const [numCards, setNumCards] = useState(8);

    const picSet = getPicSet(numCards);
    if (cardType) {
        return <ActiveGame numCards={numCards}
                           wordSet={getWords(numCards)}
                           picSet={cardType == CardType.PICTURES ? picSet : undefined}
                           onNewGame={() => window.location.reload()}
        />;
    }

    return (
        <div>
            <p class={"setup-explanation"}>Choose how many different cards you'd like:</p>
            <div style={{marginBottom: '20px'}}>
                <ArcSelect val={numCards} setVal={setNumCards} min={4} max={24} title={picSet.title}/>
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
    numCards: number,
    // always defined, just to avoid checking it all the time.
    wordSet: string[],
    // if undefined, use words.
    picSet?: PictureSet,
    // callback when user clicks new game
    onNewGame?: () => void,
}

export function ActiveGame({numCards, picSet, wordSet, onNewGame}: ActiveGameProps) {
    const allIndexes = picSet
        ? Array.from({ length: picSet.numberOfPics() }, (_, i) => i)
        : wordSet.map((_, index) => index);

    // wrap this in useState() so that randomization is only done when creating the component.
    // this probably needs to change when we add starting a new game
    const [activeIndexes] = useState(randomPick(numCards, allIndexes));
    const [cardOrder] = useState(randomize(activeIndexes.concat(...activeIndexes)));
    const [columns, setColumns] = useState(Math.ceil(Math.sqrt(numCards*2)));
    const containerRef = useRef<HTMLDivElement>(null);

    const [openCards, setOpenCards] = useState([] as number[]);
    // ATTENTION ALL: you can initialize this with 'activeIndexes' for dev purposes to show the winning animation right away
    const [solvedCards, setSolvedCards] = useState([] as number[]);
    const isWin = solvedCards.length === numCards;
    const [showNewGameButton, setShowNewGameButton] = useState(false);

    // Show new game button after animation completes (1.8s = 3 cycles * 0.6s per cycle)
    useLayoutEffect(() => {
        if (isWin && !showNewGameButton) {
            const timer = setTimeout(() => setShowNewGameButton(true), 1800);
            return () => clearTimeout(timer);
        }
    }, [isWin, showNewGameButton]);

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
    function calculateColumns() {
        console.log("calculateColumns");
        if (!containerRef.current) return;
        const card = containerRef.current.children.item(0);
        if (!card) return;
        console.log("calculateColumns has a card");
        const { width, height } = card.getBoundingClientRect();
        const { width: tw, height: th } = window.visualViewport!;
        let cols = Math.ceil(Math.sqrt(numCards*2*height/th/(width/tw)));
        if (!divides(numCards*2, cols) && divides(numCards*2, cols-1)) cols--;
        setColumns(cols);
    }
    useLayoutEffect(calculateColumns, []);
    window.visualViewport!.addEventListener('resize', calculateColumns);

    const seenCounts: Record<number, number> = {};

    return (
         <div style={{position: 'relative', width: '100%', height: '100%'}}>
             <div class={"cards-container"}
                  ref={containerRef}
                  style={{  gridTemplateColumns: `repeat(${columns}, 1fr)` }}
             >
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
                             word={wordSet[cardIndex]}
                             key={cardIndex + "-" + i}
                             solved={solvedCards.includes(cardIndex)}
                             open={openCards.includes(i)}
                             onClick={() => clickCard(cardIndex, i)}
                             extraClass={pulseClass}
                         />
                     );
                 })}
             </div>
             {showNewGameButton && (
                 <div style={{
                     position: 'fixed',
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     zIndex: 1000,
                 }}>
                     <button 
                         onClick={onNewGame}
                         style={{
                             padding: '1.5rem 3rem',
                             fontSize: '1.5rem',
                             borderRadius: '0.5rem',
                             cursor: 'pointer',
                             backgroundColor: '#2d4ce8',
                             color: 'white',
                             border: '3px solid #1e2b99',
                             fontWeight: 'bold',
                             boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                         }}
                     >
                         New Game
                     </button>
                 </div>
             )}
         </div>
     )
}
