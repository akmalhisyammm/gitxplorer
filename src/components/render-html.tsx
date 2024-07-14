import DOMPurify from 'isomorphic-dompurify';

type RenderHTMLProps = {
  html: string;
};

export const RenderHTML = ({ html }: RenderHTMLProps) => {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <article
      // biome-ignore lint/security/noDangerouslySetInnerHtml: html has been sanitized.
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      className="min-w-full prose prose-hr:border-secondary prose-code:bg-slate-800 prose-thead:border-secondary prose-tr:border-secondary prose-code:text-white prose-code:p-1 prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-a:no-underline hover:prose-a:underline prose-a:text-blue-800 dark:prose-a:text-blue-300 dark:text-white dark:prose-headings:text-white dark:prose-blockquote:text-white dark:prose-strong:text-white"
    />
  );
};
