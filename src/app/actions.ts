'use server';

import { revalidatePath } from 'next/cache';
import * as db from '@/lib/db';

export async function updateSiteContentAction(key: string, value: string) {
  await db.updateSiteContent(key, value);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function addProjectAction(title: string, description: string, image_url: string, region: 'Tovuz' | 'Qazax' | 'Ağstafa' | 'Şəmkir') {
  const newProject = await db.addProject({ title, description, image_url, region });
  revalidatePath('/');
  revalidatePath('/admin');
  return newProject;
}

export async function updateProjectAction(id: string, title: string, description: string, image_url: string, region: 'Tovuz' | 'Qazax' | 'Ağstafa' | 'Şəmkir') {
  const updated = await db.updateProject(id, { title, description, image_url, region });
  revalidatePath('/');
  revalidatePath('/admin');
  return updated;
}

export async function deleteProjectAction(id: string) {
  await db.deleteProject(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function addPricingPackageAction(name: string, price: number, features: string[], whatsapp_text: string, order_index: number) {
  const newPkg = await db.addPricingPackage({ name, price, features, whatsapp_text, order_index });
  revalidatePath('/');
  revalidatePath('/admin');
  return newPkg;
}

export async function updatePricingPackageAction(id: string, name: string, price: number, features: string[], whatsapp_text: string, order_index: number) {
  const updated = await db.updatePricingPackage(id, { name, price, features, whatsapp_text, order_index });
  revalidatePath('/');
  revalidatePath('/admin');
  return updated;
}

export async function deletePricingPackageAction(id: string) {
  await db.deletePricingPackage(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function checkAdminPasscodeAction(passcode: string): Promise<boolean> {
  const adminPasscode = process.env.ADMIN_PASSCODE || 'aras2026';
  return passcode === adminPasscode;
}

