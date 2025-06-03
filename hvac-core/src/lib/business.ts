// import { supabase } from './supabase'

export function generateBusinessSlug(name: string): string {
  // Convert to lowercase and replace spaces with hyphens
  let slug = name.toLowerCase().replace(/\s+/g, '-')
  
  // Remove special characters
  slug = slug.replace(/[^a-z0-9-]/g, '')
  
  // Remove multiple consecutive hyphens
  slug = slug.replace(/-+/g, '-')
  
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '')
  
  return slug
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  // const { data, error } = await supabase
  //   .from('businesses')
  //   .select('id')
  //   .eq('slug', slug)
  //   .single()
  
  // if (error) {
  //   console.error('Error checking slug availability:', error)
  //   return false
  // }
  
  return false
}

export async function generateUniqueSlug(name: string): Promise<string> {
  let baseSlug = generateBusinessSlug(name)
  let slug = baseSlug
  let counter = 1
  
  while (!(await isSlugAvailable(slug))) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
} 