/**
 * ============================================================
 *  EDIT THIS FILE to update the text, links and media of the site.
 * ============================================================
 */

export const site = {
  name: 'Ritik Karak',
  shortName: 'RK',
  role: 'Video Editor · Web Developer · Meta Ads',
  tagline: 'I cut stories that move — and build websites that perform.',
  location: 'Delhi, India',
  email: 'rockykarak0@gmail.com',
  phone: '+91 85272 90722',
  phoneRaw: '918527290722',
  availability: {
    open: true,
    text: 'Available for freelance projects',
    note: 'Taking on new work from October 2026',
  },
  representation: 'Self-represented — reach out to me directly, no middlemen.',

  // Hero background reel (muted, looping). Short preview clip — keeps first paint fast.
  // Set to '' to use only the 3D background.
  heroVideo: '/videos/reel-loop.mp4',

  // Full showreel — YouTube / Vimeo link or an .mp4 path. Leave the placeholder until the real reel is ready.
  showreelUrl: '/videos/reel-loop.mp4',
  showreelPoster: '',
  showreelPreview: '',

  // Social links: leave a value empty ('') to hide that icon automatically.
  socials: [
    { label: 'Instagram', url: '' },
    { label: 'YouTube', url: '' },
    { label: 'Vimeo', url: '' },
    { label: 'LinkedIn', url: '' },
    { label: 'GitHub', url: '' },
  ],

  // Portrait — drop a file at client/public/images/ritik.jpg (4:5 works best).
  portrait: '/images/ritik.jpg',
};

