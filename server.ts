import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid immediate crashes if API key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// API Routes
app.post("/api/quantum-oracle", async (req, res) => {
  const { name, prompt, coordinate, sector, lang } = req.body;
  const clientName = name || (lang === "uk" ? "Мандрівник" : lang === "en" ? "Quantum Traveler" : "Путешественник");
  const userPrompt = prompt || (lang === "uk" ? "Дай мені пораду для мого шляху." : lang === "en" ? "Give me a general prediction for my path." : "Дай мне совет для моего пути.");
  const coordText = coordinate ? `${lang === "uk" ? "Координати" : lang === "en" ? "Coordinates" : "Координаты"}: ${coordinate}` : "Sector: Core Zenith";
  const sectorText = sector ? `Sector: ${sector}` : "Dimension: Neon Horizon";

  const ukFallbackQuotes = [
    `Звукові хвилі на ${coordText} налаштовуються. Пам'ятайте, темп вашого життя — це ваша власна композиція. Грайте її голосно, грайте сміливо.`,
    `Наприкінці 90-х, коли біт дропу був чистим, ми не чекали дозволу. Ми просто танцювали. Поєднайте своє минуле з майбутнім прямо тут, у ${sectorText}.`,
    `Квантова суперпозиція означає, що ви всюди одночасно. Ваш потенціал безмежний, ${clientName}. Продовжуйте подорожувати по Neon Horizon.`,
    `Мій батько завжди казав: духовий інструмент — це просто холодний метал, поки твоє дихання не вдихне в нього життя. Нехай ваша пристрасть вдихне життя у ваші мрії сьогодні.`,
    `Музика — це не просто ноти; це простір між ними. Ваша тиша так само важлива, як і ваш звук. Знайдіть баланс у квантовому полі.`
  ];

  const enFallbackQuotes = [
    `The soundwaves at ${coordText} are aligning. Remember, the tempo of your life is your own composition. Play it loud, play it brave.`,
    `In the late 90s, when the beat drop was raw, we didn't wait for permission. We just danced. Connect your past with your future right here in ${sectorText}.`,
    `Quantum superposition means you are everywhere at once. Your potential is infinite, ${clientName}. Keep traveling the Neon Horizon.`,
    `My father always said: a brass instrument is just cold metal until your breath brings it to life. Let your passion breathe life into your dreams today.`,
    `Music isn't just notes; it's the space between them. Your silence is as important as your sound. Find balance in the quantum field.`
  ];

  const ruFallbackQuotes = [
    `Звуковые волны на ${coordText} настраиваются. Помните, темп вашей жизни — это ваша собственная композиция. Играйте ее громко, играйте смело.`,
    `В конце 90-х, когда бит дропа был чистым, мы не ждали разрешения. Мы просто танцевали. Соедините свое прошлое с будущим прямо здесь, в ${sectorText}.`,
    `Квантовая суперпозиция означает, что вы везде одновременно. Ваш потенциал бесконечен, ${clientName}. Продолжайте путешествовать по Neon Horizon.`,
    `Мой отец всегда говорил: духовой инструмент — это просто холодный металл, пока твое дыхание не вдохнет в него жизнь. Пусть ваша страсть вдохнет жизнь в ваши мечты сегодня.`,
    `Музыка — это не просто ноты; это пространство между ними. Ваше молчание так же важно, как и ваш звук. Найдите баланс в квантовом поле.`
  ];

  const fallbackQuotes = lang === "uk" ? ukFallbackQuotes : lang === "en" ? enFallbackQuotes : ruFallbackQuotes;

  try {
    const ai = getAiClient();
    if (!ai) {
      // Return a beautiful fallback if AI is not configured
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      return res.json({
        success: true,
        response: fallbackQuotes[randomIndex] + (lang === "uk" ? " [Локальна квантова симуляція]" : lang === "en" ? " [Quantum Local Simulation Mode]" : " [Локальная квантовая симуляция]"),
        isFallback: true
      });
    }

    const systemInstruction = `You are the Quantum Navigator of the Vizua Universe (created by electronic music artist Vizua). 
Vizua is from Ukraine, played brass instruments as a child, inspired by his multi-instrumentalist father (wind, drums, keys). He was a DJ in Ukraine since the late 90s and has recently transitioned to composing intelligent, uplifting, and motivational electronic music (Album: Neon Horizon).
Answer the traveler with an incredibly inspiring, poetic, high-tech, space-futuristic message. 
Use space, soundwave, synthesis, frequency, and quantum travel metaphors.
Encourage them, give them motivational advice, and mention their name: "${clientName}".
Respond strictly in ${lang === "uk" ? "Ukrainian" : lang === "en" ? "English" : "Russian"}.
Keep the response to 3-4 powerful sentences (max 120 words). Do not include any technical gibberish, code, or markdown lists. Keep it highly musical, warm, and inspiring.`;

    const modelResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Traveler Name: ${clientName}. 
Location: ${coordText}, ${sectorText}.
Query/Mood: ${userPrompt}`,
      config: {
        systemInstruction,
        temperature: 0.85,
      }
    });

    res.json({
      success: true,
      response: modelResponse.text,
      isFallback: false
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    res.json({
      success: true,
      response: fallbackQuotes[randomIndex] + (lang === "uk" ? " [Аварійний квантовий протокол]" : lang === "en" ? " [Quantum Emergency Protocol Active]" : " [Аварийный квантовый протокол]"),
      isFallback: true,
      error: error.message
    });
  }
});

// Setup Vite or Static File Serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vizua Server running on http://localhost:${PORT}`);
  });
}

setupServer();
