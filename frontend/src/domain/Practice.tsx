import { Button, Card, Typography } from "antd"
import { Content } from "antd/lib/layout/layout"
import { useContext, useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import { patchCard } from "../utils/fetch"
import { ICard } from "../utils/interfaces"
import { decrementScore, incrementScore } from "../utils/utils"

const useStyles = createUseStyles({
	container: {
		padding: 10,
		display: "flex",
		flexDirection: "column",
	},
	card: {
		cursor: "pointer",
	},
	button: {
		width: 200,
		marginTop: 10,
	},
	buttonContainer: {
		display: "flex",
		gap: 10,
	},
})

export default function Practice() {
	const classes = useStyles()
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
				setIsFlipped(false)
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
		<Content className={classes.container}>
			<Typography>(Click the card to flip it)</Typography>
			{cards?.length > 0 && (
				<>
					<Card className={classes.card} onClick={() => setIsFlipped(!isFlipped)}>
						{cards?.length > 0 && isFlipped ? cards[idx].definition : cards[idx].term}
						{isFlipped && context && context.set && (
							<div className={classes.buttonContainer}>
								<Button
									className={classes.button}
									type="ghost"
									loading={isLoading}
									onClick={handlePracticeAgain}
								>
									Practice again
								</Button>
								<Button
									className={classes.button}
									type="primary"
									loading={isLoading}
									onClick={handleRememberedAnswer}
								>
									I remembered the answer
								</Button>
							</div>
						)}
					</Card>
					<Typography>
						Card {idx + 1} of {cards.length}
					</Typography>
				</>
			)}
		</Content>
	)
}
