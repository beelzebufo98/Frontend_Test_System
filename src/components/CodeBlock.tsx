import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({ code }: CodeBlockProps) => {
  return (
    <SyntaxHighlighter
      language="csharp"
      style={vscDarkPlus}
      className="rounded-lg my-4"
      customStyle={{
        padding: '1.5rem',
        fontSize: '1rem',
        backgroundColor: '#1E1E1E'
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;