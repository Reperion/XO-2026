import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect } from 'react';

interface File {
  name: string;
}

export default function XoPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/xo-files')
      .then(res => res.json())
      .then(setFiles);
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetch(`/api/xo-files?file=${encodeURIComponent(selectedFile)}`)
        .then(res => res.json())
        .then(setContent);
    }
  }, [selectedFile]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">XO Project Board</h1>
      <select
        value={selectedFile}
        onChange={(e) => setSelectedFile(e.target.value)}
        className="w-full md:w-80 p-3 border border-gray-300 rounded-lg mb-8"
      >
        <option value="">Select a file...</option>
        {files.map((file) => (
          <option key={file.name} value={file.name}>
            {file.name}
          </option>
        ))}
      </select>
      {content && (
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
