-- Schema per la tabella preventivi
-- Da eseguire nell'editor SQL di Supabase

-- Crea la tabella preventivi
CREATE TABLE IF NOT EXISTS preventivi (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    potenza_kWp decimal(10,2) NOT NULL,
    autoconsumo_percentuale decimal(5,2) NOT NULL,
    prezzo_kWh decimal(10,4) NOT NULL,
    risparmio_mensile decimal(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Abilita RLS (Row Level Security)
ALTER TABLE preventivi ENABLE ROW LEVEL SECURITY;

-- Policy: Gli utenti possono vedere solo i propri preventivi
CREATE POLICY "Users can view own preventivi" ON preventivi
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Gli utenti possono inserire i propri preventivi
CREATE POLICY "Users can insert own preventivi" ON preventivi
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Gli utenti possono aggiornare i propri preventivi
CREATE POLICY "Users can update own preventivi" ON preventivi
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Gli utenti possono eliminare i propri preventivi
CREATE POLICY "Users can delete own preventivi" ON preventivi
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_preventivi_updated_at
    BEFORE UPDATE ON preventivi
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();