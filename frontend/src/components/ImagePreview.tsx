import { faAt, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ActionIcon, Group, Image, Modal, SimpleGrid, Stack, Tooltip } from "@mantine/core"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { deleteImage } from "../utils/fetch"
import { IImage } from "../utils/interfaces"

interface Props {
	images: IImage[]
	setImages: (images: IImage[]) => void
	isEditable: boolean
}

const useStyles = createUseStyles({
	img: {
		cursor: "pointer",
		"&:hover": {
			filter: "brightness(1.1)",
			transform: "scale(1.1)",
		},
		transition: "all 0.2s ease-in-out",
	},
})

export default function ImagePreview(props: Props) {
	const classes = useStyles()
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [modalImgIdx, setModalImgIdx] = useState<number>(0)

	const openImageModal = (imgIdx: number) => {
		setModalImgIdx(imgIdx)
		setIsModalOpen(true)
	}
	const handleRemoveImage = (idx: number) => {
		const id = props.images[idx].id
		if (id === undefined) return
		deleteImage(id).then(() => {
			props.images.splice(idx, 1)
			props.setImages([...props.images])
		})
	}
	if (!props.images) return <></>
	return (
		<SimpleGrid cols={6}>
			<Modal trapFocus size="60%" opened={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Carousel
					showThumbs={false}
					className="carouselClass"
					useKeyboardArrows
					swipeable
					emulateTouch
					showArrows
					showIndicators
					width={"100%"}
					selectedItem={modalImgIdx}
				>
					{props.images.map((image: IImage) => (
						<Image key={image.image as string} height={"60vh"} src={image.image as string} />
					))}
				</Carousel>
			</Modal>
			{props.images.map((image: IImage, idx: number) => (
				<Stack spacing={1} style={{ width: 50 }} key={image.id}>
					<Image
						className={classes.img}
						onClick={() => openImageModal(idx)}
						radius={5}
						src={image.image as string}
						width="50px"
						height="50px"
					/>
					{props.isEditable && (
						<Group noWrap position="center" spacing={-5}>
							<Tooltip label="Remove image">
								<ActionIcon color="red" onClick={() => handleRemoveImage(idx)}>
									<FontAwesomeIcon width={10} height={10} icon={faTrash} />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Copy image reference to clipboard">
								<ActionIcon
									color="blue"
									onClick={() => {
										openImageModal(idx)
									}}
								>
									<FontAwesomeIcon width={10} height={10} icon={faAt} />
								</ActionIcon>
							</Tooltip>
						</Group>
					)}
				</Stack>
			))}
		</SimpleGrid>
	)
}
