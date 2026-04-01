import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, UploadCloud, Layers, Scissors, Minimize2, FileBox, RefreshCw, X, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import AdSlot from '../components/common/AdSlot';

const tools = [
  { id: 'merge', name: 'Merge PDF', icon: <Layers className="w-6 h-6 text-blue-500" /> },
  { id: 'split', name: 'Split PDF', icon: <Scissors className="w-6 h-6 text-orange-500" /> },
  { id: 'compress', name: 'Compress PDF', icon: <Minimize2 className="w-6 h-6 text-purple-500" /> },
  { id: 'pdf-to-word', name: 'PDF to Word', icon: <FileText className="w-6 h-6 text-blue-600" /> },
  { id: 'word-to-pdf', name: 'Word to PDF', icon: <FileBox className="w-6 h-6 text-indigo-600" /> },
];

export default function PDFTools() {
  const [activeTool, setActiveTool] = useState('merge');
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (files.length === 1) setResultBlobUrl(null);
  };

  const processMerge = async () => {
    if (files.length < 2) return alert("Please select at least 2 PDF files to merge.");
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      setResultBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Error merging PDFs. Make sure all selected files are valid PDFs.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processAction = () => {
    if (activeTool === 'merge') {
      processMerge();
    } else {
      // Mock other tools
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        alert(`The ${activeTool} feature requires a server-side endpoint for advanced conversion in production. Functionality stubbed for purely frontend demonstration.`);
      }, 1500);
    }
  };

  const reset = () => {
    setFiles([]);
    setResultBlobUrl(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Free PDF Tools: Merge, Split & Compress Online Security</title>
        <meta name="description" content="Merge, Split, Compress, and convert PDF files entirely online securely. Files are processed locally on your device ensuring maximum privacy." />
        <meta name="keywords" content="merge pdf online, pdf combiner, compress pdf free, split pdf, secure pdf tools, local pdf processing, free pdf utility" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Secure PDF Tools Studio",
              "applicationCategory": "Utility",
              "operatingSystem": "All",
              "description": "Secure, fast, local PDF processor to merge, split, and compress PDFs."
            }
          `}
        </script>
      </Helmet>

      <div className="mb-6"><AdSlot slotId="PDF_TOP" /></div>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Secure PDF Tools</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Files are processed entirely within your browser for maximum privacy. No data is stored on our servers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Tools Selector */}
          <div className="md:col-span-1 space-y-2">
            {tools.map(t => (
              <button 
                key={t.id}
                onClick={() => { setActiveTool(t.id); reset(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium
                  ${activeTool === t.id 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800' 
                    : 'bg-[var(--surface)] text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-gray-800 border border-[var(--border)]'}`}
              >
                {t.icon}
                {t.name}
              </button>
            ))}
            
            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <AdSlot slotId="PDF_SIDEBAR" className="hidden md:flex min-h-[250px]" />
            </div>
          </div>

          {/* Main Action Area */}
          <div className="md:col-span-3 g-card p-6 min-h-[400px] flex flex-col">
            <h2 className="text-2xl font-semibold mb-6">
              {tools.find(t => t.id === activeTool)?.name}
            </h2>

            {!resultBlobUrl ? (
              <div className="flex-1 flex flex-col">
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex-1 mb-6 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files) {
                      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
                    }
                  }}
                >
                  <UploadCloud className="w-16 h-16 text-primary-400 mb-4" />
                  <p className="text-lg font-medium text-[var(--foreground)] mb-1">Drag and drop your files here</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse from your device</p>
                  <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept={activeTool.includes('word') && !activeTool.includes('to-word') ? '.doc,.docx' : '.pdf'}
                  />
                </div>

                {files.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Selected Files ({files.length})</h3>
                    <ul className="space-y-2">
                      {files.map((f, i) => (
                        <li key={i} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-[var(--border)]">
                          <span className="text-sm truncate w-3/4">{f.name}</span>
                          <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button 
                  onClick={processAction}
                  disabled={files.length === 0 || isProcessing}
                  className="g-button w-full py-4 text-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Layers className="w-5 h-5" />}
                  {isProcessing ? 'Processing...' : `Process Files`}
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 rounded-xl">
                <div className="w-16 h-16 bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Success!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 items-center gap-1 justify-center flex flex-wrap">
                  Your files have been processed automatically and securely.
                </p>
                <div className="flex gap-4">
                  <button onClick={reset} className="px-5 py-2 rounded-full border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Process More
                  </button>
                  <a href={resultBlobUrl} download={`SmartTools-Output-${Date.now()}.pdf`} className="g-button flex items-center gap-2 px-6">
                    <Download className="w-4 h-4" />
                    Download File
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
