// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

/**
 * docs.ubuos.com
 *
 * Versioning is INSTALLED BUT NOT ENABLED, on purpose.
 *
 * `starlight-versions` is in package.json and ready. It refuses to run with an
 * empty version list, and that refusal is correct: it exists to offer PREVIOUS
 * versions, and there is exactly one version of this so far. A picker with a
 * single entry is furniture -- it implies a choice that does not exist.
 *
 * Turn it on when 1.7 is cut, which is one command and one config line:
 *
 *     npx starlight-versions create 1.6            # snapshot today's pages
 *     plugins: [starlightVersions({ versions: [{ slug: '1.6' }] })]
 *
 * The snapshot is taken from what is live at that moment, so the newest version
 * always stays at the root URLs -- a link shared today keeps pointing at current
 * documentation instead of silently ageing into a frozen copy.
 */
export default defineConfig({
  // One site, not two. A separate docs subdomain meant a second domain to bind,
  // a second project to keep deployed, and a link that leaves the site to read
  // the manual. Built with base '/docs' and dropped into the main output.
  site: 'https://ubuos.com',
  base: '/docs',
  integrations: [
    starlight({
      title: 'ubuos docs',
      description:
        'Maintainer tooling: read any repository, run what needs running, remember what you worked out.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/ramanathan1504/oss-cli' },
      ],
      // No editLink: configuring one puts an "Edit page" button on every page,
      // which for a reader is a jump out of the manual into repository source.
      // Contributors find the source through the GitHub link.
      head: [
        {
          // Links that leave ubuos.com open in a new tab; the manual stays put.
          // Starlight has no per-link control for this, so it is one script.
          tag: 'script',
          content:
            "document.addEventListener('DOMContentLoaded',function(){for(var a of document.querySelectorAll('a[href^=\"http\"]')){if(a.hostname!==location.hostname){a.target='_blank';a.rel='noopener'}}});",
        },
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Install', slug: 'install' },
            { label: 'What it is', slug: 'what-it-is' },
            { label: 'How it fits together', slug: 'how-it-fits' },
            { label: 'Connect your project', slug: 'connect' },
            { label: 'Finding things', slug: 'search' },
          ],
        },
        {
          label: 'Extensions',
          items: [
            { label: 'Attaching one', slug: 'extensions/attaching' },
            { label: 'Writing your own', slug: 'extensions/writing' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Commands', slug: 'reference/commands' },
            { label: 'Writing upstream', slug: 'reference/upstream' },
            { label: 'Changelog', slug: 'reference/changelog' },
          ],
        },
      ],
    }),
  ],
});
