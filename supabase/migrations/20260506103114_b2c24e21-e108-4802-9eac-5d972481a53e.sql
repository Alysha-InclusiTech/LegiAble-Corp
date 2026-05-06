
CREATE TABLE public.employer_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  score INTEGER NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.employer_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit employer results"
ON public.employer_results
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can view employer results"
ON public.employer_results
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
