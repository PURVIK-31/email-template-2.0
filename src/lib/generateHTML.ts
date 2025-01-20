import { Section } from '../types';

export function generateHTML(sections: Section[], templateName: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateName || 'Email Template'}</title>
  <style>
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .text-section {
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .image-section {
      margin-bottom: 20px;
    }
    .image-section img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    .spacer {
      display: block;
      width: 100%;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        width: 100% !important;
        padding: 10px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    ${sections.map(section => {
      switch (section.type) {
        case 'text':
          return `<div class="text-section">${section.content}</div>`;
        case 'image':
          const [path, params] = section.content.split('?');
          const align = new URLSearchParams(params || '').get('align') || 'center';
          return `
            <div class="image-section" style="text-align: ${align}">
              <img src="${path}" alt="Template image" style="margin: 0 auto;">
            </div>
          `;
        case 'spacer':
          return `<div class="spacer" style="height: ${section.content}"></div>`;
        default:
          return '';
      }
    }).join('\n')}
  </div>
</body>
</html>
  `.trim();
}