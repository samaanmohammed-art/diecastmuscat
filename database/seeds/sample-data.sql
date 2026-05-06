-- Diecast Muscat — Seed data
-- Run AFTER 001_create_tables.sql, 002_create_indexes.sql, 003_rls_policies.sql

-- Categories
INSERT INTO categories (name, slug, icon, display_order) VALUES
  ('Cars', 'cars', '🚗', 1),
  ('Planes', 'planes', '✈️', 2),
  ('Trucks', 'trucks', '🚚', 3),
  ('Bikes', 'bikes', '🏍️', 4)
ON CONFLICT (slug) DO NOTHING;

-- Sample products
INSERT INTO products (name, description, category, scale, brand, price, stock, sku, images, features, is_limited_edition, is_featured, condition, rating, review_count) VALUES
  ('Lamborghini Aventador SVJ',
   'The pinnacle of Italian engineering captured in 1:18 scale. Hand-finished metallic paint, working scissor doors, detailed V12 engine bay.',
   'cars', '1:18', 'Bburago', 78.500, 4, 'BB-AVNT-SVJ-118',
   '["https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&q=80"]'::jsonb,
   '{"doors_open": true, "hood_opens": true, "steerable": true, "certificate": true}'::jsonb,
   false, true, 'mint', 4.8, 24),

  ('Porsche 911 GT3 RS — Weissach Pkg',
   'Limited edition rendering of the track-focused 992-generation 911 GT3 RS. Carbon-effect aero, opening engine cover, micrometric detailing.',
   'cars', '1:18', 'Minichamps', 165.000, 2, 'MC-911-GT3RS-118',
   '["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"]'::jsonb,
   '{"doors_open": true, "hood_opens": true, "certificate": true, "numbered": "0042/0500"}'::jsonb,
   true, true, 'sealed', 5.0, 9),

  ('Boeing 747-8 Lufthansa',
   'Commercial aviation icon in 1:18 scale. Authentic Lufthansa livery, retractable landing gear, removable engines.',
   'planes', '1:18', 'Herpa Wings', 92.000, 6, 'HW-747-LH-1200',
   '["https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80"]'::jsonb,
   '{"gear_retracts": true, "stand_included": true}'::jsonb,
   false, true, 'mint', 4.6, 18),

  ('F-22 Raptor Stealth Fighter',
   'USAF air superiority fighter in detailed 1:24 scale. Removable canopy, articulating thrust-vector nozzles, weapons bay opens.',
   'planes', '1:24', 'Hobby Master', 58.000, 8, 'HM-F22-172',
   '["https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=1200&q=80"]'::jsonb,
   '{"canopy_opens": true, "weapons_bay": true, "decals_applied": true}'::jsonb,
   false, false, 'mint', 4.7, 11),

  ('Volvo FH16 Globetrotter Reefer',
   'European long-haul tractor with detailed cabin interior, articulating fifth wheel, working refrigerated trailer.',
   'trucks', '1:43', 'Tekno', 124.000, 3, 'TK-VOLVO-FH16-143',
   '["https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80"]'::jsonb,
   '{"trailer_articulates": true, "cabin_tilts": true}'::jsonb,
   true, true, 'sealed', 4.9, 6),

  ('Mercedes-Benz Actros 5',
   'Modern flagship truck with photorealistic livery, detailed Stage V engine, working air suspension.',
   'trucks', '1:43', 'Eligor', 95.000, 5, 'EL-ACTROS5-143',
   '["https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=1200&q=80"]'::jsonb,
   '{"air_suspension": true, "doors_open": true}'::jsonb,
   false, false, 'mint', 4.5, 14),

  ('Ducati Panigale V4 R',
   'Track-focused superbike rendering with carbon fiber details, working suspension, removable race fairings.',
   'bikes', '1:12', 'Maisto', 42.000, 12, 'MS-DUC-V4R-112',
   '["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80"]'::jsonb,
   '{"suspension_works": true, "kick_stand": true, "removable_fairings": true}'::jsonb,
   false, true, 'mint', 4.4, 22),

  ('Harley-Davidson Fat Boy',
   'Iconic American cruiser with chromed engine, detailed exhaust, leather-effect saddle.',
   'bikes', '1:18', 'Maisto', 28.500, 18, 'MS-HD-FATBOY-118',
   '["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80"]'::jsonb,
   '{"chrome_finish": true, "kick_stand": true}'::jsonb,
   false, false, 'mint', 4.2, 31),

  ('Bugatti Chiron Super Sport 300+',
   'World-record breaking hypercar in immaculate detail. Targa-style cabin, exposed quad-turbo W16, hand-painted finish.',
   'cars', '1:43', 'AutoArt', 245.000, 1, 'AA-CHIRON-300-143',
   '["https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=80"]'::jsonb,
   '{"numbered": "0007/0099", "certificate": true, "presentation_box": true}'::jsonb,
   true, true, 'sealed', 5.0, 4),

  ('Concorde — Air France',
   'Supersonic jet legend in retired Air France livery. Drooping nose function, removable engines, stand included.',
   'planes', '1:18', 'Herpa Wings', 178.000, 2, 'HW-CONC-AF-1200',
   '["https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=1200&q=80"]'::jsonb,
   '{"droop_nose": true, "stand_included": true, "retired_livery": true}'::jsonb,
   true, true, 'sealed', 4.9, 7),

  ('Scania R730 V8 Topline',
   'European truck show champion in 1:24 scale. Premium Swedish detailing, chrome accessories, custom airbrush.',
   'trucks', '1:24', 'Italeri', 68.000, 7, 'IT-SCANIA-R730-124',
   '["https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80"]'::jsonb,
   '{"chrome_accessories": true, "custom_airbrush": true}'::jsonb,
   false, false, 'mint', 4.6, 9),

  ('BMW M1000RR Superbike',
   'Bavarian engineering meets racing pedigree. M Carbon wheels, racing tyres, working rear suspension, M decals.',
   'bikes', '1:12', 'Minichamps', 89.000, 5, 'MC-BMW-M1000-112',
   '["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80"]'::jsonb,
   '{"carbon_wheels": true, "suspension_works": true, "decals_applied": true}'::jsonb,
   true, true, 'sealed', 4.8, 5)
ON CONFLICT (sku) DO NOTHING;
