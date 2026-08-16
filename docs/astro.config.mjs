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
      // The wordmark leaves the manual. Starlight's own SiteTitle points at the
      // docs root, so with base '/docs' clicking "ubuos" landed you on the page
      // you were already reading -- the one thing nobody expects from the name in
      // the corner. Overridden to go to the site root, and to carry the same
      // two-part wordmark the landing page header has.
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
        // And the same links the landing header carries, so entering the manual
        // does not drop every way back out of it.
        SocialIcons: './src/components/SocialIcons.astro',
      },
      description:
        'Maintainer tooling: read any repository, run what needs running, remember what you worked out.',
      // Tokens only, lifted from the landing page. Following a "Docs" link used
      // to change the palette out from under the reader -- Starlight's purple on
      // grey against the site's teal and brass -- which reads as a different
      // product, and for a manual that is the one impression you cannot afford.
      customCss: ['./src/styles/ubuos.css'],
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
        {
          // The cable board, wherever a page puts one. It counts its own chips
          // rather than being told a total, so a command added to the markup is
          // counted without anyone remembering to update a number -- the same
          // rule the CLI's own release tests enforce on its prose.
          tag: 'script',
          content: `document.addEventListener('DOMContentLoaded',function(){
  var board=document.getElementById('cable'),btn=document.getElementById('cable-switch'),num=document.getElementById('cable-num');
  if(!board||!btn||!num)return;
  var all=board.querySelectorAll('.cmd').length,net=board.querySelectorAll('.cmd.net').length;
  var calm=matchMedia('(prefers-reduced-motion: reduce)'),raf=0;
  function countTo(t){cancelAnimationFrame(raf);var from=parseInt(num.textContent,10)||all;
    if(calm.matches||from===t){num.textContent=String(t);return}
    var s=performance.now();(function tick(now){var p=Math.min(1,(now-s)/420),e=1-Math.pow(1-p,3);
      num.textContent=String(Math.round(from+(t-from)*e));if(p<1)raf=requestAnimationFrame(tick)})(s)}
  function set(cut){board.classList.toggle('cut',cut);btn.setAttribute('aria-pressed',String(cut));
    btn.querySelector('.cable-label').textContent=cut?'Plug it back in':'Pull the cable';
    countTo(cut?all-net:all)}
  btn.addEventListener('click',function(){set(btn.getAttribute('aria-pressed')!=='true')});
  if(calm.matches)return;
  var shown=false,io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting||shown)return;shown=true;io.disconnect();
    setTimeout(function(){if(btn.getAttribute('aria-pressed')==='true')return;set(true);
      setTimeout(function(){if(btn.getAttribute('aria-pressed')==='true')set(false)},2400)},600)})},{threshold:.35});
  io.observe(board);
});`,
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
            { label: 'Conversations', slug: 'conversations' },
            { label: 'What keeps running', slug: 'background' },
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
