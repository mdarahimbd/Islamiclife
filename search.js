// api/search.js

export default async function handler(req, res) {
    // শুধুমাত্র POST রিকোয়েস্ট গ্রহণ করবে
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { query } = req.body;

    // আপনার এনভায়রনমেন্ট ভেরিয়েবল থেকে API Key নেবে (পাবলিক হবে না)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "Server missing API Key" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AIzaSyCzs4dUxn1XnfD_5IXdEurwLGM2pnl1hnk}`;
            
    const prompt = `You are an expert Islamic Scholar. Provide accurate Islamic guidance based on the Quran and Sahih Hadith for the topic: "${query}".
    Provide the output STRICTLY in JSON format. DO NOT use markdown code blocks like \`\`\`json. Return ONLY a raw JSON object matching this exact structure:
    {
        "titleEn": "Topic Name in English",
        "titleBn": "Topic Name in Bengali",
        "summaryEn": "A 3-4 sentence comprehensive overview in English.",
        "summaryBn": "A 3-4 sentence comprehensive overview in simple Bengali.",
        "quranicEvidences": [
            {
                "arabic": "Exact Arabic verse",
                "translationEn": "English translation",
                "translationBn": "Bengali translation",
                "refEn": "Surah Name, Verse X",
                "refBn": "সূরা নাম, আয়াত X"
            }
        ],
        "hadithEvidences": [
            {
                "arabic": "Exact Arabic hadith",
                "translationEn": "English translation",
                "translationBn": "Bengali translation",
                "refEn": "Reference",
                "refBn": "রেফারেন্স"
            }
        ]
    }`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1 }
            })
        });

        const data = await response.json();
        let textResponse = data.candidates[0].content.parts[0].text;
        
        // JSON পরিষ্কার করা
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // ফ্রন্টএন্ডে ডেটা পাঠানো
        res.status(200).json(JSON.parse(textResponse));

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch from Gemini AI" });
    }
}
