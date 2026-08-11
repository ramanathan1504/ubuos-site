import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Required since Astro 5: without it the docs collection is never registered,
// and every sidebar slug resolves to nothing — which reports as "the slug does
// not exist" even though the file is right there.
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
