import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { z } from "zod";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// ---- OpenAI client ----
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---- In-memory tasks (to swap with the DB later) ----
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  dueDate: z.string().optional(), // ISO date
  subject: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  completed: z.boolean().default(false),
});
type Task = z.infer<typeof TaskSchema>;
const tasks: Task[] = [];

// ---- Tools (typed) ----
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "add_task",
      description:
        "Add a to-do or study task with an optional due date/subject/priority",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          dueDate: { type: "string", description: "ISO date (YYYY-MM-DD or ISO)" },
          subject: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["title"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_upcoming",
      description: "List upcoming tasks/reminders for the next N days",
      parameters: {
        type: "object",
        properties: { days: { type: "number", default: 7 } },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "complete_task",
      description: "Mark a task complete by id",
      parameters: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
        additionalProperties: false,
      },
    },
  },
];

// ---- System prompt ----
const SYSTEM_PROMPT = `
You are Ora, an AI study scheduler for Orama.
Goals: help students plan study blocks, add tasks with due dates, suggest schedules around classes, and surface upcoming deadlines.
Style: concise, encouraging, student-friendly. Use tools when the user asks to add/list/complete tasks.
`;

// ---- Helper types (no-any tool-call handling) ----
type MsgWithTools = OpenAI.Chat.Completions.ChatCompletionMessage & {
  tool_calls?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[];
};

type FunctionToolCall = OpenAI.Chat.Completions.ChatCompletionMessageToolCall & {
  function: { name: string; arguments: string };
};

function isFunctionToolCall(x: unknown): x is FunctionToolCall {
  return !!x &&
    typeof (x as { function?: { name?: unknown } }).function?.name === "string" &&
    typeof (x as { function?: { arguments?: unknown } }).function?.arguments === "string";
}

// ---- Chat endpoint ----
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as {
      messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    };

    console.log('📨 Received chat request with', messages.length, 'messages');

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    // First API call with user messages
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      tools,
      tool_choice: "auto",
      temperature: 0.3,
    });

    const choice = completion.choices[0];
    const msg = choice.message as MsgWithTools;

    const toolCallCandidate = (msg.tool_calls ?? [])[0];

    // If there's a tool call, execute it and get final response
    if (isFunctionToolCall(toolCallCandidate)) {
      const fnName = toolCallCandidate.function.name;
      const argsJson = toolCallCandidate.function.arguments ?? "{}";
      const args = JSON.parse(argsJson);

      console.log('🔧 Tool called:', fnName, 'with args:', args);

      let toolResult: unknown = { ok: false };

      if (fnName === "add_task") {
        const newTask = TaskSchema.parse({
          id: Math.random().toString(36).slice(2),
          title: args.title,
          dueDate: args.dueDate,
          subject: args.subject,
          priority: args.priority,
          completed: false,
        });
        tasks.push(newTask);
        toolResult = { ok: true, task: newTask };
        console.log('✅ Task added:', newTask);
      }

      if (fnName === "list_upcoming") {
        const days: number = typeof args.days === "number" ? args.days : 7;
        const now = new Date();
        const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        const upcoming = tasks.filter(
          (t) => !t.completed && t.dueDate && new Date(t.dueDate) <= cutoff
        );
        toolResult = { ok: true, tasks: upcoming };
        console.log('📋 Listed', upcoming.length, 'upcoming tasks');
      }

      if (fnName === "complete_task") {
        const idx = tasks.findIndex((t) => t.id === args.id);
        if (idx >= 0) tasks[idx].completed = true;
        toolResult = { ok: idx >= 0 };
        console.log('✓ Task completed:', idx >= 0);
      }

      // Make second API call with tool result to get natural language response
      const secondCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
          msg,
          {
            role: "tool",
            tool_call_id: toolCallCandidate.id,
            content: JSON.stringify(toolResult),
          },
        ],
        temperature: 0.3,
      });

      const reply = secondCompletion.choices[0].message.content;
      console.log('💬 Bot reply:', reply);
      return res.json({ reply });
    }

    // No tool call → plain assistant reply
    const reply = choice.message.content;
    console.log('💬 Bot reply (no tool):', reply);
    return res.json({ reply });
  } catch (err) {
    console.error('❌ Error in chat endpoint:', err);
    const message = err instanceof Error ? err.message : "Unknown server error";
    res.status(500).json({ error: message });
  }
});

// Debug route
app.get("/api/tasks", (_req: Request, res: Response) => res.json({ tasks }));

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// ---- Boot server ----
const PORT = Number(process.env.PORT) || 8787;
app.listen(PORT, () =>
  console.log(`✅ AI server running on http://localhost:${PORT}`)
);
