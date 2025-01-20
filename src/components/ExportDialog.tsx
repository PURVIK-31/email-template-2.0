import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { FileDown, Download, Mail } from 'lucide-react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExportHTML: () => void;
  onBackupTemplates: () => void;
  templateName: string;
}

export function ExportDialog({
  open,
  onOpenChange,
  onExportHTML,
  onBackupTemplates,
  templateName,
}: ExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/80 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Export Options</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <Button
            onClick={() => {
              onExportHTML();
              onOpenChange(false);
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <FileDown className="w-5 h-5 mr-2" />
            Export as HTML
          </Button>

          <Button
            onClick={() => {
              onBackupTemplates();
              onOpenChange(false);
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            <Download className="w-5 h-5 mr-2" />
            Backup All Templates
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/80 text-white/60">
                Email Service Providers
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              onClick={() => {
                // TODO: Implement Mailchimp export
                onOpenChange(false);
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Mailchimp
            </Button>

            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              onClick={() => {
                // TODO: Implement Campaign Monitor export
                onOpenChange(false);
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Campaign Monitor
            </Button>
          </div>
        </div>

        <div className="mt-4 text-sm text-white/60">
          <p>Note: Email service provider integrations coming soon!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}