import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Google GenAI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint for AI financial advice
  app.post("/api/gemini/advisor", async (req, res) => {
    try {
      const { accounts, transactions, currency, language } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured in the environment. Please add it via Settings > Secrets." 
        });
      }

      let langName = "Indonesian";
      if (language === "EN") langName = "English";
      else if (language === "ES") langName = "Spanish";
      else if (language === "JA") langName = "Japanese";
      else if (language === "KO") langName = "Korean";
      else if (language === "DE") langName = "German";
      else if (language === "FR") langName = "French";
      else if (language === "ZH") langName = "Chinese";
      else if (language === "AR") langName = "Arabic";

      const prompt = `
You are the intelligent "AI Financial Advisor" for users of the "FZ Savings" app (a smart financial management assistant application).
Please perform an in-depth audit analysis of the user's financial condition based on their current savings accounts and transactions.
Provide tactical recommendations, cash management education, and concrete actions the user can take.

CRITICAL REQUIREMENT:
All output fields (healthDescription, insights.title, and insights.description) MUST be written entirely in the requested language: "${langName}". Do NOT use any other language.

User Savings Accounts Data:
${JSON.stringify(accounts || [], null, 2)}

User Recent Transactions (Cash Flow):
${JSON.stringify(transactions || [], null, 2)}

User Selected Currency: ${currency || 'IDR'}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are a certified professional financial planner (CFP) who is an expert in savings strategies, controlling impulse spending, and recommending optimal savings/investment allocations. Provide warm, polite, deep, motivating, and actionable advice. Ensure your entire response matches the requested language: ${langName}.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              healthScore: { 
                type: Type.INTEGER, 
                description: "Skor kesehatan keuangan objektif dari skala 10 sampai 100." 
              },
              healthDescription: { 
                type: Type.STRING, 
                description: "Ringkasan ringkas, hangat, dan profesional tentang kondisi finansial saat ini." 
              },
              savingsRate: { 
                type: Type.INTEGER, 
                description: "Estimasi persentase dana yang berhasil ditabung/disisihkan dari total pemasukan." 
              },
              insights: {
                type: Type.ARRAY,
                description: "Daftar 3 sampai 5 rekomendasi taktis atau apresiasi konkret.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Judul singkat rekomendasi." },
                    description: { type: Type.STRING, description: "Saran tindakan detail dan bimbingan terapan untuk pengguna." },
                    type: { 
                      type: Type.STRING, 
                      description: "Wajib salah satu dari: 'SUCCESS' (untuk apresiasi hal positif), 'WARNING' (untuk alarm pengeluaran berlebih), atau 'INFO' (untuk tips investasi / alokasi rekening baru)." 
                    }
                  },
                  required: ["title", "description", "type"]
                }
              }
            },
            required: ["healthScore", "healthDescription", "savingsRate", "insights"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gemini API did not return any text output.");
      }

      const analysisResult = JSON.parse(text.trim());
      res.json(analysisResult);
    } catch (error: any) {
      console.error("Gemini Advisor API Error:", error);
      res.status(500).json({ error: error.message || "Gagal melakukan analisis kesehatan keuangan." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
