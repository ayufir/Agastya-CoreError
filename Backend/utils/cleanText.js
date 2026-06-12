function cleanText(text) {
    return text
        .replace(/Draft Version/gi, "")
        .replace(/This document is computer generated.*?/gi, "")
        .replace(/Page \d+ of \d+/gi, "")
        .replace(/Created By.*?/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}

module.exports = cleanText;
