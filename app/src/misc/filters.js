export const truncateText = (text, limit) => {
  if (!text) return text
  if (text.length <= limit) return text
  return text.slice(0, limit).trim() + '...'
}

export default {
  truncateText
}
