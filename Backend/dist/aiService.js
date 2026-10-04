"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseKeys(envValue) {
    if (!envValue)
        return [];
    return envValue
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 5);
}
function getFailureReason(err) {
    const msg = (err.message || '').toLowerCase();
    if (msg.includes('429') || msg.includes('rate limit') || msg.includes('too many requests')) {
        return 'Rate Limit Exceeded (429)';
    }
    if (msg.includes('quota') || msg.includes('resource has been exhausted') || msg.includes('insufficient_quota')) {
        return 'Quota Limit Exhausted';
    }
    if (msg.includes('402') || msg.includes('payment required') || msg.includes('credit')) {
        return 'Credits Depleted (402)';
    }
    if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid api key')) {
        return 'Invalid/Expired API Key';
    }
    if (msg.includes('503') || msg.includes('overloaded') || msg.includes('timeout')) {
        return 'Provider Overloaded / Timeout';
    }
    return 'Provider Error';
}
async function callOpenAICompatible({ url, apiKey, model, messages, systemPrompt, temperature = 0.7, maxTokens = 800, jsonMode = false }) {
    const formattedMessages = [];
    if (systemPrompt) {
        formattedMessages.push({ role: 'system', content: systemPrompt });
    }
    for (const m of messages) {
        formattedMessages.push({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content || m.text || '',
        });
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000);
    const payload = {
        model,
        messages: formattedMessages,
        temperature,
        max_tokens: maxTokens,
    };
    if (jsonMode) {
        payload.response_format = { type: 'json_object' };
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            throw new Error('HTTP ' + response.status + ': ' + errorText);
        }
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }
    finally {
        clearTimeout(timeoutId);
    }
}
async function callGemini({ apiKey, messages, systemPrompt, model = 'gemini-2.0-flash', jsonMode = false, maxTokens = 1200 }) {
    const contents = [];
    for (const m of messages) {
        contents.push({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content || m.text || '' }],
        });
    }
    const body = {
        contents,
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: maxTokens,
            ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
        },
    };
    if (systemPrompt) {
        body.systemInstruction = {
            parts: [{ text: systemPrompt }],
        };
    }
    const makeAttempt = async (targetModel) => {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + targetModel + ':generateContent?key=' + apiKey;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 22000);
        try {
            return await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal,
            });
        }
        finally {
            clearTimeout(timeoutId);
        }
    };
    let response = await makeAttempt(model);
    // If 503 (temporary capacity spike), wait 1.2s and retry once
    if (response.status === 503) {
        console.log('[Gemini] Received 503 capacity spike, auto-retrying in 1.2s...');
        await new Promise((r) => setTimeout(r, 1200));
        response = await makeAttempt(model);
    }
    if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error('Gemini HTTP ' + response.status + ': ' + errText);
    }
    const data = await response.json();
    const rawCandidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawCandidate) {
        throw new Error('Gemini candidate returned empty response');
    }
    return rawCandidate;
}
function detectQueryLanguage(text) {
    if (!text)
        return 'english';
    // Check for Bengali Unicode script characters
    if (/[\u0980-\u09FF]/.test(text)) {
        return 'bangla';
    }
    // Check for common Banglish vocabulary
    const banglishPatterns = /\b(kivabe|koto|taka|boi|boiyer|nebo|nibo|dibo|debe|lagbe|chai|korte|koro|korbo|pabo|ache|achi|kemon|valo|bhalo|kichu|kothay|kokhon|keno|amader|apnar|porbo|porar|shomoy|sesh|dite|hobe)\b/i;
    if (banglishPatterns.test(text)) {
        return 'banglish';
    }
    return 'english';
}
function getLocalLibrelloFallback(userMessage) {
    const q = (userMessage || '').toLowerCase();
    const lang = detectQueryLanguage(userMessage);
    // 1. Delivery & Fees Query
    if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('charge') || q.includes('delivery') || q.includes('ভাড়া') || q.includes('চার্জ') || q.includes('খরচ')) {
        if (lang === 'bangla') {
            return '### লিব্রেলো ডেলিভারি এবং সার্ভিস ফি\n\n' +
                '- **হোম ডেলিভারি চার্জ:** আপনার লোকেশন অনুযায়ী ফ্ল্যাট **৳৫০ থেকে ৳৮০**।\n' +
                '- **বই পড়ার মেয়াদ:** প্রাথমিক ধার নেওয়ার সময় **১৪ দিন** (১-ক্লিকে রিনিউ করার সুযোগ রয়েছে)।\n' +
                '- **ফ্রি ডেলিভারি অফার:** প্রিমিয়াম মেম্বারদের জন্য ডেলিভারি সম্পূর্ণ ফ্রি!\n' +
                '- **রিটার্ন সুবিধা:** পড়া শেষে ড্যাশবোর্ডে জানালেই আমাদের কুরিয়ার আপনার বাসা থেকে বই সংগ্রহ করবে।\n\n' +
                '*বই অর্ডার করতে [All Books](/books) পেজে গিয়ে আপনার পছন্দের বইটি নির্বাচন করুন!*';
        }
        if (lang === 'banglish') {
            return '### Librello Delivery & Service Fees\n\n' +
                '- **Doorstep Delivery Charge:** Apnar area onujayi flat **50 theke 80 taka** lagbe।\n' +
                '- **Borrow Korar Shomoy:** Standard duration **14 din**, dorkar hole 1-click e renew korte parben।\n' +
                '- **Free Delivery Offer:** VIP ba Premium members ra free delivery paben!\n' +
                '- **Easy Return:** Pora sesh hole dashboard theke request korlei courier eshe boi niye jabe।\n\n' +
                '*Boi order korte [All Books](/books) page theke browse korun!*';
        }
        return '### Librello Delivery and Service Fees\n\n' +
            '- **Standard Doorstep Delivery**: Flat **$3.00 - $5.00** depending on your location area.\n' +
            '- **Borrowing Duration**: Default borrowing period is **14 days** with a 1-click renewal option.\n' +
            '- **Free Delivery Promo**: Users with active Premium memberships enjoy free delivery.\n' +
            '- **Returns**: Convenient doorstep pickup by our verified logistics dispatchers.\n\n' +
            '*Need to place a request? Browse our [Books Catalog](/books) and select Borrow Book.*';
    }
    // 2. How to Borrow / Order
    if (q.includes('how to borrow') || q.includes('borrow') || q.includes('order') || q.includes('request') || q.includes('ধার') || q.includes('অর্ডার') || q.includes('নেব')) {
        if (lang === 'bangla') {
            return '### লিব্রেলো থেকে বই ধার নেওয়ার নিয়ম\n\n' +
                '1. **ক্যাটালগ দেখুন:** [All Books](/books) পেজ থেকে আপনার পছন্দের বই সিলেক্ট করুন।\n' +
                '2. **ডিটেইলস জানুন:** বইয়ের বিবরণ, রেটিং এবং ফি দেখে নিন।\n' +
                '3. **অর্ডার কনফার্ম করুন:** "Borrow Book" বাটনে ক্লিক করে ডেলিভারি ঠিকানা দিন।\n' +
                '4. **হোম ডেলিভারি:** আমাদের ডিসপ্যাচার সরাসরি আপনার দরজায় বই পৌঁছে দেবে।\n' +
                '5. **রিটার্ন করুন:** পড়ার মেয়াদ শেষে আমাদের কুরিয়ারের কাছে বইটি বুঝিয়ে দিন।';
        }
        if (lang === 'banglish') {
            return '### Librello Theke Boi Borrow Korar Steps\n\n' +
                '1. **Catalog Browse Korun:** [All Books](/books) page e giye apnar pochonder boi select korun।\n' +
                '2. **Details Dekhun:** Boiyer synopsis, rating ebong delivery fee check korun।\n' +
                '3. **Order Place Korun:** "Borrow Book" button e click kore delivery address din।\n' +
                '4. **Doorstep Arrival:** Dispatcher shorashori apnar basai boi pouchhe debe।\n' +
                '5. **Easy Return:** Pora sesh hole courier ke boi bujhiye din।';
        }
        return '### How to Borrow a Book from Librello\n\n' +
            '1. **Browse Catalog**: Visit the [All Books](/books) page to discover curated titles.\n' +
            '2. **Select & Review**: Click on any book to see synopsis, reader vibe, and lending details.\n' +
            '3. **Request Delivery**: Click the **Borrow Book** button and enter your delivery address.\n' +
            '4. **Doorstep Arrival**: Our dispatcher brings the physical book straight to your doorstep.\n' +
            '5. **Easy Return**: Hand it back to our courier when your loan period concludes.';
    }
    // 3. Book Recommendations
    if (q.includes('recommend') || q.includes('suggest') || q.includes('top book') || q.includes('best book') || q.includes('favorite') || q.includes('সাজেস্ট') || q.includes('পরামর্শ')) {
        if (lang === 'bangla') {
            return '### লিব্রেলোর কিছু জনপ্রিয় সেরা বই\n\n' +
                '- **"The Midnight Library"** (ম্যাট হেইগ): জীবন ও পছন্দের এক অনুপ্রেরণামূলক ফিকশন\n' +
                '- **"Atomic Habits"** (জেমস ক্লিয়ার): প্রতিদিনের ছোট অভ্যাসের দারুণ পরিবর্তন\n' +
                '- **"Project Hail Mary"** (অ্যান্ডি ওয়্যার): রোমাঞ্চকর স্পেস ও সায়েন্স ফিকশন\n' +
                '- **"Sapiens"** (ইউভাল নোয়াহ হারারি): মানব ইতিহাসের চমকপ্রদ ইতিহাস\n\n' +
                '*সব বই ব্রাউজ করে অর্ডার করতে [All Books](/books) পেজে চলে যান!*';
        }
        if (lang === 'banglish') {
            return '### Librello-r Kichhu Top Recommended Boi\n\n' +
                '- **"The Midnight Library"** by Matt Haig: Fiction (Parallel lives niye thrilling ekta story)\n' +
                '- **"Atomic Habits"** by James Clear: Self-Help (Daily habits improve korar best guide)\n' +
                '- **"Project Hail Mary"** by Andy Weir: Sci-Fi (Space adventure ebong science)\n' +
                '- **"Sapiens"** by Yuval Noah Harari: History & Non-Fiction\n\n' +
                '*Shob gulo boi dekhte [All Books](/books) page visit korun!*';
        }
        return '### Recommended Reads on Librello\n\n' +
            'Here are some reader favorites available in our catalog:\n\n' +
            '- **"The Midnight Library"** by Matt Haig: Fiction / Contemporary (A heartwarming exploration of choices and parallel lives)\n' +
            '- **"Atomic Habits"** by James Clear: Self-Help / Productivity (Practical framework for daily micro-improvements)\n' +
            '- **"Project Hail Mary"** by Andy Weir: Sci-Fi / Space Adventure (A thrilling journey of survival and science)\n' +
            '- **"Sapiens: A Brief History of Humankind"** by Yuval Noah Harari: History / Non-Fiction\n\n' +
            '*Browse our full collection on the [All Books](/books) page to request doorstep delivery today!*';
    }
    // 4. Librarian Tools
    if (q.includes('librarian') || q.includes('upload') || q.includes('catalog') || q.includes('add book') || q.includes('লাইব্রেরিয়ান')) {
        if (lang === 'bangla') {
            return '### লাইব্রেরিয়ান অটোমেশন ও টুলস\n\n' +
                '- **লাইব্রেরিয়ান ড্যাশবোর্ড:** অথোরাইজড লাইব্রেরিয়ানরা [Librarian Dashboard](/dashboard/librarian) থেকে ইনভেন্টরি ও ডেলিভারি ম্যানেজ করতে পারেন।\n' +
                '- **AI বুক কভার স্ক্যানার:** বইয়ের কভারের ছবি আপলোড করলেই AI চোখের পলকে বইয়ের নাম, লেখক ও বিবরণ অটো-ফিল করে দেয়!\n' +
                '- **ডেলিভারি ডিসপ্যাচ:** কুরিয়ার অ্যাসাইন এবং ট্র্যাকিং সরাসরি ড্যাশবোর্ড থেকেই সম্ভব।';
        }
        if (lang === 'banglish') {
            return '### Librarian Automation & Tools\n\n' +
                '- **Librarian Dashboard:** Authorized librarian-ra [Librarian Dashboard](/dashboard/librarian) theke inventory ebong deliveries control korte paren।\n' +
                '- **AI Auto-Cataloger:** Boiyer cover photo upload korlei AI instantly title, author ebong description auto-fill kore dey!\n' +
                '- **Dispatch Tracking:** Courier assign ebong delivery status realtime-e monitor kora jay।';
        }
        return '### Librarian Automation and Tools\n\n' +
            '- **Librarian Dashboard**: Authorized librarians can manage inventory, approve loans, and track dispatch status via the [Librarian Dashboard](/dashboard/librarian).\n' +
            '- **AI Auto-Cataloger**: Upload any book cover photo to automatically detect the title, author, genre, and description instantly.\n' +
            '- **Dispatch Management**: Assign couriers and track deliveries in real time.';
    }
    // 5. Default Greetings
    if (lang === 'bangla') {
        return '### নমস্কার! আমি লিব্রেলো কনসিয়ার্জ, আপনার লাইব্রেরি সহকারী\n\n' +
            'আমি আপনাকে সাহায্য করতে পারি:\n' +
            '- **হোম ডেলিভারি ফি এবং নিয়মাবলী**\n' +
            '- **বইয়ের পছন্দ ও পারসোনালাইজড রেকমেন্ডেশন**\n' +
            '- **বই ধার নেওয়া এবং ফেরত দেওয়ার নিয়ম**\n' +
            '- **লাইব্রেরিয়ান ড্যাশবোর্ড সংক্রান্ত তথ্য**\n\n' +
            'আজ আপনাকে কীভাবে সাহায্য করতে পারি?';
    }
    if (lang === 'banglish') {
        return '### Hello! Ami Librello Concierge, apnar smart library assistant\n\n' +
            'Ami apnake sahajjo korte pari:\n' +
            '- **Doorstep Delivery Rates & Process**\n' +
            '- **Boi Suggestions & Recommendations**\n' +
            '- **Borrowing & Return Policies**\n' +
            '- **Librarian Dashboard Features**\n\n' +
            'Bolun, aj apnake kivabe help korte pari?';
    }
    return '### Hello! I am Librello Concierge, your Library Assistant\n\n' +
        'I can help you with:\n' +
        '- **Doorstep Delivery Rates and Process**\n' +
        '- **Personalized Book Recommendations**\n' +
        '- **Borrowing and Return Policies**\n' +
        '- **Librarian Dashboard Features**\n\n' +
        'How can I help you discover your next great read today?';
}
// Retain alias for any internal/backward references
const getLocalBiblioBotFallback = getLocalLibrelloFallback;
async function generateChatCompletion({ messages, systemPrompt, catalogContext = '' }) {
    const enhancedSystemPrompt = (systemPrompt || 'You are Librello Concierge, the friendly, helpful, and highly intelligent literary advisor for Librello: a modern community library catalog and lending platform.') +
        '\n\nPlatform Knowledge:\n' +
        '- Librello delivers and circulates physical curated library editions to readers.\n' +
        '- Readers borrow books for 14 days, pay standard nominal logistics fees (approx 50-80 BDT / $3-$5), and schedule convenient returns.\n' +
        '- Curators and librarians catalog books, inspect cover imagery with AI, and track circulation.\n' +
        (catalogContext ? ('\nLive Catalog Sample:\n' + catalogContext) : '') +
        '\n\nDYNAMIC LANGUAGE ADAPTATION & MIRRORING (CRITICAL RULE):\n' +
        'You must automatically detect the user\'s language and writing style, and ALWAYS match it identically:\n' +
        '1. If the user writes in English -> Respond in fluent, polite, well-structured English.\n' +
        '2. If the user writes in Bengali script (বাংলায় লিখলে) -> Respond strictly in natural, polite Bengali script (বাংলায় গুছিয়ে সুন্দর পয়েন্ট আকারে উত্তর দিন).\n' +
        '3. If the user writes in Banglish / Romanized Bengali (e.g., "kivabe boi nibo?", "delivery charge koto?", "kemon acho?", "order korte chai") -> Respond naturally in friendly, helpful Banglish (Romanized Bengali using English alphabets, e.g., "Librello-te doorstep delivery flat 50 theke 80 taka. Apni je kono boi 14 diner jonno borrow korte parben...").\n\n' +
        'Style: Be warm, concise, professional, and well-structured with Markdown (bullet points, bold text). Strictly avoid using emojis or em dashes. If asked about recommendations, suggest real books from catalog or renowned favorites.';
    const providers = [
        {
            name: 'Groq',
            keys: parseKeys(process.env.GROQ_API_KEY),
            call: (apiKey) => callOpenAICompatible({
                url: 'https://api.groq.com/openai/v1/chat/completions',
                apiKey,
                model: 'llama-3.3-70b-versatile',
                messages,
                systemPrompt: enhancedSystemPrompt,
                maxTokens: 450,
            }),
        },
        {
            name: 'OpenRouter',
            keys: parseKeys(process.env.OPENROUTER_API_KEY),
            call: (apiKey) => callOpenAICompatible({
                url: 'https://openrouter.ai/api/v1/chat/completions',
                apiKey,
                model: 'deepseek/deepseek-chat:free',
                messages,
                systemPrompt: enhancedSystemPrompt,
            }),
        },
        {
            name: 'Gemini',
            keys: parseKeys(process.env.GEMINI_API_KEY),
            call: (apiKey) => callGemini({
                apiKey,
                messages,
                systemPrompt: enhancedSystemPrompt,
                model: 'gemini-2.0-flash',
            }),
        },
        {
            name: 'Mistral',
            keys: parseKeys(process.env.MISTRAL_API_KEY),
            call: (apiKey) => callOpenAICompatible({
                url: 'https://api.mistral.ai/v1/chat/completions',
                apiKey,
                model: 'mistral-small-latest',
                messages,
                systemPrompt: enhancedSystemPrompt,
            }),
        },
    ];
    const fallbackChain = [];
    for (const provider of providers) {
        if (!provider.keys || provider.keys.length === 0) {
            fallbackChain.push({
                provider: provider.name,
                status: 'skipped',
                reason: 'No API Key configured',
            });
            continue;
        }
        for (let i = 0; i < provider.keys.length; i++) {
            const apiKey = provider.keys[i];
            const keyLabel = provider.keys.length > 1 ? (' (key ' + (i + 1) + '/' + provider.keys.length + ')') : '';
            try {
                console.log('[AI Engine] Attempting ' + provider.name + keyLabel + '...');
                const text = await provider.call(apiKey);
                if (text && text.trim().length > 0) {
                    return {
                        text,
                        provider: provider.name,
                        fallbackChain: fallbackChain.concat({
                            provider: provider.name,
                            status: 'success',
                        }),
                    };
                }
            }
            catch (err) {
                const failureReason = getFailureReason(err);
                console.warn('[AI Engine] ' + provider.name + keyLabel + ' failed: ' + failureReason + ' - ' + err.message);
                fallbackChain.push({
                    provider: provider.name + keyLabel,
                    status: 'failed',
                    reason: failureReason,
                });
            }
        }
    }
    // Graceful fallback to Local Knowledge Core
    console.log('[AI Engine] Cascading to Librello Local Knowledge Core...');
    const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
    const localReply = getLocalLibrelloFallback(lastUserMsg);
    return {
        text: localReply,
        provider: 'Local Knowledge Core',
        fallbackChain: fallbackChain.concat({
            provider: 'Local Knowledge Core',
            status: 'success',
            reason: 'Zero-downtime offline fallback',
        }),
    };
}
/**
 * Helper to safely extract JSON from LLM text responses
 */
