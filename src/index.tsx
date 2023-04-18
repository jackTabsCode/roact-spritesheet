import Roact, {Binding, createBinding} from "@rbxts/roact"

function mapBinding<T, U>(value: T | Binding<T>, transform: (value: T) => U): Binding<U> {
	if (typeIs(value, "table") && "getValue" in value) {
		return value.map(transform)
	} else {
		return createBinding(transform(value))[0]
	}
}
interface Props extends JSX.IntrinsicElement<ImageLabel> {
	/**
	 * The configuration for the spritesheet.
	 */
	config: {
		/**
		 * The size of each image in the spritesheet.
		 */
		size: number
		/**
		 * The number of images in the spritesheet.
		 */
		count: number
		/**
		 * The number of columns in the spritesheet.
		 */
		columns: number
		/**
		 * The number of rows in the spritesheet.
		 */
		rows: number
		/**
		 * The images in the spritesheet.
		 * The first image is used when the alpha is less than 0.
		 */
		images: string[]
	}
	/**
	 * The alpha value of the spritesheet. Can also be a binding.
	 */
	alpha: number | Binding<number>
}

/**
 * A component that renders a spritesheet.
 * 	This sprite sheet generator is useful for generating circular progress indicators:
	https://eryn.io/RadialSpriteSheetGenerator/
 * @param props The props of the component. Includes configuration for the spritesheet, and an alpha value.
 * @returns A Roact element.
 */
export function Spritesheet(props: Props) {
	const reducedProps = {
		...props,
		config: undefined,
		alpha: undefined
	}

	const mapped = mapBinding(props.alpha, alpha => {
		const {size, count, columns, rows, images} = props.config
		const num = math.min(math.floor(alpha * count), count - 1)
		const page = math.floor(num / (columns * rows))
		const pageNum = num - columns * rows * page
		const x = (pageNum % columns) * size
		const y = math.floor(pageNum / columns) * size

		return {alpha, x, y, page, images, size}
	})

	return (
		<imagelabel
			{...reducedProps}
			ImageRectSize={mapped.map(m => new Vector2(m.size, m.size))}
			ImageRectOffset={mapped.map(m => new Vector2(m.x, m.y))}
			Image={mapped.map(m => m.images[m.alpha < 0 ? 0 : m.page])}
		/>
	)
}
