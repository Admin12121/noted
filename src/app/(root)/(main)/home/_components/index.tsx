"use client";

import React from "react";

import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai";
import { MicIcon, PaperclipIcon } from "lucide-react";
import { type FormEventHandler, useState } from "react";

const models = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
];

function getGreetingParts(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return { title: "Good morning" };
  if (hour >= 12 && hour < 17) return { title: "Good afternoon" };
  if (hour >= 17 && hour < 21) return { title: "Good evening" };
  return { title: "Good night" };
}

const Home = () => {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const { title } = React.useMemo(() => getGreetingParts(now), [now]);

  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!text) {
      return;
    }
    setStatus("submitted");
    setTimeout(() => {
      setStatus("streaming");
    }, 200);
    setTimeout(() => {
      setStatus("ready");
      setText("");
    }, 2000);
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-1 w-full h-full">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <div className="p-8 w-full max-w-[1000px]">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Type your message..."
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton>
                <PaperclipIcon size={16} />
              </PromptInputButton>
              <PromptInputButton>
                <MicIcon size={16} />
                <span>Voice</span>
              </PromptInputButton>
              <PromptInputModelSelect onValueChange={setModel} value={model}>
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!text} status={status} className="cursor-pointer"/>
          </PromptInputToolbar>
        </PromptInput>
      </div>
      <div className="flex items-center justify-center text-sm text-muted-foreground">

      </div>
    </div>
  );
};

export default Home;
