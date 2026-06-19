import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Interfaces
export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  region: 'Tovuz' | 'Qazax' | 'Ağstafa' | 'Şəmkir';
  created_at: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  whatsapp_text: string;
  order_index: number;
}

// Check for Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const isSupabaseConfigured = supabaseUrl.trim() !== '' && supabaseKey.trim() !== '';

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

// Paths for Local Database
const localDbPath = path.join(process.cwd(), 'src/data/db.json');

// Helper to read local DB
function readLocalDb() {
  try {
    if (!fs.existsSync(localDbPath)) {
      return { site_content: [], projects: [], pricing_packages: [] };
    }
    const data = fs.readFileSync(localDbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local db:', error);
    return { site_content: [], projects: [], pricing_packages: [] };
  }
}

// Helper to write local DB
function writeLocalDb(data: any) {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing local db:', error);
  }
}

// =========================================================================
// 1. Site Content Operations
// =========================================================================

export async function getSiteContent(): Promise<Record<string, string>> {
  if (supabase) {
    const { data, error } = await supabase
      .from('site_content')
      .select('*');
    
    if (error) {
      console.error('Supabase error fetching site content:', error);
    } else if (data) {
      const contentMap: Record<string, string> = {};
      data.forEach((item: any) => {
        contentMap[item.key] = item.value;
      });
      return contentMap;
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  const contentMap: Record<string, string> = {};
  db.site_content.forEach((item: any) => {
    contentMap[item.key] = item.value;
  });
  return contentMap;
}

export async function updateSiteContent(key: string, value: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    
    if (error) {
      console.error('Supabase error updating site content:', error);
    } else {
      return;
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  const index = db.site_content.findIndex((item: any) => item.key === key);
  if (index >= 0) {
    db.site_content[index].value = value;
  } else {
    db.site_content.push({ key, value });
  }
  writeLocalDb(db);
}

// =========================================================================
// 2. Projects Operations
// =========================================================================

export async function getProjects(): Promise<Project[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error fetching projects:', error);
    } else if (data) {
      return data as Project[];
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  return (db.projects || []) as Project[];
}

export async function addProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  if (supabase) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        description: project.description,
        image_url: project.image_url,
        region: project.region,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error adding project:', error);
    } else if (data) {
      return data as Project;
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  const newProject: Project = {
    ...project,
    id: Math.random().toString(36).substring(2, 11),
    created_at: new Date().toISOString()
  };
  db.projects = db.projects || [];
  db.projects.unshift(newProject);
  writeLocalDb(db);
  return newProject;
}

export async function updateProject(id: string, project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  if (supabase) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: project.title,
        description: project.description,
        image_url: project.image_url,
        region: project.region
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error updating project:', error);
    } else if (data) {
      return data as Project;
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  const index = db.projects.findIndex((p: any) => p.id === id);
  if (index >= 0) {
    const updated: Project = {
      ...db.projects[index],
      ...project
    };
    db.projects[index] = updated;
    writeLocalDb(db);
    return updated;
  }
  throw new Error('Project not found');
}

export async function deleteProject(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error deleting project:', error);
    } else {
      return;
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  db.projects = (db.projects || []).filter((p: any) => p.id !== id);
  writeLocalDb(db);
}

// =========================================================================
// 3. Pricing Packages Operations
// =========================================================================

export async function getPricingPackages(): Promise<PricingPackage[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Supabase error fetching pricing packages:', error);
    } else if (data) {
      return data as PricingPackage[];
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  return (db.pricing_packages || []).sort((a: any, b: any) => a.order_index - b.order_index) as PricingPackage[];
}

export async function addPricingPackage(pkg: Omit<PricingPackage, 'id'>): Promise<PricingPackage> {
  if (supabase) {
    const { data, error } = await supabase
      .from('pricing_packages')
      .insert({
        name: pkg.name,
        price: pkg.price,
        features: pkg.features,
        whatsapp_text: pkg.whatsapp_text,
        order_index: pkg.order_index
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error adding pricing package:', error);
    } else if (data) {
      return data as PricingPackage;
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  const newPkg: PricingPackage = {
    ...pkg,
    id: Math.random().toString(36).substring(2, 11)
  };
  db.pricing_packages = db.pricing_packages || [];
  db.pricing_packages.push(newPkg);
  db.pricing_packages.sort((a: any, b: any) => a.order_index - b.order_index);
  writeLocalDb(db);
  return newPkg;
}

export async function updatePricingPackage(id: string, pkg: Omit<PricingPackage, 'id'>): Promise<PricingPackage> {
  if (supabase) {
    const { data, error } = await supabase
      .from('pricing_packages')
      .update({
        name: pkg.name,
        price: pkg.price,
        features: pkg.features,
        whatsapp_text: pkg.whatsapp_text,
        order_index: pkg.order_index
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error updating pricing package:', error);
    } else if (data) {
      return data as PricingPackage;
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  const index = db.pricing_packages.findIndex((p: any) => p.id === id);
  if (index >= 0) {
    const updated: PricingPackage = {
      ...db.pricing_packages[index],
      ...pkg
    };
    db.pricing_packages[index] = updated;
    db.pricing_packages.sort((a: any, b: any) => a.order_index - b.order_index);
    writeLocalDb(db);
    return updated;
  }
  throw new Error('Pricing package not found');
}

export async function deletePricingPackage(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from('pricing_packages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error deleting pricing package:', error);
    } else {
      return;
    }
  }

  // Fallback / Mock Mode
  const db = readLocalDb();
  db.pricing_packages = (db.pricing_packages || []).filter((p: any) => p.id !== id);
  writeLocalDb(db);
}
