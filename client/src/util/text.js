/**
 * Format text and convert line breaks to HTML.
 *
 *     Bold: '*Text*'
 *     Italics: '/Text/'
 *     Underline: '_Text_'
 *     Strikethrough: '~Text~'
 * @param {String} str The text to format.
 * @param {Boolean} indent Whether to indent new lines of text. (default `true`)
 */
const formatText = (str, indent = true) =>
    (indent ? '<span class="mx-3"></span>' : '') +
    str
        .replace(/(?:\/([^/.]+)\/)/g, '<i>$1</i>')
        .replace(/(?:\*([^*.]+)\*)/g, '<b>$1</b>')
        .replace(/(?:_([^_.]+)_)/g, '<u>$1</u>')
        .replace(/(?:~([^~.]+)~)/g, '<s>$1</s>')
        .replace(/(?:\r\n|\r|\n)/g, `<br />${indent ? '<span class="mx-3"></span>' : ''}`)

/**
 * Escape HTML brackets.
 *
 *     '<' => '&lt;'
 *
 *     '>' => '&gt;'
 * @param {String} str The text to escape.
 */
const escapeBrackets = str => str.replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Unescape HTML brackets.
 *
 *     '&lt;' => '<'
 *
 *     '&gt;' => '>'
 * @param {String} str The text to unescape.
 */
const unescapeBrackets = str => str.replace(/&lt;/g, '<').replace(/&gt;/g, '>')

export { formatText, escapeBrackets, unescapeBrackets }
