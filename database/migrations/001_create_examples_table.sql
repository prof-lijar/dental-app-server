-- Example migration file
-- Run this in your Supabase SQL editor to create the examples table
-- Replace with your actual table schemas

CREATE TABLE IF NOT EXISTS examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_examples_name ON examples(name);
CREATE INDEX IF NOT EXISTS idx_examples_created_at ON examples(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_examples_updated_at BEFORE UPDATE ON examples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

