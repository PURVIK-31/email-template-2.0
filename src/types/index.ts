/**
 * Represents a section in the email template
 */
export interface Section {
  id: string;
  type: 'text' | 'image' | 'spacer';
  content: string;
}

/**
 * Represents a saved email template
 */
export interface Template {
  id: string;
  name: string;
  content: Section[];
  created_at: string;
}

/**
 * Properties for the SortableSection component
 */
export interface SortableSectionProps {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (content: string) => void;
}

/**
 * Viewport size options for preview
 */
export type ViewportSize = 'mobile' | 'desktop';