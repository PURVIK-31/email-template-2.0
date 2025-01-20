import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDropzone } from 'react-dropzone';
import { Save, Image, Type, Layout, FileDown, Plus, FolderOpen, Eye, Send, Smartphone, Monitor, Upload, Download, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortableSection } from './SortableSection';
import { PropertiesPanel } from './PropertiesPanel';
import { TemplateListDialog } from './TemplateListDialog';
import { PreviewDialog } from './PreviewDialog';
import { ImportDialog } from './ImportDialog';
import { ExportDialog } from './ExportDialog';
import { supabase } from '../lib/supabase';
import { useTemplates } from '../hooks/useTemplates';
import { Section, Template, ViewportSize } from '../types';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { generateHTML } from '../lib/generateHTML';
import { parseHTML } from '../lib/parseHTML';
import toast from 'react-hot-toast';

export function Editor() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { templates, isLoading, loadTemplates, saveTemplate, updateTemplate } = useTemplates();

  useEffect(() => {
    loadTemplates();
  }, []);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const { data, error } = await supabase.storage
        .from('template-images')
        .upload(`${Date.now()}-${file.name}`, file);

      if (error) throw error;

      const newSection: Section = {
        id: Date.now().toString(),
        type: 'image',
        content: data.path,
      };

      setSections(prev => [...prev, newSection]);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sections.length) return;
    setSections(prev => arrayMove(prev, fromIndex, toIndex));
  };

  const addTextSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      type: 'text',
      content: '',
    };
    setSections(prev => [...prev, newSection]);
    toast.success('Text section added');
  };

  const addSpacerSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      type: 'spacer',
      content: '2rem',
    };
    setSections(prev => [...prev, newSection]);
    toast.success('Spacer added');
  };

  const updateSection = (sectionId: string, content: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, content } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
    toast.success('Section deleted');
  };

  const handleSaveTemplate = async () => {
    if (!templateName) {
      toast.error('Please enter a template name');
      return;
    }

    if (sections.length === 0) {
      toast.error('Please add some content to your template');
      return;
    }

    try {
      if (selectedTemplate) {
        await updateTemplate(selectedTemplate.id, templateName, sections);
        toast.success('Template updated successfully!');
      } else {
        await saveTemplate(templateName, sections);
        toast.success('Template saved successfully!');
      }
      await loadTemplates();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save template');
    }
  };

  const handleLoadTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setSections(template.content);
    setShowTemplates(false);
    toast.success('Template loaded successfully!');
  };

  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setTemplateName('');
    setSections([]);
  };

  const handleExportHTML = () => {
    if (sections.length === 0) {
      toast.error('Please add some content before exporting');
      return;
    }

    const html = generateHTML(sections, templateName);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName || 'email-template'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template exported successfully!');
  };

  const handleTestSend = async (email: string) => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      // In a real application, you would send this to your backend
      // For now, we'll just show a success message
      toast.success(`Test email would be sent to ${email}`);
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send test email');
    }
  };

  const handleImportHTML = async (file: File) => {
    try {
      const text = await file.text();
      const sections = await parseHTML(text);
      setSections(sections);
      toast.success('Template imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import template');
    }
  };

  const handleDuplicateTemplate = async () => {
    if (!selectedTemplate) {
      toast.error('No template selected to duplicate');
      return;
    }

    try {
      const newName = `${templateName} (Copy)`;
      await saveTemplate(newName, sections);
      toast.success('Template duplicated successfully!');
      await loadTemplates();
    } catch (error) {
      console.error('Duplication error:', error);
      toast.error('Failed to duplicate template');
    }
  };

  const handleBackupTemplates = () => {
    try {
      const backup = {
        version: '1.0',
        date: new Date().toISOString(),
        templates: templates,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-templates-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Templates backed up successfully!');
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Failed to backup templates');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden gradient-bg">
      <TooltipProvider>
        {/* Toolbar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-16 bg-black/40 backdrop-blur-xl p-4 flex flex-col gap-4 border-r border-white/10"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={addTextSection}
                className="toolbar-button"
              >
                <Type className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Text Section</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="toolbar-button"
                >
                  <Image className="h-5 w-5" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>Add Image</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={addSpacerSection}
                className="toolbar-button"
              >
                <Layout className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Spacer</TooltipContent>
          </Tooltip>

          <div className="h-px bg-white/10 my-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowImport(true)}
                className="toolbar-button text-orange-400"
              >
                <Upload className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import Template</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowExport(true)}
                className="toolbar-button text-indigo-400"
              >
                <Download className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export Options</TooltipContent>
          </Tooltip>

          {selectedTemplate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDuplicateTemplate}
                  className="toolbar-button text-pink-400"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate Template</TooltipContent>
            </Tooltip>
          )}

          <div className="flex-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(true)}
                className="toolbar-button text-green-400"
              >
                <Eye className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview Template</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTemplates(true)}
                className="toolbar-button text-yellow-400"
              >
                <FolderOpen className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open Template</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveTemplate}
                className="toolbar-button text-blue-400"
              >
                <Save className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save Template</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExportHTML}
                className="toolbar-button text-purple-400"
              >
                <FileDown className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export HTML</TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Main Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 overflow-y-auto p-8 custom-scrollbar"
        >
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 mb-4"
            >
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template Name"
                className="flex-1 p-2 rounded-lg bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            <DndContext
              sensors={[]}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence>
                  {sections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SortableSection
                        section={section}
                        isSelected={selectedSection === section.id}
                        onClick={() => setSelectedSection(section.id)}
                        onUpdate={(content) => updateSection(section.id, content)}
                        onMoveUp={() => moveSection(index, index - 1)}
                        onMoveDown={() => moveSection(index, index + 1)}
                        isFirst={index === 0}
                        isLast={index === sections.length - 1}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SortableContext>
            </DndContext>

            {sections.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-white/60"
              >
                <Plus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">Start by adding content using the toolbar</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Properties Panel */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 bg-black/40 backdrop-blur-xl p-6 border-l border-white/10"
        >
          <PropertiesPanel
            selectedSection={selectedSection}
            sections={sections}
            onUpdateSection={updateSection}
            onDeleteSection={deleteSection}
          />
        </motion.div>

        {/* Template List Dialog */}
        <TemplateListDialog
          open={showTemplates}
          onOpenChange={setShowTemplates}
          templates={templates}
          isLoading={isLoading}
          onSelect={handleLoadTemplate}
          onNewTemplate={handleNewTemplate}
        />

        {/* Preview Dialog */}
        <PreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          templateName={templateName}
          sections={sections}
          viewportSize={viewportSize}
          onViewportChange={setViewportSize}
          onTestSend={handleTestSend}
        />

        {/* Import Dialog */}
        <ImportDialog
          open={showImport}
          onOpenChange={setShowImport}
          onImport={handleImportHTML}
        />

        {/* Export Dialog */}
        <ExportDialog
          open={showExport}
          onOpenChange={setShowExport}
          onExportHTML={handleExportHTML}
          onBackupTemplates={handleBackupTemplates}
          templateName={templateName}
        />
      </TooltipProvider>
    </div>
  );
}