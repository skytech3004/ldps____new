export function isHtmlContent(value: string) {
  return /<[a-z][\s\S]*>/i.test(value);
}

type RichHtmlContentProps = {
  html: string;
  className?: string;
};

export default function RichHtmlContent({ html, className = "" }: RichHtmlContentProps) {
  if (!html) return null;

  if (isHtmlContent(html)) {
    return (
      <div
        className={`rich-html-content prose prose-sm md:prose-base max-w-none [&_img]:rounded-xl [&_img]:shadow-md [&_img]:max-w-full [&_img]:h-auto [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={`space-y-4 whitespace-pre-wrap ${className}`}>
      {html.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
