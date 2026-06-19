import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Fayl tapılmadı' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    if (isSupabaseConfigured && supabase) {
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('aras-media')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        return NextResponse.json({ error: 'Supabase storage yüklənmə xətası: ' + error.message }, { status: 500 });
      }

      // Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('aras-media')
        .getPublicUrl(fileName);

      return NextResponse.json({ imageUrl: publicUrlData.publicUrl });
    } else {
      // Save locally to public/uploads
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, new Uint8Array(buffer));

      const imageUrl = `/uploads/${fileName}`;
      return NextResponse.json({ imageUrl });
    }
  } catch (error: any) {
    console.error('File upload api error:', error);
    return NextResponse.json({ error: 'Yükləmə zamanı daxili xəta baş verdi: ' + error.message }, { status: 500 });
  }
}
