const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/text/process', (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Debe enviar una cadena válida en el campo "text".' });
    }

    const steps = [];
    let current = text;

    const reverseInnerParentheses = (str) => {
        const regex = /\(([^()]+)\)/;
        let match;
        while ((match = regex.exec(str))) {
            const reversed = match[1].split('').reverse().join('');
            str = str.replace(match[0], reversed);
            steps.push(str);
        }
        return str;
    };

    steps.push(current);
    const finalResult = reverseInnerParentheses(current);

    res.json({ result: steps });
});


app.post('/text/transform', (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Debe enviar una cadena válida en el campo "text".' });
    }

    const alternatingCaps = text.split('').map((char, index) =>
        index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
    ).join('');

    const vowelMap = { a: 'e', e: 'i', i: 'o', o: 'u', u: 'a', A: 'E', E: 'I', I: 'O', O: 'U', U: 'A' };
    const vowelReplacement = text.split('').map((char) => vowelMap[char] || char).join('');

    const uniqueWords = [...new Set(
        text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
    )];

    res.json({
        alternating_caps: alternatingCaps,
        vowel_replacement: vowelReplacement,
        unique_words: uniqueWords
    });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));