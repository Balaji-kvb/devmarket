import type { ReactNode } from "react";

interface ArticleContentProps {
  content: string;
}

const formatBlock = (block: string, index: number): ReactNode => {
  const trimmed = block.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("### ")) {
    return (
      <h3 key={index} className="text-xl font-semibold text-text-primary mt-8 mb-3">
        {trimmed.slice(4)}
      </h3>
    );
  }

  if (trimmed.startsWith("## ")) {
    return (
      <h2 key={index} className="text-2xl font-semibold text-text-primary mt-10 mb-4">
        {trimmed.slice(3)}
      </h2>
    );
  }

  if (trimmed.startsWith("# ")) {
    return (
      <h1 key={index} className="text-3xl font-semibold text-text-primary mt-10 mb-5">
        {trimmed.slice(2)}
      </h1>
    );
  }

  const lines = trimmed.split("\n");
  const isList = lines.every((line) => line.trim().startsWith("- "));

  if (isList) {
    return (
      <ul key={index} className="list-inside list-disc space-y-2 text-sm text-text-secondary leading-7 ml-4 mb-6">
        {lines.map((line, lineIndex) => (
          <li key={`${index}-${lineIndex}`}>{line.trim().slice(2)}</li>
        ))}
      </ul>
    );
  }

  if (trimmed.startsWith("> ")) {
    return (
      <blockquote
        key={index}
        className="border-l-2 border-accent/30 pl-4 italic text-sm text-text-secondary mb-6"
      >
        {trimmed.slice(2)}
      </blockquote>
    );
  }

  return (
    <p key={index} className="text-sm text-text-secondary leading-7 mb-6">
      {trimmed}
    </p>
  );
};

export function ArticleContent({ content }: ArticleContentProps) {
  const blocks = content.split(/\n\s*\n/);

  return <div className="prose prose-invert max-w-none">{blocks.map(formatBlock)}</div>;
}
