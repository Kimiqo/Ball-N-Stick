Build a premium, modern website for BALL & STICK GHANA, a Ghanaian organization focused on growing hockey through schools, youth development, events, officiating, projects and partnerships.

FIRST:
Inspect https://www.ballandstick.com and publicly available Ball & Stick content/assets. Understand the existing organization, branding, projects, events and content before building. Do NOT invent facts, statistics, schools, partners or programmes.

GOAL:
Replace the old website with a visually exceptional digital platform that feels like:
Nike Sports × modern sports editorial × premium African creative direction.

This is NOT a generic NGO website.

STACK:
- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Cloudinary for media
- Framer Motion
- GSAP + ScrollTrigger
- Lenis
- Three.js + React Three Fiber + Drei
- Lucide icons

ARCHITECTURE:
Create one monorepo containing:

/client
/server
/docs

Use reusable components, hooks, services, types and animation utilities.

PUBLIC WEBSITE:
/
/about
/what-we-do
/projects
/projects/:slug
/events
/events/:slug
/schools
/schools/:slug
/stories
/stories/:slug
/gallery
/people
/partners
/get-involved
/contact

HOMEPAGE:

1. HERO
Full-screen cinematic hockey imagery/video.

Large headline:
"GROWING THE GAME.
BUILDING THE NEXT GENERATION."

CTA:
EXPLORE OUR WORK
GET INVOLVED

Use subtle 3D hockey-inspired object/scene.

2. IMPACT
Animated statistics managed through CMS.

3. WHAT WE DO
Hockey Development
Schools
Youth Development
Officiating
Events
Partnerships

4. FEATURED PROJECTS
Large editorial project cards with scroll-driven storytelling.

5. UPCOMING EVENT
Visually prominent event section.

6. SCHOOL NETWORK
Showcase participating schools.

7. STORIES
Editorial/news section.

8. GALLERY
Immersive photography.

9. PARTNERS
Partner logos.

10. FINAL CTA
GET INVOLVED.

PAGES:

PROJECTS:
Show Ball & Stick initiatives with image, description, objectives, impact, partners and gallery.

EVENTS:
Upcoming/past events, event details, schedule, location, participating schools and registration.

SCHOOLS:
Searchable/filterable directory and school profiles.

STORIES:
Editorial content/newsroom with categories and rich-text articles.

GALLERY:
Masonry layout + fullscreen lightbox.

ABOUT:
Mission, vision, values, history timeline, leadership and impact.

PEOPLE:
Leadership, coaches, officials and contributors.

PARTNERS:
Partner showcase and partnership CTA.

GET INVOLVED:
Separate pathways for schools, students/players, partners and sponsors.

CONTACT:
Validated contact form connected to backend.

ADMIN CMS:
Create /admin with authentication and role-based access.

Manage:
- Projects
- Events
- Schools
- Stories
- Gallery
- People
- Partners
- Registrations
- Contact messages
- Impact statistics
- Site settings

Roles:
SUPER_ADMIN
ADMIN
EDITOR

DATABASE MODELS:
User
Project
Event
School
Story
Person
Partner
GalleryItem
Registration
ContactMessage
SiteSettings

ANIMATION:

Use Lenis globally for smooth scrolling.

Use Framer Motion for:
- menus
- modals
- page transitions
- microinteractions

Use GSAP + ScrollTrigger for:
- hero transitions
- text reveals
- image reveals
- counters
- parallax
- pinned sections
- horizontal project storytelling
- about timeline

Use Three.js only for selected premium visual moments, especially the hero.

DO NOT over-animate.

Animation should feel cinematic and intentional.

Respect prefers-reduced-motion.

On mobile, simplify heavy animations and disable unnecessary 3D/parallax.

DESIGN:

Premium sports/editorial aesthetic.

Use the organization's existing branding after inspecting the old site.

Visual direction:
- deep green / black / off-white where appropriate
- huge typography
- cinematic photography
- strong whitespace
- bold layouts
- subtle grain
- sharp editorial composition
- restrained rounded corners
- premium hover states

Avoid:
- generic NGO templates
- excessive cards
- excessive gradients
- excessive glassmorphism
- dashboard-like public pages
- animation everywhere

Use responsive typography such as:

font-size: clamp(3rem, 8vw, 9rem);

Container max-width around 1440px.

Mobile padding: 20–24px.
Desktop padding: 40–64px.

PERFORMANCE:

Target Lighthouse:
Performance 90+
Accessibility 95+
SEO 95+

Use:
- WebP/AVIF
- lazy loading
- responsive images
- dynamic imports
- Cloudinary transformations
- code splitting

Three.js must be dynamically loaded and have a non-WebGL fallback.

SEO:
- metadata per page
- OpenGraph
- sitemap
- robots.txt
- structured data for Organization, Event and Article

SECURITY:
- Helmet
- CORS
- rate limiting
- validation/sanitization
- bcrypt
- JWT
- environment variables
- secure API

IMPORTANT:

Do not fabricate Ball & Stick content.

Use clearly marked demo data only where necessary.

Build the static/public experience first, then backend, then CMS, then connect everything.

Before coding, create:

/docs/content-audit.md
/docs/site-architecture.md
/docs/progress.md

Work iteratively:
1. Inspect old site
2. Establish design system
3. Build homepage
4. Build public pages
5. Build backend/API
6. Build CMS
7. Connect CMS
8. Add animation/3D polish
9. Test mobile/accessibility/performance
10. Deploy-ready production build

The final website should feel like:

"A new digital era for hockey in Ghana."

It should be impressive enough for sponsors, schools, international partners and media, while remaining practical for Ball & Stick staff to manage.