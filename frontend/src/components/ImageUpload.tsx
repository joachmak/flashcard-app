import { faImages } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FileInput, FileInputProps } from "@mantine/core"
import { useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import { createImage } from "../utils/fetch"
import { IImage } from "../utils/interfaces"

const useStyles = createUseStyles({
	fileInput: {
		width: 40,
		"&:hover": {
			filter: "brightness(1.1)",
		},
	},
	icon: {
		position: "absolute",
		top: 10,
		left: 11,
		pointerEvents: "none",
	},
	container: {
		position: "relative",
	},
})

interface Props {
	setImages: (images: IImage[]) => void
	images: IImage[]
	isTermImage: boolean
}

const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
	return <></>
}

export default function ImageUpload(props: Props) {
	const classes = useStyles()
	const [uploadedImages, setUploadedImages] = useState<IImage[]>([])
	const [imageCountToUpload, setImageCountToUpload] = useState<number>(0)
	const [isUploading, setIsUploading] = useState<boolean>(false)
	// FIXME: This function can fail and isUploading can theoretically get stuck at "true"
	// never happened in testing, but you never know. Perhaps set a 10sec timeout and reset variables?
	const handleFileUpload = (newFiles: File[]) => {
		if (isUploading) return // TODO: show warning that you're still uploading
		setIsUploading(true)
		setImageCountToUpload(newFiles.length)
		newFiles.forEach((file: File) => {
			let img: IImage = {
				image: file,
				is_term_image: props.isTermImage,
			}
			createImage(img)
				.then((res) => res.json())
				.then((res: IImage) => {
					img.id = res.id
					img.image = res.image as string
					setUploadedImages((images) => {
						images.push(img)
						return [...images]
					})
				})
		})
	}
	useEffect(() => {
		if (uploadedImages.length >= imageCountToUpload && imageCountToUpload !== 0) {
			console.log("Posting " + imageCountToUpload + " images: " + uploadedImages)
			props.setImages([...props.images, ...uploadedImages])
			setImageCountToUpload(0)
			setUploadedImages([])
			setIsUploading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uploadedImages, imageCountToUpload])
	return (
		<div className={classes.container}>
			<FileInput
				multiple
				className={classes.fileInput}
				onChange={handleFileUpload}
				valueComponent={ValueComponent}
				accept="image/png,image/jpeg,image/gif"
			/>
			<FontAwesomeIcon icon={faImages} className={classes.icon} />
		</div>
	)
}