function extractJSONFromText(text) {
    if (!text)
        throw new Error('Empty AI response');
    let clean = text.trim();
    // Strip code fences
    clean = clean.replace(/```json/gi, '').replace(/```/g, '').trim();
    // 1. Direct JSON parse
    try {
        return JSON.parse(clean);
    }
    catch (e1) {
        // 2. Outermost JSON object via regex
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            }
            catch (e2) {
                // Fall through to auto-repair
            }
        }
        // 3. Auto-repair truncated JSON
        try {
            let repaired = clean;
            const firstBrace = repaired.indexOf('{');
            if (firstBrace !== -1) {
                repaired = repaired.substring(firstBrace);
            }
            // Close open quotes
            const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
            if (quoteCount % 2 !== 0) {
                repaired += '"';
            }
            // Trim trailing commas
            repaired = repaired.replace(/,\s*$/, '');
            // Balance brackets
            const openBrackets = (repaired.match(/\[/g) || []).length;
            const closeBrackets = (repaired.match(/\]/g) || []).length;
            if (openBrackets > closeBrackets) {
                repaired += ']'.repeat(openBrackets - closeBrackets);
            }
            repaired = repaired.replace(/,\s*$/, '');
            // Balance braces
            const openBraces = (repaired.match(/\{/g) || []).length;
            const closeBraces = (repaired.match(/\}/g) || []).length;
            if (openBraces > closeBraces) {
                repaired += '}'.repeat(openBraces - closeBraces);
            }
            return JSON.parse(repaired);
        }
        catch (e3) {
            throw new Error('Could not parse AI response as JSON: ' + clean.substring(0, 150));
        }
    }
}
async function scanBookCoverImage({ imageBase64, base64Data, image, mimeType = 'image/jpeg' }) {
    const rawImage = imageBase64 || base64Data || image;
    if (!rawImage) {
        throw new Error('Image data is required for scanning');
    }
    // Strip data URL prefix if present (e.g. data:image/png;base64,...)
    let cleanBase64 = rawImage;
    if (cleanBase64.includes(',')) {
        const parts = cleanBase64.split(',');
        cleanBase64 = parts[1];
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) {
            mimeType = mimeMatch[1];
        }
    }
    const promptText = "Analyze this book cover image carefully. Extract the book title, author, category/genre, and write a compelling 2-sentence synopsis for the library catalog. Also suggest a reasonable doorstep handling fee ($3 to $8). Return ONLY a valid JSON object matching this schema with no markdown backticks:\n" +
        "{\n" +
        '  "title": "Exact book title",\n' +
        '  "author": "Author name",\n' +
        '  "category": "Fiction | Sci-Fi | Academic | Biography | Mystery | History | Self-Help | General",\n' +
        '  "fee": 5,\n' +
        '  "description": "2-sentence synopsis..."\n' +
        '}';
    // Attempt 1: Groq Vision (llama-3.2-11b-vision-preview)
    const groqKeys = parseKeys(process.env.GROQ_API_KEY);
    for (let i = 0; i < groqKeys.length; i++) {
        const apiKey = groqKeys[i];
        try {
            console.log('[AI Vision] Attempting Groq Vision...');
            const url = 'https://api.groq.com/openai/v1/chat/completions';
            const body = {
                model: 'llama-3.2-11b-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: promptText },
                            {
                                type: 'image_url',
                                image_url: { url: 'data:' + mimeType + ';base64,' + cleanBase64 }
                            }
                        ]
                    }
                ],
                temperature: 0.1,
                max_tokens: 600
            };
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 18000);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + apiKey
                },
                body: JSON.stringify(body),
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
            if (response.ok) {
                const resData = await response.json();
                const rawOutput = resData.choices?.[0]?.message?.content;
                if (rawOutput) {
                    const parsed = extractJSONFromText(rawOutput);
                    return {
                        success: true,
                        book: {
                            title: parsed.title || 'Unknown Title',
                            author: parsed.author || 'Unknown Author',
                            category: parsed.category || 'Fiction',
                            fee: Number(parsed.fee) || 5,
                            description: parsed.description || 'Physical edition cataloged for Librello collection.'
                        },
                        provider: 'Groq Vision'
                    };
                }
            }
        }
        catch (err) {
            console.warn('[AI Vision] Groq Vision attempt failed:', err.message);
        }
    }
    // Attempt 2: OpenRouter Vision (inclusionai/ling-3.0-flash-vl:free)
    const openrouterKeys = parseKeys(process.env.OPENROUTER_API_KEY);
    for (let i = 0; i < openrouterKeys.length; i++) {
        const apiKey = openrouterKeys[i];
        try {
            console.log('[AI Vision] Attempting OpenRouter Vision...');
            const url = 'https://openrouter.ai/api/v1/chat/completions';
            const body = {
                model: 'inclusionai/ling-3.0-flash-vl:free',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: promptText },
                            {
                                type: 'image_url',
                                image_url: { url: 'data:' + mimeType + ';base64,' + cleanBase64 }
                            }
                        ]
                    }
                ]
            };
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 18000);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + apiKey
                },
                body: JSON.stringify(body),
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
            if (response.ok) {
                const resData = await response.json();
                const rawOutput = resData.choices?.[0]?.message?.content;
                if (rawOutput) {
                    const parsed = extractJSONFromText(rawOutput);
                    return {
                        success: true,
                        book: {
                            title: parsed.title || 'Unknown Title',
                            author: parsed.author || 'Unknown Author',
                            category: parsed.category || 'Fiction',
                            fee: Number(parsed.fee) || 5,
                            description: parsed.description || 'Physical edition cataloged for Librello collection.'
                        },
                        provider: 'OpenRouter Vision'
                    };
                }
            }
        }
        catch (err) {
            console.warn('[AI Vision] OpenRouter Vision attempt failed:', err.message);
        }
    }
    // Attempt 3: Google Gemini Vision (gemini-2.0-flash)
    const geminiKeys = parseKeys(process.env.GEMINI_API_KEY);
    for (let i = 0; i < geminiKeys.length; i++) {
        const apiKey = geminiKeys[i];
        try {
            console.log('[AI Vision] Attempting Gemini 2.0 Flash Vision...');
            const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;
            const body = {
                contents: [
                    {
                        parts: [
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: cleanBase64
                                }
                            },
                            {
                                text: promptText
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 600
                }
            };
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 18000);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
            if (!response.ok) {
                const errText = await response.text().catch(() => '');
                throw new Error('Gemini Vision HTTP ' + response.status + ': ' + errText);
            }
            const resData = await response.json();
            const rawOutput = resData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawOutput) {
                const parsed = extractJSONFromText(rawOutput);
                return {
                    success: true,
                    book: {
                        title: parsed.title || 'Unknown Title',
                        author: parsed.author || 'Unknown Author',
                        category: parsed.category || 'Fiction',
                        fee: Number(parsed.fee) || 5,
                        description: parsed.description || 'Physical edition cataloged for Librello collection.'
                    },
                    provider: 'Gemini Vision'
                };
            }
        }
        catch (err) {
            console.warn('[AI Vision] Gemini Vision attempt failed:', err.message);
        }
    }
    // Fallback: Smart Catalog Extraction
    console.log('[AI Vision] Providing Smart Auto-Cataloger Fallback...');
    return {
        success: true,
        book: {
            title: 'New Book Catalog Entry',
            author: 'Author Name (Confirm from cover)',
            category: 'Fiction',
            fee: 5,
            description: 'Physical edition scanned and processed through Librello Auto-Cataloger. Ready for member borrowing.'
        },
        provider: 'Local Vision Core',
        fallbackReason: 'Vision API keys not configured or busy'
    };
}
/**
 * Generates literary reader insights ("Should I Read This?") for readers on BookDetails page
 * Uses cascade: Groq -> OpenRouter -> Gemini -> Mistral -> Local Smart Fallback
 */
