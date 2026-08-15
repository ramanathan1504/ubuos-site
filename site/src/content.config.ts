import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Extensions are a catalogue; the product is not.
 *
 * There was a `tools` collection too, feeding a catalogue at the site root. With
 * exactly one tool in it, that root was a second full landing page -- its own
 * headline, its own install line -- standing in front of the real one at
 * /osscli/. Two front doors for one product, and nothing to tell a visitor which
 * was the real one. The product page is the root now, and this collection went
 * with the page that read it.
 *
 * Adding an extension has to stay one file, or it will not happen: a page
 * someone must hand-build is skipped when they are busy, and a catalogue that
 * lags behind reality is worse than none -- people trust it and are wrong. So it
 * stays schema-validated; a missing summary fails the build rather than shipping
 * a card with a blank where the important sentence goes.
 */

const extensions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/extensions' }),
  schema: z.object({
    name: z.string(),
    // What it plugs into, and as what. The two kinds the core dispatches to.
    kind: z.enum(['runner', 'memory']),
    summary: z.string(),
    repo: z.string().url().optional(),
    attach: z.string(),
    author: z.string().optional(),
    order: z.number().default(50),
  }),
});

export const collections = { extensions };