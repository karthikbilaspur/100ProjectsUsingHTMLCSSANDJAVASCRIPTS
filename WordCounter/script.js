const textArea = document.getElementById('text-area');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const charCountWithSpaces = document.getElementById('char-count-with-spaces');
const sentenceCount = document.getElementById('sentence-count');
const paragraphCount = document.getElementById('paragraph-count');
const readingTime = document.getElementById('reading-time');
const clearButton = document.getElementById('clear-button');
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const copyButton = document.getElementById('copy-button');
const readingSpeedInput = document.getElementById('reading-speed');
const historyList = document.getElementById('history-list');
const readabilityScore = document.getElementById('readability-score');
const toneAndSentiment = document.getElementById('tone-and-sentiment');
const exportButton = document.getElementById('export-button');

let history = [];

textArea.addEventListener('input', () => {
    const text = textArea.value;
    const words = text.trim().split(/\s+/).filter(word => word !== '').length;
    const charsWithoutSpaces = text.replace(/\s+/g, '').length;
    const charsWithSpaces = text.length;
    const sentences = text.match(/[^.!?]*[.!?]/g)?.length || 0;
    const paragraphs = text.split(/\n\n/).filter(p => p.trim() !== '').length;
    const readingSpeed = parseInt(readingSpeedInput.value);
    const readingTimeMinutes = Math.ceil(words / readingSpeed);

    wordCount.textContent = `Words: ${words}`;
    charCount.textContent = `Characters: ${charsWithoutSpaces}`;
    charCountWithSpaces.textContent = `Characters (with spaces): ${charsWithSpaces}`;
    sentenceCount.textContent = `Sentences: ${sentences}`;
    paragraphCount.textContent = `Paragraphs: ${paragraphs}`;
    readingTime.textContent = `Reading Time: ${readingTimeMinutes} minute${readingTimeMinutes > 1 ? 's' : ''}`;

    const readabilityScoreValue = calculateReadabilityScore(text);
    const toneAndSentimentValue = calculateToneAndSentiment(text);
    readabilityScore.textContent = `Readability Score: ${readabilityScoreValue}`;
    toneAndSentiment.textContent = `Tone and Sentiment: ${toneAndSentimentValue}`;

    updateWordFrequencyList(text);
    updateSentenceStructureAnalysis(text);

    // Save statistics to history
    const statistics = {
        words,
        charsWithoutSpaces,
        charsWithSpaces,
        sentences,
        paragraphs,
        readingTimeMinutes,
        readabilityScoreValue,
        toneAndSentimentValue,
        timestamp: new Date().toLocaleString()
    };
    history.push(statistics);
    updateHistoryList();
});

clearButton.addEventListener('click', () => {
    textArea.value = '';
    wordCount.textContent = 'Words: 0';
    charCount.textContent = 'Characters: 0';
    charCountWithSpaces.textContent = 'Characters (with spaces): 0';
    sentenceCount.textContent = 'Sentences: 0';
    paragraphCount.textContent = 'Paragraphs: 0';
    readingTime.textContent = 'Reading Time: 0 minutes';
    readabilityScore.textContent = 'Readability Score: 0';
    toneAndSentiment.textContent = 'Tone and Sentiment: Neutral';
});

saveButton.addEventListener('click', () => {
    const text = textArea.value;
    localStorage.setItem('savedText', text);
    alert('Text saved!');
});

loadButton.addEventListener('click', () => {
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
        textArea.value = savedText;
        // Trigger input event to update statistics
        textArea.dispatchEvent(new Event('input'));
    } else {
        alert('No saved text found!');
    }
});

copyButton.addEventListener('click', () => {
    const statistics = `
        Words: ${wordCount.textContent.split(': ')[1]}
        Characters: ${charCount.textContent.split(': ')[1]}
        Characters (with spaces): ${charCountWithSpaces.textContent.split(': ')[1]}
        Sentences: ${sentenceCount.textContent.split(': ')[1]}
        Paragraphs: ${paragraphCount.textContent.split(': ')[1]}
        Reading Time: ${readingTime.textContent.split(': ')[1]}
        Readability Score: ${readabilityScore.textContent.split(': ')[1]}
        Tone and Sentiment: ${toneAndSentiment.textContent.split(': ')[1]}
    `;
    navigator.clipboard.writeText(statistics).then(() => {
        alert('Statistics copied to clipboard!');
    });
});

readingSpeedInput.addEventListener('input', () => {
    // Trigger input event on text area to update reading time
    textArea.dispatchEvent(new Event('input'));
});

