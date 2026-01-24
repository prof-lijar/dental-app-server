type IssueType =
  | "PLAQUE"
  | "DISCOLORATION"
  | "GUM_INFLAMMATION"
  | "ALIGNMENT"
  | "CAVITY_RISK"
  | "OTHER";

type Severity = "LOW" | "MEDIUM" | "HIGH";

export interface DentalAnalysisResult {
  summary: string;
  issues: Array<{
    type: IssueType;
    severity: Severity;
    description: string;
  }>;
  recommendations: string[];
  risk_score: number;
  disclaimer: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

const SYSTEM_INSTRUCTION = [
  "You are a dentist assistant.",
  "You analyze mouth and teeth images and provide educational, non-diagnostic feedback.",
  "You do not make medical diagnoses or prescribe treatments.",
  "You speak clearly, calmly, and professionally.",
].join("\n");

const USER_PROMPT = [
  "Analyze the provided mouth/teeth image.",
  "",
  "Tasks:",
  "1. Describe visible oral conditions (teeth color, gums, alignment, cleanliness)",
  "2. Identify possible concerns (plaque, discoloration, gum inflammation, cavity risk)",
  "3. Assign a dental health risk score from 0 to 100 (higher is better)",
  "4. Provide practical oral care recommendations",
  "5. Include a medical disclaimer",
  "",
  "Rules:",
  "- Use cautious, non-diagnostic language",
  "- If the image quality is poor, mention it",
  "- Do not mention AI or model names",
  "",
  "Respond ONLY in valid JSON using this schema:",
  "",
  "{",
  '  "summary": string,',
  '  "issues": [',
  "    {",
  '      "type": string,',
  '      "severity": string,',
  '      "description": string',
  "    }",
  "  ],",
  '  "recommendations": string[],',
  '  "risk_score": number,',
  '  "disclaimer": string',
  "}",
].join("\n");

const DISCLAIMER_TEXT =
  "This feedback is for educational purposes only and is not a medical diagnosis.";

export class DentistService {
  private static getApiKey(): string {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY environment variable is not set");
    }
    return apiKey;
  }

  private static buildRequestBody(
    mimeType: string,
    base64Data: string,
    languageHint?: string
  ) {
    const languageInstruction = languageHint
      ? `Respond entirely in ${languageHint}.`
      : undefined;
    return {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: languageInstruction
                ? `${USER_PROMPT}\n\n${languageInstruction}`
                : USER_PROMPT,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
      },
    };
  }

  private static extractJson(text: string): DentalAnalysisResult {
    const trimmed = text.trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Invalid JSON response");
    }

    const jsonString = trimmed.slice(start, end + 1);
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid JSON response");
    }

    if (typeof parsed.summary !== "string") {
      throw new Error("Invalid JSON response");
    }

    if (!Array.isArray(parsed.issues)) {
      parsed.issues = [];
    }

    if (!Array.isArray(parsed.recommendations)) {
      parsed.recommendations = [];
    }

    if (typeof parsed.risk_score !== "number") {
      throw new Error("Invalid JSON response");
    }

    if (typeof parsed.disclaimer !== "string") {
      parsed.disclaimer = DISCLAIMER_TEXT;
    }

    if (!parsed.disclaimer.includes(DISCLAIMER_TEXT)) {
      parsed.disclaimer = DISCLAIMER_TEXT;
    }

    return parsed as DentalAnalysisResult;
  }

  static async analyzeImage(
    base64Data: string,
    mimeType: string,
    languageHint?: string
  ): Promise<DentalAnalysisResult> {
    const apiKey = this.getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        this.buildRequestBody(mimeType, base64Data, languageHint)
      ),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Gemini API error:", response.status, errorText);
      throw new Error("Gemini request failed");
    }

    const data = (await response.json()) as GeminiResponse;
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return this.extractJson(text);
  }
}
