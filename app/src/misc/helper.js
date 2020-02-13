export const copyToClipboard = elementToCopy => {
  elementToCopy.setAttribute('type', 'text')
  elementToCopy.select()
  document.execCommand('copy')
  elementToCopy.setAttribute('type', 'hidden')
  window.getSelection().removeAllRanges()
}

export default {
  copyToClipboard
}
