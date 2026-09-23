export function isHtmlContent(value: string) {
  if (!value) return false;
  return /<[a-z][\s\S]*>/i.test(value);
}

export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return "";

  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(dirtyHtml, "text/html");

      const disallowedTags = [
        "script",
        "iframe",
        "object",
        "embed",
        "form",
        "input",
        "textarea",
        "button",
        "link",
        "meta",
        "base",
      ];

      disallowedTags.forEach((tag) => {
        const elements = doc.querySelectorAll(tag);
        elements.forEach((el) => el.remove());
      });

      const allElements = doc.querySelectorAll("*");
      allElements.forEach((el) => {
        const attributes = Array.from(el.attributes);
        attributes.forEach((attr) => {
          const attrName = attr.name.toLowerCase();
          const attrVal = attr.value.toLowerCase().trim();

          if (
            attrName.startsWith("on") ||
            attrVal.startsWith("javascript:") ||
            attrVal.startsWith("vbscript:")
          ) {
            el.removeAttribute(attr.name);
          }
        });
      });

      return doc.body.innerHTML;
    } catch {
      // Fallback if parsing fails
    }
  }

  return dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/on\w+\s*=\s*[^"'\s>]+/gi, "")
    .replace(/href\s*=\s*(["'])javascript:.*?\1/gi, "");
}

type RichHtmlContentProps = {
  html: string;
  className?: string;
};

export default function RichHtmlContent({
  html,
  className = "",
}: RichHtmlContentProps) {
  if (!html) return null;

  if (isHtmlContent(html)) {
    const cleanHtml = sanitizeHtml(html);

    return (
      <div
        className={`rich-html-content prose prose-sm md:prose-base max-w-none 
          [&_h1]:text-2xl [&_h1]:font-black [&_h1]:my-3 
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2 
          [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2 
          [&_h4]:text-base [&_h4]:font-bold 
          [&_p]:my-1.5 [&_p]:leading-relaxed 
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 
          [&_li]:my-0.5 
          [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 
          [&_a]:text-accent [&_a]:underline 
          [&_img]:rounded-xl [&_img]:shadow-md [&_img]:max-w-full [&_img]:h-auto [&_img]:my-3 [&_img]:mx-auto 
          [&_table]:border-collapse [&_table]:w-full [&_table]:my-4 
          [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 
          [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-gray-100 [&_th]:font-bold 
          [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs 
          [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto 
          [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded 
          ${className}`}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  }

  return (
    <div className={`space-y-2 whitespace-pre-wrap ${className}`}>
      {html.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

