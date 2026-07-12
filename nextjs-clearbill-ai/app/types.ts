export type ChatRole = "user" | "assistant";

export type SourceReference = {
  title: string;
  url: string;
  publisher: string;
};

export type ChatMessage = {
  role: ChatRole;
  content: string;
  sources?: SourceReference[];
};

export type ChatResponse = {
  answer: string;
  sources: SourceReference[];
  mode: "live" | "demo";
};
