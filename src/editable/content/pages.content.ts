import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Curated resources, tools, and collections worth saving',
      description: 'Discover trusted bookmarks, tools, and reference links organized into collections. A cleaner way to find and save the best resources on the web.',
      openGraphTitle: 'Curated resources, tools, and collections worth saving',
      openGraphDescription: 'Discover trusted bookmarks, tools, and reference links organized into collections.',
      keywords: ['curated resources', 'bookmarks', 'collections', 'resource discovery', 'tools'],
    },
    hero: {
      badge: 'The Library',
      title: ['Discover curated resources', 'worth saving.'],
      description: 'Browse trusted tools, references, and links organized into collections by curators who care about quality over quantity.',
      primaryCta: { label: 'Browse the library', href: '/sbm' },
      secondaryCta: { label: 'Learn more', href: '/about' },
      searchPlaceholder: 'Search resources, tools, collections…',
      focusLabel: 'Focus',
      featureCardBadge: 'latest additions',
      featureCardTitle: 'New resources shape the library every day.',
      featureCardDescription: 'Recent additions and curated finds stay at the center of the experience.',
    },
    intro: {
      badge: 'Why this library',
      title: 'Stop searching. Start discovering.',
      paragraphs: [
        'Every resource in the library is hand-picked and organized into collections that make sense. No algorithms, no clutter — just useful links curated by people who use them.',
        'Whether you are looking for design tools, developer references, productivity apps, or marketing resources, the library keeps everything in one clean, browsable surface.',
        'Collections grow over time as curators add new finds. Every resource links directly to the source — no walled gardens, no sign-up walls.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Hand-curated resources organized by collection and category.',
        'Direct links to every resource — no middlemen or sign-up walls.',
        'Growing library updated by curators who use what they recommend.',
        'Clean browsing experience designed for quick discovery.',
      ],
      primaryLink: { label: 'Browse the library', href: '/sbm' },
      secondaryLink: { label: 'About us', href: '/about' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Find your next favorite tool, reference, or resource.',
      description: 'Browse curated collections of resources organized by category, or search for something specific.',
      primaryCta: { label: 'Browse the library', href: '/sbm' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest additions to the library.',
    },
  },
  about: {
    badge: 'About us',
    title: 'A quieter way to discover great resources.',
    description: `${slot4BrandConfig.siteName} is a curated library of bookmarks, tools, and reference links — organized into collections and maintained by people who care about quality.`,
    paragraphs: [
      'Instead of relying on algorithms or trending lists, the library is built by curators who use the resources they recommend. Every link is verified, categorized, and added because it is genuinely useful.',
      'The goal is simple: help people discover tools, references, and resources they would not find through a typical search engine — and do it through a cleaner, calmer browsing experience.',
    ],
    values: [
      {
        title: 'Quality over quantity',
        description: 'Every resource is hand-picked. The library grows slowly and intentionally, so the signal stays high and the noise stays low.',
      },
      {
        title: 'Open and direct',
        description: 'Every resource links directly to the source. No walled gardens, no mandatory accounts, no friction between you and the thing you came to find.',
      },
      {
        title: 'Built for browsing',
        description: 'Collections, categories, and a clean layout make it easy to explore and discover resources you did not know you needed.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Have a resource to suggest? Want to become a curator?',
    description: 'Tell us about a resource worth adding, suggest a new collection, or reach out about contributing to the library. We read every message.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search resources, tools, collections, and curated links across the library.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find resources, tools, and collections faster.',
      description: 'Use keywords, categories, and content types to discover resources from every collection in the library.',
      placeholder: 'Search by keyword, tool name, category, or collection',
    },
    resultsTitle: 'Latest resources',
  },
  create: {
    metadata: {
      title: 'Submit a resource',
      description: 'Submit a new resource, tool, or reference link to the library.',
    },
    locked: {
      badge: 'Curator access',
      title: 'Login to submit resources.',
      description: 'Use your curator account to submit new resources, tools, and links to the library.',
    },
    hero: {
      badge: 'Curator workspace',
      title: 'Submit a resource to the library.',
      description: 'Choose the content type, add details, and submit a new resource with links, summary, and description.',
    },
    formTitle: 'Resource details',
    submitLabel: 'Submit resource',
    successTitle: 'Resource submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login to your curator account.',
      badge: 'Curator access',
      title: 'Welcome back, curator.',
      description: 'Login to continue submitting resources, managing collections, and curating the library.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create a curator account.',
      badge: 'Become a curator',
      title: 'Create your curator account.',
      description: 'Join the library as a curator. Submit resources, organize collections, and help others discover great tools.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'More from this curator',
      fallbackDescription: 'Curator details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
