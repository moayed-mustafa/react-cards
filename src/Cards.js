import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Card from './Card'

const Cards = () => {
    // initialize the state for the deck and the cards
    const [deck, setDeck] = useState({})
    const [cards, setCards] = useState([])
    const [autoDraw, setAutoDraw] = useState(false)
    const timerRef = useRef(null);
    const BASE_URL = "https://deckofcardsapi.com/api/deck"


    // SET THE STATE FOR THE DECK
    useEffect(() => {
        const getData = async () => {
            const res = await axios.get(`${BASE_URL}/new/shuffle/`)
            setDeck(res.data)
        }
        getData()

    }, [setDeck])

    // DRAW A CARD FROM THE DECK
    useEffect(() => {
        const drawCard = async () => {
            const { deck_id } = deck
            try {
                const draw = await axios.get(`${BASE_URL}/${deck_id}/draw`)
                if (draw.data.remaining === 0) {
                    throw new Error("No more cards to display")
                }
                setCards(cards =>  [
                    ...cards,
                    {
                        image: draw.data.cards[0].image
                    }
                ])
            } catch (e) {
                setAutoDraw(false)
                alert(e)
            }
        }
        // autoDraw
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await drawCard()
            }, 1000)
    }

        // cleanup
        return () => {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [cards, deck, autoDraw])


    // TOGGLE THE VALUE OF autoDraw
    const toggleAutoDraw = () => {
        setAutoDraw(autoDraw => !autoDraw)
    }
    // map on cards on state
    const drawn = cards.map(card => (<Card image={card.image} /> ))

    return (
        <>
            <div>
                {deck ?
                    <button
                        onClick={toggleAutoDraw}>
                        {autoDraw? 'Stop':'Draw'}
                        </button>
            : null
                }
                <div>{drawn}</div>

        </div>
            </>
    )
}

export default Cards