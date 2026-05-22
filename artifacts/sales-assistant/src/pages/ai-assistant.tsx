import React, { useState, useEffect, useRef } from "react";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Sparkles, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

export default function AiAssistant() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const createConversation = useCreateOpenaiConversation();
  const createConversationRef = useRef(createConversation.mutate);
  createConversationRef.current = createConversation.mutate;

  useEffect(() => {
    createConversationRef.current(
      { data: { title: `Sales Assistant Chat ${new Date().toLocaleDateString()}` } },
      {
        onSuccess: (data) => {
          setConversationId(data.id);
        },
        onError: () => {
          toast({ title: "Failed to initialize chat", variant: "destructive" });
        }
      }
    );
  }, [toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim() || !conversationId || isSending) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content };
    const assistantMessageId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, userMessage, { id: assistantMessageId, role: "assistant", content: "", streaming: true }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) {
                setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, streaming: false } : m));
              } else if (data.content) {
                setMessages(prev => prev.map(m => 
                  m.id === assistantMessageId 
                    ? { ...m, content: m.content + data.content }
                    : m
                ));
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to send message", variant: "destructive" });
      setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: "Sorry, I encountered an error.", streaming: false } : m));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-6 animate-fade-up">
      <Card className="flex-1 flex flex-col glass rounded-2xl border-white/[0.05] overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex gap-4 max-w-3xl">
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary glow-violet">
              <Bot size={20} />
            </div>
            <div className="glass rounded-2xl rounded-tl-sm px-5 py-4 border-white/[0.05] text-zinc-300 text-sm leading-relaxed">
              <p>I'm your AI sales co-pilot. Ask me to draft emails, refine messaging, analyze a prospect, or strategize your next campaign.</p>
            </div>
          </div>

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {[
                "Draft an outreach for a fintech CTO",
                "Help me write a follow-up email",
                "How should I position for enterprise?"
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="px-4 py-2 rounded-full glass border-white/[0.08] text-xs text-zinc-300 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-2"
                >
                  <Sparkles size={14} className="text-primary" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex gap-4 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              {m.role === 'assistant' ? (
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary glow-violet">
                  <Bot size={20} />
                </div>
              ) : (
                <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                  <User size={20} />
                </div>
              )}
              <div className={`px-5 py-4 text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-primary text-white rounded-2xl rounded-tr-sm shadow-lg shadow-primary/20' 
                  : 'glass rounded-2xl rounded-tl-sm border-white/[0.05] text-zinc-300'
              }`}>
                {m.content}
                {m.streaming && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse" />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/[0.05] bg-black/20 backdrop-blur-xl">
          <div className="relative max-w-3xl mx-auto flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Ask the assistant anything..."
              className="min-h-[60px] max-h-[200px] resize-none glass border-white/[0.1] rounded-xl text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary pb-10"
            />
            <Button
              size="icon"
              className="absolute bottom-2 right-2 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-50"
              onClick={() => handleSend(input)}
              disabled={!input.trim() || !conversationId || isSending}
            >
              {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
