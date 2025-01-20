import { useState } from 'react';
import { Template, Section } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing email templates
 * @returns Template management methods and state
 */
export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error loading templates:', error);
      setError(error.message);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (name: string, content: Section[]) => {
    if (!name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    try {
      const { error } = await supabase
        .from('templates')
        .insert([
          {
            name,
            content,
          },
        ])
        .select();

      if (error) throw error;
      toast.success('Template saved successfully!');
      await loadTemplates();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save template');
    }
  };

  const updateTemplate = async (id: string, name: string, content: Section[]) => {
    if (!name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    try {
      const { error } = await supabase
        .from('templates')
        .update({ name, content })
        .eq('id', id);

      if (error) throw error;
      toast.success('Template updated successfully!');
      await loadTemplates();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error('Failed to update template');
    }
  };

  return {
    templates,
    isLoading,
    error,
    loadTemplates,
    saveTemplate,
    updateTemplate,
  };
}