import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('AI Website Builders'),
    tags: z.array(z.string()).default([]),
    affiliate: z.string().optional(),
  }),
});

export const collections = {
  'posts': postsCollection,
};
