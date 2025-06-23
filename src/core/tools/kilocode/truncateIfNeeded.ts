const SIZE_LIMIT_AS_CONTEXT_WINDOW_FRACTION = 0.2

function tokenEstimate(text: string) {
	// Assume 3 characters per token.
	// Very crude metric, but it is fast to compute and scales linearly.
	return Math.ceil(text.length / 3)
}
function computeLinesToKeep(lines: string[], maxTokens: number) {
	let currentEstimate = 0
	let linesToKeep = 0
	while (linesToKeep < lines.length) {
		const lineEstimate = tokenEstimate(lines[linesToKeep])
		if (currentEstimate + lineEstimate > maxTokens) {
			break
		}

		currentEstimate += lineEstimate
		linesToKeep++
	}
	return linesToKeep
}

export function truncateIfNeeded(text: string, contextWindow: number) {
	const maxTokens = Math.floor(SIZE_LIMIT_AS_CONTEXT_WINDOW_FRACTION * contextWindow)
	if (tokenEstimate(text) <= maxTokens) {
		return text
	}

	const lines = text.split("\n")
	let linesToKeep = computeLinesToKeep(lines, maxTokens)

	console.warn(`Truncating from ${lines.length} lines to ${linesToKeep} lines:
${text.slice(0, 100)} ..........`)

	const truncatedText = lines.slice(0, linesToKeep).join("\n")
	return `**Important:** The output below was truncated from ${lines.length} lines to ${linesToKeep} lines due to size limits and is therefore *incomplete*! You *must* notify the user of this!

${truncatedText}`
}
