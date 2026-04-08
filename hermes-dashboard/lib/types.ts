// Hermes Dashboard — Shared Types

export interface Session {
  id: string;
  source: string;
  user_id: string | null;
  model: string | null;
  model_config: string | null;
  system_prompt: string | null;
  parent_session_id: string | null;
  started_at: number;
  ended_at: number | null;
  end_reason: string | null;
  message_count: number;
  tool_call_count: number;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_write_tokens: number;
  reasoning_tokens: number;
  billing_provider: string | null;
  billing_base_url: string | null;
  billing_mode: string | null;
  estimated_cost_usd: number | null;
  actual_cost_usd: number | null;
  cost_status: string | null;
  cost_source: string | null;
  pricing_version: string | null;
  title: string | null;
}

export interface Message {
  id: number;
  session_id: string;
  role: string;
  content: string | null;
  tool_call_id: string | null;
  tool_calls: string | null; // JSON string
  tool_name: string | null;
  timestamp: number;
  token_count: number | null;
  finish_reason: string | null;
  reasoning: string | null;
  reasoning_details: string | null;
  codex_reasoning_items: string | null;
}

export interface ParsedMessage extends Omit<Message, 'tool_calls'> {
  tool_calls: ToolCall[] | null;
}

export interface ToolCall {
  id: string;
  type: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface SessionStats {
  total_sessions: number;
  total_messages: number;
  total_tool_calls: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost_usd: number | null;
  sessions_today: number;
  messages_today: number;
  avg_messages_per_session: number;
}

export interface ToolUsage {
  tool_name: string;
  call_count: number;
  last_used: number;
}

export interface CronJob {
  job_id: string;
  name: string;
  skill: string | null;
  skills: string[];
  prompt_preview: string;
  model: string;
  provider: string;
  schedule: string;
  repeat: number | null;
  next_run_at: string | null;
  last_run_at: string | null;
  last_status: string | null;
  last_delivery_error: string | null;
  enabled: boolean;
  paused_at: string | null;
  paused_reason: string | null;
}
