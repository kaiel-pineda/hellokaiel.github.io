type ClickOutsideOptions = {
	enabled?: boolean;
	onOutside?: (event: PointerEvent) => void;
};

const defaultOptions: Required<ClickOutsideOptions> = {
	enabled: true,
	onOutside: () => {},
};

export function clickOutside(node: HTMLElement, options: ClickOutsideOptions = defaultOptions) {
	let currentOptions = { ...defaultOptions, ...options };

	const handlePointerDown = (event: PointerEvent): void => {
		if (!currentOptions.enabled) {
			return;
		}

		const target = event.target;
		if (!(target instanceof Node) || node.contains(target)) {
			return;
		}

		currentOptions.onOutside(event);
	};

	document.addEventListener("pointerdown", handlePointerDown);

	return {
		update(nextOptions: ClickOutsideOptions = defaultOptions) {
			currentOptions = { ...defaultOptions, ...nextOptions };
		},
		destroy() {
			document.removeEventListener("pointerdown", handlePointerDown);
		},
	};
}
