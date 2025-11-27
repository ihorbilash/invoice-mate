-- Create invoice status enum
CREATE TYPE public.invoice_status AS ENUM ('pending', 'paid', 'overdue');

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status invoice_status NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read for this demo)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo purposes
CREATE POLICY "Anyone can view invoices"
ON public.invoices
FOR SELECT
USING (true);

-- Allow public insert for demo
CREATE POLICY "Anyone can create invoices"
ON public.invoices
FOR INSERT
WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.invoices (invoice_number, client_name, client_email, amount, status, due_date, description) VALUES
('INV-001', 'Acme Corp', 'billing@acme.com', 2500.00, 'paid', '2025-11-15', 'Website Development'),
('INV-002', 'TechStart Inc', 'finance@techstart.io', 1800.00, 'pending', '2025-12-01', 'Consulting Services'),
('INV-003', 'Global Solutions', 'accounts@global.co', 4200.00, 'overdue', '2025-11-20', 'Annual Maintenance');