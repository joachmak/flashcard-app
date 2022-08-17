import { Button, Card, Container, Group, Text } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import { patchCard } from "../utils/fetch"
import { ICard } from "../utils/interfaces"
import { decrementScore, incrementScore, parseLatex } from "../utils/utils"

export default function Practice() {
	const context = useContext(AppContext)
	const [idx, setIdx] = useState(0)
	const [cards, setCards] = useState<ICard[]>([])
	const [isFlipped, setIsFlipped] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (context && context.set && context.set.cards) {
			setCards(context.set.cards)
		}
	}, [context])
	const incrementCardIdx = () => {
		if (cards && idx < cards.length - 1) {
			setIdx(idx + 1)
			setIsFlipped(false)
		}
	}
	const lastCard = cards && idx === cards.length - 1
	const navigate = useNavigate()

	const handlePracticeAgain = () => {
		if (cards === undefined || cards[idx].id === undefined || cards[idx].score === undefined) return
		setIsLoading(true)
		patchCard(cards[idx].id!, {
			score: decrementScore(cards[idx].score!),
			last_practiced: new Date(),
		})
			.then(() => {
				// move card to end of set
				let setCards = context!.set!.cards!
				let set = context!.set!
				set.cards!.push(setCards.splice(idx, 1)[0])
				context!.setSet(set)
				setIsFlipped(false)
				setIsLoading(false)
			})
			.catch((err) => {
				setIsLoading(false)
				console.error(err)
			})
	}

	const handleRememberedAnswer = () => {
		if (cards === undefined || cards[idx].id === undefined || !cards[idx].score === undefined)
			return
		setIsLoading(true)
		patchCard(cards[idx].id!, {
			score: incrementScore(cards[idx].score!),
			last_practiced: new Date(),
		})
			.then(() => {
				setIsLoading(false)
				if (!lastCard) incrementCardIdx()
				else navigate("/")
			})
			.catch((err) => {
				setIsLoading(false)
				console.error(err)
			})
	}

	return (
		<Container>
			<Text>(Click the card to flip it)</Text>
			{cards?.length > 0 && (
				<>
					<Card onClick={() => setIsFlipped(!isFlipped)}>
						{cards?.length > 0 && isFlipped
							? parseLatex(cards[idx].definition)
							: parseLatex(cards[idx].term)}
						{isFlipped && context && context.set && (
							<Group>
								<Button variant="outline" loading={isLoading} onClick={handlePracticeAgain}>
									Practice again
								</Button>
								<Button variant="filled" loading={isLoading} onClick={handleRememberedAnswer}>
									I remembered the answer
								</Button>
							</Group>
						)}
					</Card>
					<Text>
						Card {idx + 1} of {cards.length}
					</Text>
				</>
			)}
		</Container>
	)
}
