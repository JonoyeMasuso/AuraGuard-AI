import React from 'react';

interface FileUploadProps {
  id: string;
  label: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  acceptedFormats: string;
  disabled?: boolean;
  capture?: 'user' | 'environment';
}

const FileUpload: React.FC<FileUploadProps> = ({ id, label, file, onChange, acceptedFormats, disabled = false, capture }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md ${disabled ? 'bg-slate-100 dark:bg-slate-700/50 opacity-50' : ''}`}>
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-slate-600 dark:text-slate-400">
            <label
              htmlFor={id}
              className={`relative rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900 focus-within:ring-blue-500 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer bg-white dark:bg-slate-800'}`}
            >
              <span>Upload or use camera</span>
              <input id={id} name={id} type="file" className="sr-only" onChange={onChange} accept={acceptedFormats} disabled={disabled} capture={capture} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          {file ? (
            <p className="text-xs text-slate-500 dark:text-slate-500 font-semibold">{file.name}</p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, PDF up to 10MB</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;