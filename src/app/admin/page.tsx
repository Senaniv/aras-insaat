import * as db from '@/lib/db';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const siteContent = await db.getSiteContent();
  const projects = await db.getProjects();
  const pricingPackages = await db.getPricingPackages();
  const databaseType = db.isSupabaseConfigured ? 'Supabase Cloud' : 'Lokal Mock JSON';

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <AdminDashboard
        initialSiteContent={siteContent}
        initialProjects={projects}
        initialPackages={pricingPackages}
        databaseType={databaseType}
      />
    </main>
  );
}
