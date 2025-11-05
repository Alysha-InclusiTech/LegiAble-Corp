-- Create waitlist table
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public waitlist)
CREATE POLICY "Anyone can submit to waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Create policy for reading (only authenticated users, for admin purposes)
CREATE POLICY "Only authenticated users can view waitlist" 
ON public.waitlist 
FOR SELECT 
USING (auth.role() = 'authenticated');