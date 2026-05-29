ALTER TABLE public.employer_results
  ADD COLUMN IF NOT EXISTS suggestions jsonb,
  ADD COLUMN IF NOT EXISTS percentage integer,
  ADD COLUMN IF NOT EXISTS max_score integer;