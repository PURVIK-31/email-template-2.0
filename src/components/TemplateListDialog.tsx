import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Template } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Plus, Loader2, FileEdit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TemplateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
  isLoading: boolean;
  onSelect: (template: Template) => void;
  onNewTemplate: () => void;
}

export function TemplateListDialog({
  open,
  onOpenChange,
  templates,
  isLoading,
  onSelect,
  onNewTemplate,
}: TemplateListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black/80 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Your Templates</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Button
            onClick={() => {
              onNewTemplate();
              onOpenChange(false);
            }}
            className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Template
          </Button>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>No templates found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence>
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group relative p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      onSelect(template);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-white/60">
                          Created {formatDistanceToNow(new Date(template.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(template);
                            onOpenChange(false);
                          }}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}