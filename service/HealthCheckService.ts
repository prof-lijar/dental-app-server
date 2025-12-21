import { HealthCheckRepository } from "@/repository/HealCheckRepository";
import { HealthCheckReportRepository } from "@/repository/HealthCheckReportRepository";
import {  HealthCheckReport } from "@/models/DentalHealthCheckResult";
import { HealthCheckSubmitDto, HealthCheckResponseDto, HealthCheckHistoryRequestDto, HealthCheckHistoryResponseDto } from "@/dto/HealthCheck";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { DENTAL_HEALTH_CHECK_PROMPT } from "@/utils/prompt";

export class DentalHealthCheckService {
    private static repository = new HealthCheckRepository();
    private static reportRepository = new HealthCheckReportRepository();
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
     * Parse JSON response from LLM, handling markdown code blocks if present
     */
    private static parseJsonResponse(response: string): HealthCheckResponseDto {
        try {
            // Remove markdown code blocks if present
            let cleanedResponse = response.trim();
            
            // Remove ```json or ``` markers
            cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '');
            cleanedResponse = cleanedResponse.replace(/^```\s*/i, '');
            cleanedResponse = cleanedResponse.replace(/\s*```$/i, '');
            cleanedResponse = cleanedResponse.trim();

            // Parse JSON
            const parsed = JSON.parse(cleanedResponse) as HealthCheckResponseDto;

            // Validate required fields
            if (!parsed.evaluationResult || typeof parsed.evaluationResult !== 'string') {
                throw new Error("Missing or invalid evaluationResult field");
            }
            if (!parsed.myStatus || typeof parsed.myStatus !== 'string') {
                throw new Error("Missing or invalid myStatus field");
            }
            if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 100) {
                throw new Error("Missing or invalid score field (must be 0-100)");
            }
            if (!Array.isArray(parsed.toDo)) {
                throw new Error("Missing or invalid toDo field (must be array)");
            }
            if (!Array.isArray(parsed.recommend)) {
                throw new Error("Missing or invalid recommend field (must be array)");
            }
            if (!Array.isArray(parsed.task)) {
                throw new Error("Missing or invalid task field (must be array)");
            }

