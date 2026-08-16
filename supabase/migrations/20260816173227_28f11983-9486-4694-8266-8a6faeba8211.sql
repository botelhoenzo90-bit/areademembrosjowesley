-- 1. Add banner_url to principles
ALTER TABLE public.principles ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- 2. Update Principle 1 video URL (fixing potential migration overwrite)
UPDATE public.principles SET video_url = 'https://youtu.be/Cs7ZzmaCmh8' WHERE principle_number = 1;

-- 3. Seed Banners for all 18 principles
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1526634445504-194460ed6d44?q=80&w=2070' WHERE principle_number = 1;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1440778303588-435521a205bc?q=80&w=2070' WHERE principle_number = 2;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2070' WHERE principle_number = 3;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2070' WHERE principle_number = 4;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2070' WHERE principle_number = 5;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=2070' WHERE principle_number = 6;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070' WHERE principle_number = 7;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070' WHERE principle_number = 8;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=2070' WHERE principle_number = 9;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb8?q=80&w=2070' WHERE principle_number = 10;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=2070' WHERE principle_number = 11;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2070' WHERE principle_number = 12;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070' WHERE principle_number = 13;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=2070' WHERE principle_number = 14;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070' WHERE principle_number = 15;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070' WHERE principle_number = 16;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070' WHERE principle_number = 17;
UPDATE public.principles SET banner_url = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070' WHERE principle_number = 18;
