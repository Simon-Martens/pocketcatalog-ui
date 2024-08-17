const alibiMap = {
    a: ['à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ā', 'ă', 'ą', 'ǎ', 'ȁ', 'ȧ'],
    b: ['ƀ', 'ƃ', 'ƅ', 'ɓ', 'ɞ'],
    c: ['ç', 'ć', 'ĉ', 'ċ', 'č', 'ƈ', 'ȼ', 'ɕ'],
    d: ['ď', 'đ', 'ƌ', 'ȡ', 'ɖ', 'ɗ', 'ɖ', 'ɗ'],
    e: ['è', 'é', 'ê', 'ë', 'ē', 'ĕ', 'ė', 'ę', 'ě', 'ǝ', 'ȅ', 'ȇ', 'ȩ', 'ɇ', 'ɘ', 'ɛ'],
    f: ['ƒ', 'ſ', 'ƒ', 'ƒ', 'ɟ', 'ɥ'],
    g: ['ĝ', 'ğ', 'ġ', 'ģ', 'ǥ', 'ǧ', 'ǵ', 'ɠ', 'ɡ', 'ɢ'],
    h: ['ĥ', 'ħ', 'ȟ', 'ɦ', 'ɧ'],
    i: ['ì', 'í', 'î', 'ï', 'ĩ', 'ī', 'ĭ', 'į', 'ı', 'ǐ', 'ȉ', 'ȋ', 'ɨ', 'ɪ'],
    j: ['ĵ', 'ǰ', 'ȷ', 'ɉ', 'ɟ'],
    k: ['ķ', 'ƙ', 'ǩ', 'ʞ'],
    l: ['ĺ', 'ļ', 'ľ', 'ŀ', 'ł', 'ƚ', 'ȴ', 'ɫ', 'ɬ', 'ɭ'],
    m: ['ɯ', 'ɰ'],
    n: ['ñ', 'ń', 'ņ', 'ň', 'ŉ', 'ŋ', 'ƞ', 'ǹ', 'ȵ', 'ɲ', 'ɳ'],
    o: ['ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ō', 'ŏ', 'ő', 'ơ', 'ǒ', 'ǫ', 'ȍ', 'ȏ', 'ȯ'],
    p: ['ƥ', 'ȹ', 'ɓ', 'ɔ', 'ɸ'],
    q: ['ɋ'],
    r: ['ŕ', 'ŗ', 'ř', 'ȑ', 'ȓ', 'ɍ'],
    s: ['ś', 'ŝ', 'ş', 'š', 'ș', 'ȿ', 'ʂ', 'ʃ', 'ß'],
    t: ['ţ', 'ť', 'ŧ', 'ƫ', 'ƭ', 'ț', 'ʈ'],
    u: ['ù', 'ú', 'û', 'ü', 'ũ', 'ū', 'ŭ', 'ů', 'ű', 'ų', 'ư', 'ǔ' ],
    v: ['ʌ'],
    w: ['ŵ', 'ʍ'],
    x: ['χ', 'ξ'],
    y: ['ý', 'ÿ', 'ŷ', 'ȳ', 'ɏ'],
    z: ['ź', 'ż', 'ž', 'ƶ', 'ȥ', 'ɀ', 'ʐ'],
}

const specialChars = [
    '\'',
    "\"",
    " ",
    "-",
    "_",
    "(",
    "[",
    "{",
    "!",
    "?",
    ".",
    ",",
    ";",
    ":",
    "„",
    "“",
    "”",
    "‘",
    "’",
    "‚",
    "‛",
    "«",
    "»",
    "›",
    "‟",
    "...",
    "…",
    "—",
    "‒",
    "†",
    "‡",
    "•",
    "′",
]

export default class SearchHelpers {

    /**
     * @param {string} field
     * @param {string} searchterm
    */
    static notWordBeginningFilterString(field, searchterm) {
        return field + '!~"' + searchterm + '%"';
    }

    /**
     * @param {string} field
     * @param {string} searchterm
    */
    static wordBeginningFilterString(field, searchterm) {
        return field + '~"' + searchterm + '%"';
    }

    /**
     * @param {string} field
     * @param {string} searchterm
     */
    static wordFilterString(field, searchterm) {
        return field + '~"' + searchterm + '"';
    }

    /**
     * @param {string} term
     */
    static firstLetterUpperCase(term) {
        return term.charAt(0).toUpperCase() + term.slice(1);
    }

    /**
     * @param {string} term
     */
    static firstLetterLowerCase(term) {
        return term.charAt(0).toLowerCase() + term.slice(1);
    }

    /**
     * @param {string} searchterm
     * @param {string} field
     */
    static wordBeginningCaseInsensitiveFilterString(field, searchterm) {
        return this.wordBeginningFilterString(field, this.firstLetterUpperCase(searchterm)) + 
                '||' + 
                this.wordBeginningFilterString(field, this.firstLetterLowerCase(searchterm));
    }

    /**
     * @param {string} searchterm
     * @param {string} field
     */
    static notWordBeginningCaseInsensitiveFilterString(field, searchterm) {
        return this.notWordBeginningFilterString(field, this.firstLetterUpperCase(searchterm)) + 
                '||' + 
                this.notWordBeginningFilterString(field, this.firstLetterLowerCase(searchterm));
    }

    /**
     * @param {string} field
     * @param {string} searchterm
     */
    static wordCaseInsesitiveFilterString(field, searchterm) {
        return this.wordFilterString(field, this.firstLetterUpperCase(searchterm)) + 
                '||' + 
                this.wordFilterString(field, this.firstLetterLowerCase(searchterm));
    }
}