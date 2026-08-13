import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The site is a catalogue, not a set of hand-written pages.
 *
 * Adding a tool or an extension has to be one file, or it will not happen: a
 * page someone must hand-build is a page that is skipped when they are busy,
 * and a catalogue that lags behind reality is worse than none — people trust it
 * and are wrong.
 *
 * So both collections are schema-validated. A missing summary or a malformed
 * install line fails the build rather than shipping a card with a blank space
 * where the important sentence goes.
 */

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    // What it is for, in one sentence someone can act on.
    summary: z.string(),
    install: z.string().optional(),
    repo: z.string().url().optional(),
    // Where someone can actually try it. Separate from repo, because source and
    // a running page answer different questions, and a catalogue that offers only
    // the source sends every visitor to a README.
    site: z.string().url().optional(),
    // Lower sorts first. Explicit, because "the order files happen to load in"
    // is not an editorial decision.
    order: z.number().default(50),
    status: z.enum(['stable', 'beta', 'planned']).default('stable'),
  }),
});

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

export const collections = { tools, extensions };