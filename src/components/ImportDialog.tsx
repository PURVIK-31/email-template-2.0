import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => void;
}

export function ImportDialog({
  open,
  onOpenChange,
  onImport,
}: ImportDialogProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/html': ['.html'],
      'application/json': ['.json'],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        onImport(file);
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/80 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Import Template</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`
            mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/10 hover:border-white/20'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <p className="text-lg text-white/90 mb-2">
            {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
          </p>
          <p className="text-sm text-white/60">
            Supports HTML and JSON backup files
          </p>
        </div>

        <div className="mt-4 text-sm text-white/60">
          <p>Supported formats:</p>
          <ul className="list-disc list-inside mt-2">
            <li>HTML files (.html)</li>
            <li>Template backup files (.json)</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}