import { Section } from '../types';

export async function parseHTML(html: string): Promise<Section[]> {
  const sections: Section[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Find the email wrapper
  const wrapper = doc.querySelector('.email-wrapper');
  if (!wrapper) return sections;

  // Process each child element
  wrapper.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      if (element.classList.contains('text-section')) {
        sections.push({
          id: Date.now().toString() + Math.random(),
          type: 'text',
          content: element.innerHTML,
        });
      } else if (element.classList.contains('image-section')) {
        const img = element.querySelector('img');
        if (img) {
          sections.push({
            id: Date.now().toString() + Math.random(),
            type: 'image',
            content: img.src,
          });
        }
      } else if (element.classList.contains('spacer')) {
        sections.push({
          id: Date.now().toString() + Math.random(),
          type: 'spacer',
          content: (element as HTMLElement).style.height || '2rem',
        });
      }
    }
  });

  return sections;
}