            return parsed;
        } catch (error: any) {
            console.error("JSON parsing error:", error);
            throw new Error(`Failed to parse JSON response: ${error.message}`);
        }
    }

    /**
     * Evaluate health check answers using Gemini API
     */
    static async evaluateHealthCheck(
        userId: string,
        data: HealthCheckSubmitDto
    ): Promise<{ success: boolean; result?: HealthCheckResponseDto; error?: string }> {
        try {
            // Initialize model if not already done
            const model = this.initializeModel();

            // Format user answers
            const userAnswers = this.formatUserAnswers(data);

            // Create the full prompt with instructions and user answers
            const fullPrompt = `${DENTAL_HEALTH_CHECK_PROMPT}

${userAnswers}

위의 사용자 답변을 바탕으로 위의 규칙에 따라 구강 건강 평가 결과를 JSON 형식으로 생성해주세요. 반드시 유효한 JSON 형식으로만 응답해주세요.`;

            // Create prompt template
            const prompt = ChatPromptTemplate.fromMessages([
                [
                    "system",
                    "You are a professional dental health assistant. Analyze the user's oral health check answers and provide a comprehensive evaluation in JSON format following the provided guidelines. Respond ONLY with valid JSON, no additional text or explanation.",
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
            const rawResponse = await chain.invoke({
                input: fullPrompt,
            });

            // Parse JSON response
            const structuredResult = this.parseJsonResponse(rawResponse);

            // Store result in database
            const resultToStore = {
                user_id: userId,
                result: structuredResult.evaluationResult, // Store full JSON response as text
                my_status: structuredResult.myStatus,
                health_score: structuredResult.score,
                is_deleted: false,
            };

            const createdResult = await this.repository.create(resultToStore);

            // Store reports (toDo, recommend, task) as separate records
            if (!createdResult.id) {
                throw new Error("Failed to get created health check result ID");
            }

            const checkResultId = createdResult.id;

            // Store toDo items
            for (const todo of structuredResult.toDo) {
                const reportToStore: Partial<HealthCheckReport> = {
                    check_result_id: checkResultId,
                    report: todo.length > 100 ? todo.substring(0, 100) : todo, // Truncate to 100 chars if needed
                    report_type: "TODO",
                    is_deleted: false,
                };
                await this.reportRepository.create(reportToStore);
            }

            // Store recommend items
            for (const recommend of structuredResult.recommend) {
                const reportToStore: Partial<HealthCheckReport> = {
                    check_result_id: checkResultId,
                    report: recommend.length > 100 ? recommend.substring(0, 100) : recommend, // Truncate to 100 chars if needed
                    report_type: "RECOMMEND",
                    is_deleted: false,
                };
                await this.reportRepository.create(reportToStore);
            }

            // Store task items
            for (const task of structuredResult.task) {
                const reportToStore: Partial<HealthCheckReport> = {
                    check_result_id: checkResultId,
                    report: task.length > 100 ? task.substring(0, 100) : task, // Truncate to 100 chars if needed
                    report_type: "TASK",
                    is_deleted: false,
                };
                await this.reportRepository.create(reportToStore);
            }

            return {
                success: true,
                result: structuredResult,
            };
        } catch (error: any) {
            console.error("HealthCheck evaluation error:", error);
            return {
                success: false,
                error: error.message || "An error occurred while evaluating health check",
            };
        }
    }

    /**
     * Get the latest health check result for a user
     */
    static async getMyLatestHealthCheckResult(userId: string): Promise<HealthCheckResponseDto | null> {
        try {
            const result = await this.repository.findLatestByUserId(userId);
            if (!result || !result.id) {
                return null;
            }

            // Fetch reports (toDo, recommend, task) for this health check result
            const reports = await this.reportRepository.findByCheckResultId(result.id);

            // Separate reports by type
            const toDo: string[] = [];
            const recommend: string[] = [];
            const task: string[] = [];

            reports.forEach((report) => {
                if (report.report_type === "TODO") {
                    toDo.push(report.report);
                } else if (report.report_type === "RECOMMEND") {
                    recommend.push(report.report);
                } else if (report.report_type === "TASK") {
                    task.push(report.report);
                }
            });

            // Reconstruct the full DTO
            const response: HealthCheckResponseDto = {
                evaluationResult: result.result || "",
                myStatus: result.my_status || "",
                score: result.health_score || 0,
                toDo: toDo,
                recommend: recommend,
                task: task,
                created_at: result.created_at,
                updated_at: result.updated_at,
            };

            return response;
        } catch (error: any) {
            console.error("Error getting latest health check result:", error);
            throw new Error(`Failed to get latest health check result: ${error.message}`);
        }
    }

    /**
     * Get health check history for a user with pagination
     */
    static async getHealthCheckHistory(request: HealthCheckHistoryRequestDto): Promise<HealthCheckHistoryResponseDto> {
        try {
            const { page = 1, size = 10, userId } = request;
            
            // Get paginated health check results
            const repositoryResult = await this.repository.findByUserId(userId, page, size);
            
            // Reconstruct full DTOs for each result
            const items: HealthCheckResponseDto[] = await Promise.all(
                repositoryResult.data.map(async (result) => {
                    if (!result.id) {
                        throw new Error("Health check result missing ID");
                    }

                    // Fetch reports (toDo, recommend, task) for this health check result
                    const reports = await this.reportRepository.findByCheckResultId(result.id);

                    // Separate reports by type
                    const toDo: string[] = [];
                    const recommend: string[] = [];
                    const task: string[] = [];

                    reports.forEach((report) => {
                        if (report.report_type === "TODO") {
                            toDo.push(report.report);
                        } else if (report.report_type === "RECOMMEND") {
                            recommend.push(report.report);
                        } else if (report.report_type === "TASK") {
                            task.push(report.report);
                        }
                    });

                    // Reconstruct the full DTO
                    return {
                        evaluationResult: result.result || "",
                        myStatus: result.my_status || "",
                        score: result.health_score || 0,
                        toDo: toDo,
                        recommend: recommend,
                        task: task,
                        created_at: result.created_at,
                        updated_at: result.updated_at,
                    };
                })
            );

            return {
                items: items,
                totalItems: repositoryResult.total,
                page: page,
                size: size,
            };
        } catch (error: any) {
            console.error("Error getting health check history:", error);
            throw new Error(`Failed to get health check history: ${error.message}`);
        }
    }
}
