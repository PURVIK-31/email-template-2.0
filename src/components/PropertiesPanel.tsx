import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../types';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedSection: string | null;
  sections: Section[];
  onUpdateSection: (sectionId: string, content: string) => void;
  onDeleteSection: (sectionId: string) => void;
}

export function PropertiesPanel({
  selectedSection,
  sections,
  onUpdateSection,
  onDeleteSection,
}: PropertiesPanelProps) {
  const selectedSectionData = sections.find(s => s.id === selectedSection);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white/90">Properties</h2>
      <AnimatePresence mode="wait">
        {selectedSection && selectedSectionData ? (
          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {selectedSectionData.type === 'image' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Image Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['left', 'center', 'right'].map((align) => (
                      <Button
                        key={align}
                        variant="secondary"
                        onClick={() => onUpdateSection(selectedSection, selectedSectionData.content + `?align=${align}`)}
                        className="capitalize bg-white/5 hover:bg-white/10 text-white/90"
                      >
                        {align}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedSectionData.type === 'spacer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Spacer Height
                  </label>
                  <select
                    onChange={(e) => onUpdateSection(selectedSection, e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSectionData.content || '2rem'}
                  >
                    <option value="1rem">Small (16px)</option>
                    <option value="2rem">Medium (32px)</option>
                    <option value="3rem">Large (48px)</option>
                    <option value="4rem">Extra Large (64px)</option>
                  </select>
                </div>
              </div>
            )}

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => onDeleteSection(selectedSection)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Section
            </Button>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/60 text-center"
          >
            Select a section to view its properties
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}