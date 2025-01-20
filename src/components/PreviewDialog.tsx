import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Smartphone, Monitor, Send } from 'lucide-react';
import { Section, ViewportSize } from '../types';
import { generateHTML } from '../lib/generateHTML';

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  sections: Section[];
  viewportSize: ViewportSize;
  onViewportChange: (size: ViewportSize) => void;
  onTestSend: (email: string) => void;
}

export function PreviewDialog({
  open,
  onOpenChange,
  templateName,
  sections,
  viewportSize,
  onViewportChange,
  onTestSend,
}: PreviewDialogProps) {
  const [testEmail, setTestEmail] = useState('');
  const html = generateHTML(sections, templateName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] bg-black/80 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">Preview: {templateName}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewportChange('mobile')}
                className={`toolbar-button ${viewportSize === 'mobile' ? 'text-blue-400' : 'text-white/60'}`}
              >
                <Smartphone className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewportChange('desktop')}
                className={`toolbar-button ${viewportSize === 'desktop' ? 'text-blue-400' : 'text-white/60'}`}
              >
                <Monitor className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full gap-4">
          {/* Test Send Form */}
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email for test send"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-white/50"
            />
            <Button
              onClick={() => onTestSend(testEmail)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Test Send
            </Button>
          </div>

          {/* Preview Frame */}
          <div className="flex-1 bg-white rounded-lg overflow-hidden">
            <div
              className={`w-full h-full transition-all duration-300 ${
                viewportSize === 'mobile' ? 'max-w-[375px]' : 'max-w-none'
              } mx-auto`}
            >
              <iframe
                srcDoc={html}
                className="w-full h-full border-0"
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}