function updateHistoryList() {
    historyList.innerHTML = '';
    history.forEach((statistics, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Statistics at ${statistics.timestamp}`;
        listItem.addEventListener('click', () => {
            // Display detailed statistics
            alert(`
                Words: ${statistics.words}
                Characters: ${statistics.charsWithoutSpaces}
                Characters (with spaces): ${statistics.charsWithSpaces}
                Sentences: ${statistics.sentences}
                Paragraphs: ${statistics.paragraphs}
                Reading Time: ${statistics.readingTimeMinutes} minute${statistics.readingTimeMinutes > 1 ? 's' : ''}
                Readability Score: ${statistics.readabilityScoreValue}
                Tone and Sentiment: ${statistics.toneAndSentimentValue}
            `);
        });
        historyList.appendChild(listItem);
    });
}

function calculateReadabilityScore(text) {
    const words = text.trim().split(/\s+/);
    const sentences = text.match(/[^.!?]*[.!?]/g);
    const syllables = words.reduce((total, word) => total + countSyllables(word), 0);

    const avgSentenceLen = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    const score = 206.835 - 1.015 * avgSentenceLen - 84.6 * avgSyllablesPerWord;
    return score.toFixed(2);
}

function countSyllables(word) {
    word = word.toLowerCase();
    const vowels = 'aeiouy';
    const diphthongs = ['ai', 'au', 'ay', 'ea', 'ee', 'ei', 'ey', 'oa', 'oo', 'ou', 'oy'];
    let syllableCount = 0;

    // Remove non-alphabetic characters
    word = word.replace(/[^a-z]/g, '');

    // Count vowel sounds
    for (let i = 0; i < word.length; i++) {
        if (vowels.includes(word[i]) && (i === 0 || !vowels.includes(word[i - 1]))) {
            syllableCount++;
        }
    }

    // Adjust for diphthongs
    diphthongs.forEach(diphthong => {
        if (word.includes(diphthong)) {
            syllableCount--;
        }
    });

    // Ensure syllable count is at least 1
    return Math.max(syllableCount, 1);
}

function calculateToneAndSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'nice', 'love', 'amazing', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'angry', 'hate', 'poor', 'worst'];
    const words = text.trim().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        if (positiveWords.includes(cleanWord)) {
            positiveCount++;
        } else if (negativeWords.includes(cleanWord)) {
            negativeCount++;
        }
    });

    if (positiveCount > negativeCount) {
        return 'Positive';
    } else if (negativeCount > positiveCount) {
        return 'Negative';
    } else {
        return 'Neutral';
    }
}

function updateWordFrequencyList(text) {
    const words = text.trim().split(/\s+/);
    const wordFrequency = {};
    words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        if (wordFrequency[cleanWord]) {
            wordFrequency[cleanWord]++;
        } else {
            wordFrequency[cleanWord] = 1;
        }
    });

    const wordFrequencyList = document.getElementById('word-frequency-list');
    wordFrequencyList.innerHTML = '';
    Object.keys(wordFrequency).forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = `${word}: ${wordFrequency[word]}`;
        wordFrequencyList.appendChild(listItem);
    });
}

function updateSentenceStructureAnalysis(text) {
    const sentences = text.match(/[^.!?]*[.!?]/g);
    const sentenceStructureAnalysis = document.getElementById('sentence-structure-analysis');
    if (sentences) {
        sentenceStructureAnalysis.innerHTML = '';
        sentences.forEach((sentence, index) => {
            const sentenceLength = sentence.trim().split(/\s+/).length;
            const listItem = document.createElement('li');
            listItem.textContent = `Sentence ${index + 1}: ${sentenceLength} words`;
            sentenceStructureAnalysis.appendChild(listItem);
        });
    } else {
        sentenceStructureAnalysis.innerHTML = 'No sentences found.';
    }
}

exportButton.addEventListener('click', () => {
    const text = textArea.value;
    const statistics = `
        Words: ${wordCount.textContent.split(': ')[1]}
        Characters: ${charCount.textContent.split(': ')[1]}
        Characters (with spaces): ${charCountWithSpaces.textContent.split(': ')[1]}
        Sentences: ${sentenceCount.textContent.split(': ')[1]}
        Paragraphs: ${paragraphCount.textContent.split(': ')[1]}
        Reading Time: ${readingTime.textContent.split(': ')[1]}
        Readability Score: ${readabilityScore.textContent.split(': ')[1]}
        Tone and Sentiment: ${toneAndSentiment.textContent.split(': ')[1]}
    `;
    const blob = new Blob([text + '\n\n' + statistics], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'text-statistics.txt';
    link.click();
});

// Theme toggle button
const themeToggleButton = document.getElementById('theme-toggle-button');
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Initialize theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// Save theme preference
themeToggleButton.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});