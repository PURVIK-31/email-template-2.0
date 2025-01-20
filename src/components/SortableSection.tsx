import React, { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';
import { Section } from '../types';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SortableSectionProps {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (content: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const quillModules = {
  toolbar: [
    [{ 'font': ['Arial', 'Helvetica', 'Times New Roman'] }],
    ['bold', 'italic', 'underline'],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const quillFormats = [
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'header',
  'color',
  'background',
  'align',
];

export function SortableSection({
  section,
  isSelected,
  onClick,
  onUpdate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: SortableSectionProps) {
  const quillRef = useRef<ReactQuill>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEditorChange = (content: string) => {
    onUpdate(content);
  };

  return (
    <TooltipProvider>
      <motion.div
        ref={setNodeRef}
        style={style}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative p-4 mb-4 rounded-lg backdrop-blur-xl border-2 transition-all duration-200 ${
          isSelected 
            ? 'bg-white/10 border-blue-500/50' 
            : 'bg-black/40 border-white/10 hover:border-white/20'
        }`}
        onClick={onClick}
      >
        {/* Movement Controls */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/40 hover:bg-black/60 text-white/80"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp?.();
                }}
                disabled={isFirst}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move Up</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/40 hover:bg-black/60 text-white/80"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown?.();
                }}
                disabled={isLast}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move Down</TooltipContent>
          </Tooltip>
        </div>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute right-2 top-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-white/50" />
        </div>

        {section.type === 'text' && (
          <div className="quill-wrapper text-white">
            <ReactQuill
              ref={quillRef}
              value={section.content}
              onChange={handleEditorChange}
              modules={quillModules}
              formats={quillFormats}
              theme="snow"
              preserveWhitespace
            />
          </div>
        )}
        
        {section.type === 'image' && (
          <motion.img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/template-images/${section.content}`}
            alt="Template section"
            className="max-w-full h-auto rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {section.type === 'spacer' && (
          <div 
            style={{ height: section.content || '2rem' }}
            className="w-full bg-white/5 rounded-lg transition-all duration-200"
          />
        )}
      </motion.div>
    </TooltipProvider>
  );
}