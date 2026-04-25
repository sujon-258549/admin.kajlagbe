import { useState, useRef, useEffect } from "react";
import { Input, Avatar, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faRobot,
  faUser,
  faCopy,
  faCircleNodes,
  faWaveSquare,
  faBrain,
  faGlobe,
  faPaperclip,
  faTrashAlt,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { useAgent } from "../../apihooks/useAgent";

const { TextArea } = Input;

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const STORAGE_KEY = "kajlagbe_agent_chat";

const SUGGESTED_QUESTIONS = [
  "How can I improve user retention on Kajlagbe?",
  "Give me a summary of last month's job postings.",
  "What are the top-performing job categories?",
  "Help me draft a notification for all employees.",
];

const AgentGenerate = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [isReasoning, setIsReasoning] = useState(false);
  const [isWebSearch, setIsWebSearch] = useState(false);

  const { generate, isLoading } = useAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isLoading]);

  const handleGenerate = async (overridePrompt?: string) => {
    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: finalPrompt,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overridePrompt) setPrompt("");

    try {
      const res = await generate(finalPrompt);
      const assistantMessage: Message = {
        role: "assistant",
        content:
          res?.data ||
          res ||
          "I'm sorry, I encountered an issue while generating a response.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Generation failed. Please try again.",
      );
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Chat history cleared!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-60px)] animate-in fade-in duration-700 py-6">
      {/* Chat History Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <FontAwesomeIcon icon={faBrain} className="text-primary/50" />
          Neural Session
        </h2>
        {messages.length > 0 && (
          <Tooltip title="Clear chat history">
            <button
              onClick={clearChat}
              className="text-gray-400 hover:text-red-500 transition-colors text-sm"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </Tooltip>
        )}
      </div>

      {/* Chat History */}
      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-8 custom-scrollbar flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-1000">
            <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mb-8 text-gray-300">
              <FontAwesomeIcon icon={faRobot} size="2x" />
            </div>
            <div className="max-w-md space-y-4">
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                AI Assistant
              </h1>
              <p className="text-gray-500 font-medium">
                How can I help you today? Try one of the following:
              </p>

              {/* Suggested Questions Chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerate(q)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    <FontAwesomeIcon
                      icon={faLightbulb}
                      className="text-yellow-500 opacity-70"
                    />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-5 animate-in slide-in-from-bottom-2 duration-500 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar
                  icon={
                    <FontAwesomeIcon
                      icon={msg.role === "user" ? faUser : faRobot}
                    />
                  }
                  className={`flex-shrink-0 rounded-lg ${
                    msg.role === "user"
                      ? "bg-gray-800 shadow-sm"
                      : "bg-primary shadow-sm"
                  }`}
                  size={36}
                />
                <div
                  className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`relative group px-5 py-3 rounded-lg text-[15px] leading-relaxed transition-all ${
                      msg.role === "user"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-medium">
                      {msg.content}
                    </div>

                    {msg.role === "assistant" && (
                      <div className="absolute top-0 -right-12 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Tooltip title="Copy to clipboard">
                          <button
                            onClick={() => copyToClipboard(msg.content)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm active:scale-90"
                          >
                            <FontAwesomeIcon
                              icon={faCopy}
                              className="text-xs"
                            />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest px-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex items-start gap-5">
            <Avatar
              icon={<FontAwesomeIcon icon={faRobot} />}
              className="bg-gray-800 rounded-lg "
              size={36}
            />
            <div className="bg-white border  text-primary border-gray-200 px-5 py-3 rounded-2xl  flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Thinking
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Input Bar */}
      <div className="px-4 pt-4 pb-2 mt-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100/70 backdrop-blur-sm rounded-lg p-4 transition-all focus-within:bg-gray-100/90 border border-gray-300">
            <TextArea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Message AI Assistant..."
              autoSize={{ minRows: 1, maxRows: 8 }}
              variant="borderless"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              className="w-full p-0 text-sm font-medium text-gray-700 placeholder:text-gray-400/80 focus:shadow-none"
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsReasoning(!isReasoning)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[11px] font-bold ${
                    isReasoning
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-gray-200 bg-white/80 text-gray-500 hover:bg-white hover:border-primary/30"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faBrain}
                    className={isReasoning ? "text-primary" : "text-primary/70"}
                  />
                  Reasoning
                </button>
                <button
                  onClick={() => setIsWebSearch(!isWebSearch)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[11px] font-bold ${
                    isWebSearch
                      ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                      : "border-gray-200 bg-white/80 text-gray-500 hover:bg-white hover:border-blue-400/30"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className={
                      isWebSearch ? "text-blue-500" : "text-blue-500/70"
                    }
                  />
                  Web Search
                </button>
                <Tooltip title="Attach files">
                  <button className="p-1.5 text-gray-400 hover:text-primary transition-colors ml-1">
                    <FontAwesomeIcon icon={faPaperclip} className="text-sm" />
                  </button>
                </Tooltip>
              </div>

              <button
                onClick={() => handleGenerate()}
                disabled={!prompt.trim() || isLoading}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md ${
                  !prompt.trim() || isLoading
                    ? "bg-primary text-white cursor-not-allowed opacity-50"
                    : "bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95"
                }`}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-2 opacity-50">
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <FontAwesomeIcon
                  icon={faWaveSquare}
                  className="text-primary/40"
                />
                Live Agent
              </div>
              <div className="flex items-center gap-1.5">
                <FontAwesomeIcon
                  icon={faCircleNodes}
                  className="text-primary/40"
                />
                Flash 2.0
              </div>
            </div>
            <div className="text-[10px] font-medium text-gray-400 italic">
              Shift + Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentGenerate;