export const nav = [
  { label: 'Work', to: '/work' },
  { label: 'Showreel', to: '/showreel' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

export const stats = [
  { value: 3, suffix: '', label: 'Disciplines: edit, code, ads' },
  { value: 81, suffix: '%', label: 'BCA aggregate (CGPA 8.14)' },
  { prefix: 'Top ', value: 9, suffix: '%', label: 'Class ranking at GGSIPU' },
  { value: 5, suffix: '', label: 'Languages spoken' },
];

export const about = {
  headline: 'Part editor. Part engineer. Fully obsessed with the details.',
  bio: [
    "I'm Ritik — a creative and versatile BCA graduate from Delhi who lives between the timeline and the terminal. I edit promotional videos and social-media creatives that hold attention in the first three seconds, and I build responsive, user-friendly React websites that load fast and convert.",
    'Because I understand both sides — how a story is cut and how a product is shipped — I can take a brand from idea to reel to landing page to Meta Ads campaign without handing it off three times.',
    'I ranked in the top 9% of my class at Guru Gobind Singh Indraprastha University, was an active participant in technical clubs and coding contests, and I keep learning: right now I am pursuing Ethical Hacking with AI.',
  ],
  passion:
    'Outside of work you will find me experimenting with AI-powered creative tools, chasing the perfect colour grade, and pushing my limits in arm wrestling — where I earned a Best Performer award.',
  languages: ['English', 'Hindi', 'French', 'Tamil', 'Gujarati'],
};

export const equipment = [
  {
    group: 'Editing',
    items: ['Adobe Premiere Pro', 'CapCut', 'Reels / Shorts workflows', 'Social-first cutdowns'],
  },
  {
    group: 'Motion Graphics',
    items: ['Adobe After Effects', 'Kinetic typography', 'Logo stings & lower thirds'],
  },
  {
    group: 'Colour',
    items: ['DaVinci Resolve', 'Colour grading & LUTs', 'Skin-tone matching'],
  },
  {
    group: 'Web & Marketing',
    items: ['React · Next.js · Node.js', 'MongoDB · MySQL · Supabase', 'Meta Ads · Social media management'],
  },
];

export const techStack = [
  'Premiere Pro',
  'After Effects',
  'DaVinci Resolve',
  'CapCut',
  'React',
  'Next.js',
  'Node.js',
  'MongoDB',
  'MySQL',
  'JavaScript',
  'PHP',
  'Supabase Auth',
  'HTML5',
  'CSS3',
  'Meta Ads',
];

export const education = {
  school: 'Guru Gobind Singh Indraprastha University, Delhi',
  degree: 'Bachelor of Computer Application (B.C.A)',
  date: 'Aug 2025',
  points: [
    'Ranked in the top 9% of the class',
    'CGPA 8.142 — equivalent 81.4%',
    'Key projects built with HTML, CSS, JavaScript, React.js and SQL',
    'Active participant in technical clubs and coding contests',
  ],
};

export const awards = [
  { title: 'Best Performer Award', detail: 'Arm Wrestling', year: 'Award' },
  { title: 'Full Stack Web Development', detail: 'Certificate', year: 'Certification' },
  { title: 'Affiliate Marketing', detail: 'Certificate', year: 'Certification' },
  { title: 'Elevance Skills Training', detail: 'Certificate', year: 'Certification' },
  { title: 'Ethical Hacking with AI', detail: 'Currently pursuing', year: 'In progress' },
];

/**
 * Client logos — add real ones, e.g. { name: 'Brand', logo: '/images/clients/brand.svg' }.
 * The "Clients" strip stays hidden while this list is empty.
 */
export const clients = [];

export const showreels = [
  { id: 'main', label: 'Full Reel', blurb: 'The complete showreel — best work across every category.', url: '/videos/reel-loop.mp4', poster: '', previewUrl: '', gradient: ['#ff3d2e', '#2a1b6e'] },
  { id: 'commercial', label: 'Commercial', blurb: 'Promos, product launches and Meta Ads creatives.', url: '/videos/reel-loop.mp4', poster: '', previewUrl: '', gradient: ['#ffb347', '#ff3d2e'] },
  { id: 'documentary', label: 'Documentary', blurb: 'Interview-driven storytelling with a clean, honest grade.', url: '/videos/reel-loop.mp4', poster: '', previewUrl: '', gradient: ['#c9a24b', '#6b2b1a'] },
  { id: 'music', label: 'Music Video', blurb: 'Rhythm-driven cuts, VFX and stylised colour.', url: '/videos/reel-loop.mp4', poster: '', previewUrl: '', gradient: ['#b14bff', '#ff3d8e'] },
  { id: 'narrative', label: 'Narrative', blurb: 'Short-form fiction: pacing, performance and mood.', url: '/videos/reel-loop.mp4', poster: '', previewUrl: '', gradient: ['#00d4c8', '#3a5bff'] },
];

export const services = [
  {
    id: 'editing',
    title: 'Video Editing',
    desc: 'Promos, reels, YouTube, ads and long-form — cut for rhythm, retention and story.',
    points: ['Reels / Shorts / TikTok', 'Brand & product films', 'YouTube & podcasts', 'Multi-cam & interviews'],
  },
  {
    id: 'color',
    title: 'Colour Grading',
    desc: 'Cinematic, consistent colour in DaVinci Resolve — from natural to stylised looks.',
    points: ['Shot matching', 'Custom looks & LUTs', 'Skin-tone balance', 'HDR-safe delivery'],
  },
  {
    id: 'motion',
    title: 'Motion Graphics',
    desc: 'After Effects animation that makes information feel alive and brands feel premium.',
    points: ['Kinetic typography', 'Logo animation', 'Lower thirds & titles', 'Explainer graphics'],
  },
  {
    id: 'sound',
    title: 'Sound Design',
    desc: 'Clean dialogue, music timing and punchy SFX so the edit sounds as good as it looks.',
    points: ['Audio clean-up', 'Music & SFX layering', 'Mix for social platforms', 'Voice-over sync'],
  },
  {
    id: 'web',
    title: 'Web Design & Development',
    desc: 'Fast, animated, responsive React / Next.js / MERN websites built to convert.',
    points: ['Portfolio & business sites', 'React · Next.js · Node', 'MongoDB / MySQL / Supabase', 'SEO-ready & deploy-ready'],
  },
  {
    id: 'ads',
    title: 'Meta Ads & Social',
    desc: 'Scroll-stopping creatives plus campaign setup, so the video actually reaches buyers.',
    points: ['Ad creative production', 'Meta Ads campaigns', 'Social media management', 'Content calendars'],
  },
];

export const workflow = [
  { step: '01', title: 'Brief', text: 'A quick call or message to understand the goal, audience and deadline.' },
  { step: '02', title: 'Rough cut', text: 'A first pass with structure, pacing and music in place, shared quickly.' },
  { step: '03', title: 'Refine', text: 'Your feedback shapes the polish: motion, sound and the final colour grade.' },
  { step: '04', title: 'Deliver', text: 'Platform-ready exports and files, on time. Every time.' },
];

export const projectTypes = [
  'Video editing',
  'Colour grading',
  'Motion graphics',
  'Sound design',
  'Website / web app',
  'Meta Ads & social',
  'Something else',
];

export const budgets = ['Under ₹10k', '₹10k – ₹25k', '₹25k – ₹50k', '₹50k+', 'Not sure yet'];
