import { Button, Card, Container, Group, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import { Params, useNavigate, useParams } from "react-router-dom"
import { getSet, patchCard } from "../utils/fetch"
import { ISet } from "../utils/interfaces"
import { decrementScore, incrementScore, parseCardText } from "../utils/utils"

export default function Practice() {
	const [idx, setIdx] = useState(0)
	const [set, setSet] = useState<ISet>()
	const [isFlipped, setIsFlipped] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const params: Readonly<Params<string>> = useParams()

	useEffect(() => {
		if (params.id) getSet(parseInt(params.id)).then((res: ISet) => setSet(res))
	}, [params.id])

	const incrementCardIdx = () => {
		if (set?.cards && idx < set.cards.length - 1) {
			setIdx(idx + 1)
			setIsFlipped(false)
		}
	}

	const lastCard = set?.cards && idx === set.cards.length - 1
	const navigate = useNavigate()

	const handlePracticeAgain = () => {
		if (
			set?.cards === undefined ||
			set?.cards[idx].id === undefined ||
			set?.cards[idx].score === undefined
		)
			return
		setIsLoading(true)
		patchCard(set.cards[idx].id!, {
			score: decrementScore(set.cards[idx].score!),
			last_practiced: new Date(),
		})
			.then(() => {
				// move card to end of set
				if (!set || !set.cards) return
				let setCards = set.cards
				set.cards.push(setCards.splice(idx, 1)[0])
				setSet(set)
				setIsFlipped(false)
				setIsLoading(false)
			})
			.catch((err) => {
				setIsLoading(false)
				console.error(err)
			})
	}

	const handleRememberedAnswer = () => {
		if (
			set?.cards === undefined ||
			set?.cards[idx].id === undefined ||
			set?.cards[idx].score === undefined
		)
			return
		setIsLoading(true)
		patchCard(set.cards[idx].id!, {
			score: incrementScore(set.cards[idx].score!),
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
			{set?.cards && set.cards.length > 0 && (
				<>
					<Card onClick={() => setIsFlipped(!isFlipped)}>
						{set.cards.length > 0 && isFlipped
							? parseCardText(set.cards[idx].definition)
							: parseCardText(set.cards[idx].term)}
						{isFlipped && set && (
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
						Card {idx + 1} of {set.cards.length}
					</Text>
				</>
			)}
		</Container>
	)
}
