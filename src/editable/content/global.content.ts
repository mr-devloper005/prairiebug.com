import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const uiHiddenTaskKeys = ['profile'] as const
export const isUiHiddenTask = (key: string) => (uiHiddenTaskKeys as readonly string[]).includes(key)

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Curated resources and collections',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Curated resources and collections',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse the library', href: '/sbm' },
      secondary: { label: 'Contact', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Curated resources and collections',
    description: 'A discovery platform for curated bookmarks, collections, and resources worth saving. Browse trusted tools, references, and links organized by collection.',
    columns: [
      {
        title: 'Collections',
        links: [
          { label: 'All resources', href: '/sbm' },
          { label: 'Design tools', href: '/sbm?category=design' },
          { label: 'Developer', href: '/sbm?category=developer' },
          { label: 'Productivity', href: '/sbm?category=productivity' },
          { label: 'Marketing', href: '/sbm?category=marketing' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for clean discovery and connected publishing.',
  },
  commonLabels: {
    readMore: 'View resource',
    viewAll: 'View all',
    explore: 'Browse',
    latest: 'Latest',
    related: 'Related',
    published: 'Added',
  },
} as const