async function generateBookInsights({ title, author, category, description }) {
    const bookTitle = title || 'Untitled Book';
    const bookAuthor = author || 'Unknown Author';
    const bookCategory = category || 'General';
    const bookDesc = description || 'A notable physical edition in the Librello catalog.';
    const prompt = `You are an expert literary curator and reading advisor for Librello (a community library catalog and exchange platform).
Analyze this book to help a reader decide if they should borrow it:
Title: "${bookTitle}"
Author: "${bookAuthor}"
Category: "${bookCategory}"
Synopsis: "${bookDesc}"

Provide an insightful, engaging, and strictly spoiler-free analysis.
Return ONLY a valid JSON object matching this exact structure with no surrounding markdown backticks:
{
  "bullets": [
    "First key takeaway or central theme (strictly spoiler-free)",
    "Second key takeaway or central theme (strictly spoiler-free)",
    "Third key takeaway or central theme (strictly spoiler-free)"
  ],
  "targetAudience": {
    "perfectFor": "Specific type of reader who will love this book",
    "skipIf": "When a reader might prefer to pick another book"
  },
  "readingVibe": {
    "pace": "Fast-Paced | Moderate | Reflective & Slow-Burn",
    "difficulty": "Easy & Accessible | Balanced & Engaging | Intellectually Dense",
    "estimatedDays": "e.g. 3-5 days (approx 30 mins/day)",
    "tone": "e.g. Inspiring, Dark & Atmospheric, Philosophical, Humorous"
  },
  "verdict": "A compelling 1-sentence bottom-line recommendation."
}`;
    const messages = [{ role: 'user', content: prompt }];
    const systemPrompt = 'You are Librello Book Insights Engine. You evaluate physical books for readers with objective, spoiler-free literary insights. Always respond strictly in valid JSON.';
    const providers = [
        {
            name: 'Groq',
            keys: parseKeys(process.env.GROQ_API_KEY),
            call: (apiKey) => callOpenAICompatible({
                url: 'https://api.groq.com/openai/v1/chat/completions',
                apiKey,
                model: 'llama-3.3-70b-versatile',
                messages,
                systemPrompt,
                temperature: 0.2,
                maxTokens: 420,
            }),
        },
        {
            name: 'OpenRouter',
            keys: parseKeys(process.env.OPENROUTER_API_KEY),
            call: (apiKey) => callOpenAICompatible({
                url: 'https://openrouter.ai/api/v1/chat/completions',
                apiKey,
                model: 'deepseek/deepseek-chat:free',
                messages,
                systemPrompt,
                temperature: 0.2,
                maxTokens: 700,
            }),
        },
        {
            name: 'Gemini',
            keys: parseKeys(process.env.GEMINI_API_KEY),
            call: (apiKey) => callGemini({
                apiKey,
                messages,
                systemPrompt,
                model: 'gemini-2.0-flash',
            }),
        },
        {
            name: 'Mistral',
            keys: parseKeys(process.env.MISTRAL_API_KEY),
            call: (apiKey) => callOpenAICompatible({
                url: 'https://api.mistral.ai/v1/chat/completions',
                apiKey,
                model: 'mistral-small-latest',
                messages,
                systemPrompt,
                temperature: 0.2,
                maxTokens: 700,
            }),
        },
    ];
    const fallbackChain = [];
    for (const provider of providers) {
        if (!provider.keys || provider.keys.length === 0)
            continue;
        for (let i = 0; i < provider.keys.length; i++) {
            const apiKey = provider.keys[i];
            try {
                console.log(`[AI Insights] Attempting ${provider.name}...`);
                const rawText = await provider.call(apiKey);
                if (rawText) {
                    const parsed = extractJSONFromText(rawText);
                    if (parsed && parsed.bullets && parsed.targetAudience && parsed.readingVibe) {
                        return {
                            success: true,
                            insights: parsed,
                            provider: provider.name,
                            fallbackChain: fallbackChain.concat({ provider: provider.name, status: 'success' }),
                        };
                    }
                }
            }
            catch (err) {
                console.warn(`[AI Insights] ${provider.name} failed:`, err.message);
                fallbackChain.push({ provider: provider.name, status: 'failed', reason: err.message });
            }
        }
    }
    // Offline zero-downtime smart fallback
    console.log('[AI Insights] Cascading to Local Smart Insights Fallback...');
    return {
        success: true,
        insights: {
            bullets: [
                `Core exploration centered around ${bookCategory.toLowerCase()} themes.`,
                `Engaging narrative and character development by ${bookAuthor}.`,
                'Thought-provoking ideas designed for readers seeking meaningful takeaways.'
            ],
            targetAudience: {
                perfectFor: `Readers enthusiastic about ${bookCategory} and well-crafted storytelling.`,
                skipIf: `If you are currently looking for a completely different genre outside of ${bookCategory}.`
            },
            readingVibe: {
                pace: 'Moderate & Engaging',
                difficulty: 'Balanced & Accessible',
                estimatedDays: '4-7 days (approx 30 mins/day)',
                tone: 'Thought-provoking'
            },
            verdict: `${bookTitle} is a worthwhile physical edition to borrow and explore from the Librello catalog.`
        },
        provider: 'Local Insights Core',
        fallbackChain: fallbackChain.concat({ provider: 'Local Insights Core', status: 'success' }),
    };
}
/**
 * Performs natural language semantic & mood-based book discovery
 * Uses cascade: Groq -> OpenRouter -> Gemini -> Mistral -> Local Fallback
 */
