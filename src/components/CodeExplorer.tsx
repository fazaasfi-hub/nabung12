import React, { useState } from 'react';
import { KOTLIN_CODEBASE } from '../data/kotlinCodebase';
import { Folder, FileCode, Download, Copy, Check, Search, Code, CheckCircle, Terminal } from 'lucide-react';
import JSZip from 'jszip';

export const CodeExplorer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const filteredFiles = KOTLIN_CODEBASE.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.folder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentFile = KOTLIN_CODEBASE[selectedFileIndex] || KOTLIN_CODEBASE[0];

  const handleCopyCode = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      // Add root settings files
      zip.file('settings.gradle.kts', `rootProject.name = "FZ Savings"\ninclude(":app")`);
      zip.file('build.gradle.kts', `plugins {\n    alias(libs.plugins.android.application) apply false\n    alias(libs.plugins.kotlin.android) apply false\n    alias(libs.plugins.hilt.android) apply false\n}`);

      // Add all Kotlin codebase files
      KOTLIN_CODEBASE.forEach(file => {
        zip.file(file.path, file.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FZ_Savings_AndroidStudio_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 overflow-hidden shadow-2xl flex flex-col h-[780px]">
      {/* Explorer Top Toolbar */}
      <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 rounded-xl flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>FZ Savings Android Studio Project</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                Clean Architecture MVVM
              </span>
            </h2>
            <p className="text-xs text-slate-400">Source code lengkap Kotlin, Room, Hilt, Jetpack Compose, DataStore, WorkManager</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center space-x-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy File Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Generating ZIP...' : 'Download Project ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Split: Sidebar File Tree & Code Viewer */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Sidebar file tree */}
        <div className="md:col-span-4 bg-slate-950/70 border-r border-slate-800 flex flex-col overflow-hidden">
          {/* File Search */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari file Kotlin, DAO, ViewModel..."
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredFiles.map((file) => {
              const originalIndex = KOTLIN_CODEBASE.findIndex(f => f.path === file.path);
              const isSelected = originalIndex === selectedFileIndex;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(originalIndex)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex items-start space-x-2.5 ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-medium'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div className="truncate">
                    <div className="font-mono text-xs font-medium text-slate-200 truncate">{file.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{file.folder}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code View Panel */}
        <div className="md:col-span-8 flex flex-col bg-slate-900/90 overflow-hidden">
          {/* Active File Header */}
          <div className="px-5 py-3 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200">{currentFile.name}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{currentFile.description}</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-2.5 py-1 rounded-md text-slate-400">
              {currentFile.path}
            </span>
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-auto p-5 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950">
            <pre className="whitespace-pre">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
