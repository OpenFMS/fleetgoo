import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content', // Use 'content' for Markdown/MDX
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    // Format: YYYY-MM-DD
    pubDate: z.coerce.date(),
    author: z.string().default('FleetGoo Team'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  })
});

export const collections = {
  'blog': blogCollection,
};
