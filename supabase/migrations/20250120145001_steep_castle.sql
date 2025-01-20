/*
  # Email Template Builder Schema

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `content` (jsonb)
      - `html` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `template_images`
      - `id` (uuid, primary key)
      - `template_id` (uuid, references templates)
      - `url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own templates and images
*/

-- Create templates table
CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  html text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create template_images table
CREATE TABLE template_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates ON DELETE CASCADE,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own templates"
  ON templates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage images for their templates"
  ON template_images
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM templates 
    WHERE templates.id = template_images.template_id 
    AND templates.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM templates 
    WHERE templates.id = template_images.template_id 
    AND templates.user_id = auth.uid()
  ));