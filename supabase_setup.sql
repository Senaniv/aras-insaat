-- Supabase Setup Script for Aras İnşaat (Aras Tikinti & Təmir Şirkəti)
-- Run these queries in the Supabase SQL Editor.

-- =========================================================================
-- 1. Create Tables
-- =========================================================================

-- Site Content Table (key-value storage for page headings, contacts, etc.)
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    region TEXT NOT NULL CHECK (region IN ('Tovuz', 'Qazax', 'Ağstafa', 'Şəmkir')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pricing Packages Table
CREATE TABLE IF NOT EXISTS public.pricing_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price INT NOT NULL, -- Price in AZN per m²
    features TEXT[] NOT NULL DEFAULT '{}',
    whatsapp_text TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 2. Create Public Policies (Read for All, Write for Authenticated or Admin)
-- =========================================================================

-- Public Read Policies
CREATE POLICY "Allow public read access to site_content" ON public.site_content
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to pricing_packages" ON public.pricing_packages
    FOR SELECT USING (true);

-- Admin Write Policies (For this application, we allow all operations for anon/authenticated 
-- during setup, or you can restrict to authenticated users once Supabase Auth is enabled)
CREATE POLICY "Allow full access to site_content for admin" ON public.site_content
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to projects for admin" ON public.projects
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to pricing_packages for admin" ON public.pricing_packages
    FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- 3. Storage Setup (aras-media public bucket)
-- =========================================================================

-- Note: Ensure you create a bucket named 'aras-media' in the Supabase Storage Dashboard 
-- and set its access level to PUBLIC. 
-- Alternatively, you can use these SQL commands to set up the bucket and policies:

INSERT INTO storage.buckets (id, name, public) 
VALUES ('aras-media', 'aras-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'aras-media'
CREATE POLICY "Allow public access to media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'aras-media');

CREATE POLICY "Allow anyone to upload media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'aras-media');

CREATE POLICY "Allow anyone to update/delete media"
    ON storage.objects FOR ALL
    USING (bucket_id = 'aras-media')
    WITH CHECK (bucket_id = 'aras-media');

-- =========================================================================
-- 4. Initial Seed Data
-- =========================================================================

-- Seed Site Content
INSERT INTO public.site_content (key, value) VALUES
('hero_title', 'Xəyallarınıza açılan qapı'),
('hero_subtitle', 'Etibarlı inşaat, keyfiyyətli həyat!'),
('phone_1', '051 888 55 99'),
('phone_2', '070 500 29 49'),
('address', 'Tovuz rayonu'),
('instagram', 'https://www.instagram.com/aras_inshaat/')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed Pricing Packages
INSERT INTO public.pricing_packages (name, price, features, whatsapp_text, order_index) VALUES
('Komfort Paket', 250, ARRAY['Divar kağızları (orta keyfiyyət)', 'Asma tavan işləri', 'Laminat döşəmə', 'Santexnika və elektrik quraşdırılması', 'Komplekt təmir materialları daxil'], 'Salam, Komfort Paket təmir paketi haqqında məlumat almaq istəyirəm.', 0),
('Premium Paket', 310, ARRAY['Yüksək keyfiyyətli divar kağızları', 'Alçıpan və dartma tavan dizaynları', 'Premium sinif laminat', 'Keyfiyyətli santexnika və elektrik materialları', 'Hər otaqda xüsusi işıqlandırma'], 'Salam, Premium Paket təmir paketi haqqında məlumat almaq istəyirəm.', 1),
('VIP Paket', 395, ARRAY['İtalyan boya və divar kağızları', 'Dizaynlı tavan işləri (Led daxil)', 'Parket və ya keyfiyyətli kafel-metlax döşəmə', 'İsti döşəmə sistemi', 'Avropa istehsalı santexnika və elektrik elementləri'], 'Salam, VIP Paket təmir paketi haqqında məlumat almaq istəyirəm.', 2),
('Luxury Paket', 500, ARRAY['Fərdi dizayn layihəsi', 'Mərmər və qranit işləri', 'Premium parket döşəmə', 'İtalyan divar panelləri və dekorativ boyalar', 'Akustik tavan və xüsusi gizli işıqlandırma', 'Bütün materiallar xaricdən idxal'], 'Salam, Luxury Paket təmir paketi haqqında məlumat almaq istəyirəm.', 3),
('Gold Paket', 810, ARRAY['Ultra lüks fərdi interyer dizayn layihəsi', 'Tam təbii mərmər və oniks örtüklər', 'Ekzotik ağacdan mozaik parket', 'Ağıllı Ev (Smart Home) sistemi quraşdırılması', 'Eksklüziv İtalyan mebelləri üçün hazırlıq', 'Ömürlük zəmanət və 5 illik pulsuz servis dəstəyi'], 'Salam, Gold Paket təmir paketi haqqında məlumat almaq istəyirəm.', 4)
ON CONFLICT DO NOTHING;
