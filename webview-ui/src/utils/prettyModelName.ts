export const prettyModelName = (modelId: string): string => {
	if (!modelId) {
		return ""
	}
	const [mainId, tag] = modelId.split(":")

	// Isolate the model's name (the part after the slash)
	// Fallback to the full mainId if no slash is present
	const modelName = mainId.includes("/") ? mainId.split("/")[1] : mainId

	// Capitalize each word and join with spaces
	const formattedName = modelName
		.split("-")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")

	//If a tag exists, format it and append it to the name.
	if (tag) {
		const formattedTag = `(${tag.charAt(0).toUpperCase() + tag.slice(1)})`
		return `${formattedName} ${formattedTag}`
	}

	// Otherwise, return only the formatted name.
	return formattedName
}
