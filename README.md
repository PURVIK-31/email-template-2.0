# Email Template Builder

A modern, responsive email template builder with a drag-and-drop interface, real-time preview, and dark mode support.

## Features

- Drag and drop interface for building email templates
- Rich text editing with formatting options
- Image upload and management
- Spacer elements for layout control
- Dark mode support
- Authentication system
- Template saving and loading
- HTML export functionality

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Supabase (Authentication & Database)
- DND Kit (Drag and Drop)
- React Quill (Rich Text Editor)
- React Hot Toast (Notifications)
- Lucide React (Icons)

## Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and configurations
├── types/            # TypeScript type definitions
└── styles/           # CSS and style-related files
```

## Components

- `Editor`: Main component for the template builder
- `SortableSection`: Draggable section component
- `PropertiesPanel`: Section properties editor
- `AuthForm`: Authentication form
- `ThemeProvider`: Dark mode provider
- `ErrorBoundary`: Error handling component

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Required environment variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

The application uses Supabase with the following tables:

- `templates`: Stores email templates
- `template_images`: Manages template images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request