async function performSemanticMoodSearch({ query, catalog = [] }) {
    const userQuery = (query || '').trim();
    if (!userQuery) {
        return { success: false, error: 'Query is required' };
    }
    const catalogSample = catalog.slice(0, 20).map((b) => ({
        id: b._id ? b._id.toString() : b.id,
        title: b.title || 'Untitled',
        author: b.author || 'Unknown',
        category: b.category || 'General',
        description: (b.description || '').substring(0, 110)
    }));
    const prompt = `You are the English AI Semantic Search Engine for Librello.
User Query: "${userQuery}"
Catalog: ${JSON.stringify(catalogSample)}

Instructions:
- The search query and your response must be strictly in English.
- Return top 1 to 4 best matching books from the catalog.
- Keep each matchReason very brief (1 concise sentence, maximum 15 words).

Return ONLY valid JSON matching this exact format with NO markdown backticks:
{
  "moodDetected": "Short 2-3 word vibe in English",
  "matches": [
    { "id": "book id from catalog", "matchReason": "Concise reason under 15 words in English" }
  ]
}`;
    const messages = [{ role: 'user', content: prompt }];
    const systemPrompt = 'You are Librello Semantic Search Engine. Always respond strictly in valid JSON in English. Do not output markdown code blocks or explanations.';
    const providers = [
        {
            name: 'Groq',
            keys: parseKeys(process.env.GROQ_API_KEY),
            call: (apiKey) => callOpenAICompatible({
                url: 'https://api.groq.com/openai/v1/chat/completions',
                apiKey,
                model: 'llama-3.3-70b-versatile',
                messages,
                systemPrompt,
                temperature: 0.1,
                maxTokens: 350,
                jsonMode: true,
            }),
        },
        {
            name: 'OpenRouter',
            keys: parseKeys(process.env.OPENROUTER_API_KEY),
            call: (apiKey) => callOpenAICompatible({
                url: 'https://openrouter.ai/api/v1/chat/completions',
                apiKey,
                model: 'deepseek/deepseek-chat:free',
                messages,
                systemPrompt,
                temperature: 0.1,
                maxTokens: 350,
                jsonMode: true,
            }),
        },
        {
            name: 'Gemini',
            keys: parseKeys(process.env.GEMINI_API_KEY),
            call: (apiKey) => callGemini({
                apiKey,
                messages,
                systemPrompt,
                model: 'gemini-2.0-flash',
                jsonMode: true,
                maxTokens: 1200,
            }),
        },
        {
            name: 'Mistral',
            keys: parseKeys(process.env.MISTRAL_API_KEY),
            call: (apiKey) => callOpenAICompatible({
                url: 'https://api.mistral.ai/v1/chat/completions',
                apiKey,
                model: 'mistral-small-latest',
                messages,
                systemPrompt,
                temperature: 0.1,
                maxTokens: 350,
            }),
        },
    ];
    for (const provider of providers) {
        if (!provider.keys || provider.keys.length === 0)
            continue;
        for (let i = 0; i < provider.keys.length; i++) {
            const apiKey = provider.keys[i];
            try {
                console.log(`[AI Semantic Search] Attempting ${provider.name}...`);
                const raw = await provider.call(apiKey);
                if (raw) {
                    const parsed = extractJSONFromText(raw);
                    if (parsed && Array.isArray(parsed.matches)) {
                        return {
                            success: true,
                            moodDetected: parsed.moodDetected || 'Discovered Vibe',
                            matches: parsed.matches,
                            provider: provider.name
                        };
                    }
                }
            }
            catch (err) {
                console.warn(`[AI Semantic Search] ${provider.name} failed:`, err.message);
            }
        }
    }
    // Local fallback heuristic (English only)
    console.log('[AI Semantic Search] Using local heuristic fallback...');
    const lowerQuery = userQuery.toLowerCase();
    const localMatches = catalogSample
        .filter((b) => b.title.toLowerCase().includes(lowerQuery) ||
        b.category.toLowerCase().includes(lowerQuery) ||
        b.description.toLowerCase().includes(lowerQuery))
        .slice(0, 4)
        .map((b, idx) => ({
        id: b.id,
        matchReason: `Thematic match with ${b.category} aligning with your requested vibe.`,
        relevanceScore: 92 - idx * 4
    }));
    return {
        success: true,
        moodDetected: 'Discovered Selection',
        matches: localMatches.length > 0 ? localMatches : catalogSample.slice(0, 4).map((b) => ({
            id: b.id,
            matchReason: `Recommended title from our ${b.category} collection.`,
            relevanceScore: 85
        })),
        provider: 'Local Semantic Core'
    };
}
module.exports = {
    performSemanticMoodSearch,
    generateBookInsights,
    generateChatCompletion,
    scanBookCoverImage,
    parseKeys,
    getFailureReason,
    detectQueryLanguage,
    getLocalBiblioBotFallback,
    getLocalLibrelloFallback,
};
