import { HealthCheckRepository } from "@/repository/HealCheckRepository";
import { HealthCheckResult, HealthCheckReport } from "@/models/DentalHealthCheckResult";
import { HealthCheckSubmitDto } from "@/dto/HealthCheck";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { DENTAL_HEALTH_CHECK_PROMPT } from "@/utils/prompt";

export class DentalHealthCheckService {
    private static repository = new HealthCheckRepository();
    private static model: ChatGoogleGenerativeAI;

    /**
     * Initialize the Gemini model
     */
    private static initializeModel(): ChatGoogleGenerativeAI {
        if (!this.model) {
            const apiKey = process.env.GOOGLE_AI_API_KEY;
            if (!apiKey) {
                throw new Error("GOOGLE_AI_API_KEY environment variable is not set");
            }

            const modelName = process.env.GEMINI_MODEL_NAME || "gemini-pro";

            this.model = new ChatGoogleGenerativeAI({
                model: modelName,
                temperature: 0.7,
                maxOutputTokens: 8192, // Increased for comprehensive health check evaluation
                apiKey: apiKey,
            });
        }
        return this.model;
    }

    /**
     * Format user answers into a readable format for the prompt
     */
    private static formatUserAnswers(data: HealthCheckSubmitDto): string {
        let formattedAnswers = "사용자가 입력한 답변:\n\n";

        // Section A: 구강관리 체크 리스트 (Questions 1-5)
        formattedAnswers += "✅ A. 구강관리 체크 리스트\n";
        data.sectionA.forEach((question, index) => {
            const questionNum = index + 1;
            formattedAnswers += `${questionNum}. ${question.question}\n`;
            question.answer.forEach((answer) => {
                formattedAnswers += `   - ${answer.option}\n`;
            });
            formattedAnswers += "\n";
        });

        // Section B: 보조 구강용품 사용 습관 (Questions 6-7)
        formattedAnswers += "✅ B. 보조 구강용품 사용 습관\n";
        data.sectionB.forEach((question, index) => {
            const questionNum = index + 6;
            formattedAnswers += `${questionNum}. ${question.question}\n`;
            question.answer.forEach((answer) => {
                formattedAnswers += `   - ${answer.option}\n`;
            });
            formattedAnswers += "\n";
        });

        // Section C: 양치 타이밍 (Question 8)
        formattedAnswers += "✅ C. 양치 타이밍\n";
        data.sectionC.forEach((question, index) => {
            const questionNum = index + 8;
            formattedAnswers += `${questionNum}. ${question.question}\n`;
            question.answer.forEach((answer) => {
                formattedAnswers += `   - ${answer.option}\n`;
            });
            formattedAnswers += "\n";
        });

        // Section D: 식습관 (Questions 9-10)
        formattedAnswers += "✅ D. 식습관\n";
        data.sectionD.forEach((question, index) => {
            const questionNum = index + 9;
            formattedAnswers += `${questionNum}. ${question.question}\n`;
            question.answer.forEach((answer) => {
                formattedAnswers += `   - ${answer.option}\n`;
            });
            formattedAnswers += "\n";
        });

        // Section E: 치과 내원 경험 (Questions 11-12)
        formattedAnswers += "✅ E. 치과 내원 경험·치료 이력\n";
        data.sectionE.forEach((question, index) => {
            const questionNum = index + 11;
            formattedAnswers += `${questionNum}. ${question.question}\n`;
            question.answer.forEach((answer) => {
                formattedAnswers += `   - ${answer.option}\n`;
            });
            formattedAnswers += "\n";
        });

        // Section F: 현재 고민하거나 불편한 부분 (Questions 13-16)
        formattedAnswers += "✅ F. 현재 고민하거나 불편한 부분\n";
        data.sectionF.forEach((question, index) => {
            const questionNum = index + 13;
            formattedAnswers += `${questionNum}. ${question.question}\n`;
            question.answer.forEach((answer) => {
                formattedAnswers += `   - ${answer.option}\n`;
            });
            formattedAnswers += "\n";
        });

        return formattedAnswers;
    }

    /**
     * Evaluate health check answers using Gemini API
     */
    static async evaluateHealthCheck(
        data: HealthCheckSubmitDto
    ): Promise<{ success: boolean; result: string; error?: string }> {
        try {
            // Initialize model if not already done
            const model = this.initializeModel();

            // Format user answers
            const userAnswers = this.formatUserAnswers(data);

            // Create the full prompt with instructions and user answers
            const fullPrompt = `${DENTAL_HEALTH_CHECK_PROMPT}

${userAnswers}

위의 사용자 답변을 바탕으로 위의 규칙에 따라 구강 건강 평가 결과를 생성해주세요.`;

            // Create prompt template
            const prompt = ChatPromptTemplate.fromMessages([
                [
                    "system",
                    "You are a professional dental health assistant. Analyze the user's oral health check answers and provide a comprehensive evaluation following the provided guidelines.",
                ],
                ["human", "{input}"],
            ]);

            // Create the chain with prompt, model, and output parser
            const chain = RunnableSequence.from([
                prompt,
                model,
                new StringOutputParser(),
            ]);

            // Invoke the chain
            const evaluationResult = await chain.invoke({
                input: fullPrompt,
            });

            return {
                success: true,
                result: evaluationResult,
            };
        } catch (error: any) {
            console.error("HealthCheck evaluation error:", error);
            return {
                success: false,
                result: "",
                error: error.message || "An error occurred while evaluating health check",
            };
        }
    }
}
