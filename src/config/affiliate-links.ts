/**
 * Affiliate Link Configuration
 *
 * CENTRAL PLACE to manage all affiliate links for AI Website Builders site.
 * When you join affiliate programs, update the affiliateUrl fields with your tracking links.
 *
 * HOW TO JOIN AFFILIATE PROGRAMS (Priority Order by Commission):
 * 1. 10Web: https://10web.io/affiliate-program/ - 70% recurring (HIGHEST PRIORITY!)
 * 2. Webflow: https://university.webflow.com/affiliate-program - 50% recurring (first year)
 * 3. Framer: Check framer.com for program - 30% recurring
 * 4. Durable: https://durable.co/affiliate - 25% recurring
 * 5. Relume: Check relume.io for program - 30% recurring
 *
 * REVENUE PATH: Each signup = $50-200 one-time OR $5-25/month recurring
 * GOAL: Get 25 referrals/month = $2,000/month revenue
 */

export const AFFILIATE_LINKS = {
  /**
   * 10Web AI - WordPress-powered AI website builder
   * Commission: 70% recurring (HIGHEST!)
   * Priority: #1 - Join this first!
   */
  '10web': {
    name: '10Web AI',
    url: 'https://10web.io/ai-website-builder/',
    affiliateUrl: '', // TODO: Replace with your affiliate link after joining
    commission: '70%',
    recurring: 'recurring',
    freeTrial: true,
    ctaText: 'Try 10Web Free',
    programUrl: 'https://10web.io/affiliate-program/'
  },

  /**
   * Framer AI - Design-focused website builder
   * Commission: 30% recurring
   * Priority: #3
   */
  framer: {
    name: 'Framer AI',
    url: 'https://framer.com/website-builder',
    affiliateUrl: '', // TODO: Replace with your affiliate link after joining
    commission: '30%',
    recurring: 'recurring',
    freeTrial: true,
    ctaText: 'Try Framer Free',
    programUrl: 'https://framer.com/' // Check for affiliate program
  },

  /**
   * Durable AI - Fast AI website generator
   * Commission: 25% recurring
   * Priority: #4
   */
  durable: {
    name: 'Durable AI',
    url: 'https://durable.co',
    affiliateUrl: '', // TODO: Replace with your affiliate link after joining
    commission: '25%',
    recurring: 'recurring',
    freeTrial: true,
    ctaText: 'Build Your Site in 30 Seconds',
    programUrl: 'https://durable.co/affiliate'
  },

  /**
   * Relume AI - Sitemap and wireframe planning tool
   * Commission: 30% recurring
   * Priority: #5
   */
  relume: {
    name: 'Relume AI',
    url: 'https://relume.io',
    affiliateUrl: '', // TODO: Replace with your affiliate link after joining
    commission: '30%',
    recurring: 'recurring',
    freeTrial: true,
    ctaText: 'Start Wireframing Free',
    programUrl: 'https://relume.io' // Check for affiliate program
  },

  /**
   * Webflow - Design-focused CMS
   * Commission: 50% recurring (first year)
   * Priority: #2
   */
  webflow: {
    name: 'Webflow',
    url: 'https://webflow.com',
    affiliateUrl: '', // TODO: Replace with your affiliate link after joining
    commission: '50%',
    recurring: '12 months',
    freeTrial: true,
    ctaText: 'Start Free with Webflow',
    programUrl: 'https://university.webflow.com/affiliate-program'
  },

  /**
   * Wix AI - Popular website builder with ADI
   * Commission: Varies (typically $50-100 per signup)
   * Priority: HIGH - Volume opportunity
   */
  wix: {
    name: 'Wix AI',
    url: 'https://wix.com/ai-website-builder',
    affiliateUrl: '', // TODO: Replace with your affiliate link after joining
    commission: '$50-100',
    recurring: 'one-time',
    freeTrial: true,
    ctaText: 'Try Wix Free',
    programUrl: 'https://www.wix.com/affiliate-program'
  },

  /**
   * Squarespace AI - Design-focused builder
   * Commission: Varies (typically $100-200 per signup)
   * Priority: HIGH - Brand recognition
   */
  squarespace: {
    name: 'Squarespace AI',
    url: 'https://squarespace.com/websites/ai-website-builder',
    affiliateUrl: '', // TODO: Replace with your affiliate link after joining
    commission: '$100-200',
    recurring: 'one-time',
    freeTrial: true,
    ctaText: 'Try Squarespace Free',
    programUrl: 'https://www.squarespace.com/affiliate-program'
  },

  /**
   * Hostinger AI - Budget hosting with AI builder
   * Commission: 60% recurring
   * Priority: MEDIUM - Budget seekers
   */
  hostinger: {
    name: 'Hostinger AI',
    url: 'https://hostinger.com/ai-website-builder',
    affiliateUrl: '', // TODO: Replace with your affiliate link after joining
    commission: '60%',
    recurring: 'recurring',
    freeTrial: false,
    ctaText: 'Start at $2.99/month',
    programUrl: 'https://www.hostinger.com/affiliate-program'
  },

  /**
   * Dorik AI - Emerging AI builder
   * Commission: 30% recurring
   * Priority: MEDIUM - Competitor coverage
   */
  dorik: {
    name: 'Dorik AI',
    url: 'https://dorik.com',
    affiliateUrl: '', // TODO: Replace with your affiliate link after joining
    commission: '30%',
    recurring: 'recurring',
    freeTrial: true,
    ctaText: 'Try Dorik Free',
    programUrl: 'https://dorik.com/affiliate-program'
  },

  /**
   * Bookmark AI - AI-powered landing page builder
   * Commission: Varies (check site)
   * Priority: LOW - Emerging tool
   */
  bookmark: {
    name: 'Bookmark AI',
    url: 'https://bookmark.com',
    affiliateUrl: '',
    commission: 'TBD',
    recurring: 'unknown',
    freeTrial: true,
    ctaText: 'Try Bookmark AI',
    programUrl: 'https://bookmark.com'
  },

  /**
   * TeleportHQ - AI design to code
   * Commission: Varies (check site)
   * Priority: LOW - Developer-focused
   */
  teleporthq: {
    name: 'TeleportHQ',
    url: 'https://teleporthq.io',
    affiliateUrl: '',
    commission: 'TBD',
    recurring: 'unknown',
    freeTrial: true,
    ctaText: 'Try TeleportHQ',
    programUrl: 'https://teleporthq.io'
  },

  /**
   * Durable AI - (duplicate entry, kept for reference)
   * Already defined above
   */

  /**
   * B12 AI - AI website builder for service businesses
   * Commission: Varies (check site)
   * Priority: LOW - Service business niche
   */
  b12: {
    name: 'B12 AI',
    url: 'https://b12.io',
    affiliateUrl: '',
    commission: 'TBD',
    recurring: 'unknown',
    freeTrial: true,
    ctaText: 'Try B12 AI',
    programUrl: 'https://b12.io'
  },

  /**
   * Mixo AI - Quick landing page generator
   * Commission: Varies (check site)
   * Priority: LOW - Landing page niche
   */
  mixo: {
    name: 'Mixo AI',
    url: 'https://mixo.io',
    affiliateUrl: '',
    commission: 'TBD',
    recurring: 'unknown',
    freeTrial: true,
    ctaText: 'Try Mixo AI',
    programUrl: 'https://mixo.io'
  },

  /**
   * Pineapple Builder - AI builder for small businesses
   * Commission: Varies (check site)
   * Priority: LOW - Emerging tool
   */
  pineapple: {
    name: 'Pineapple Builder',
    url: 'https://pineapplebuilder.com',
    affiliateUrl: '',
    commission: 'TBD',
    recurring: 'unknown',
    freeTrial: true,
    ctaText: 'Try Pineapple',
    programUrl: 'https://pineapplebuilder.com'
  },

  /**
   * CodeWP - AI WordPress builder
   * Commission: Varies (check site)
   * Priority: LOW - WordPress niche
   */
  codewp: {
    name: 'CodeWP',
    url: 'https://codewp.ai',
    affiliateUrl: '',
    commission: 'TBD',
    recurring: 'unknown',
    freeTrial: true,
    ctaText: 'Try CodeWP',
    programUrl: 'https://codewp.ai'
  },

  /**
   * Unicorn Platform - AI landing page builder
   * Commission: Varies (check site)
   * Priority: LOW - Landing page niche
   */
  unicorn: {
    name: 'Unicorn Platform',
    url: 'https://unicornplatform.com',
    affiliateUrl: '',
    commission: 'TBD',
    recurring: 'unknown',
    freeTrial: true,
    ctaText: 'Try Unicorn Platform',
    programUrl: 'https://unicornplatform.com'
  }
} as const;

export type AffiliateTool = keyof typeof AFFILIATE_LINKS;

/**
 * Get the URL for a tool (returns affiliate URL if set, otherwise direct URL)
 * This is the MAIN function to use throughout the site
 */
export function getAffiliateLink(tool: AffiliateTool): string {
  const config = AFFILIATE_LINKS[tool];
  // Return affiliateUrl if set, otherwise fall back to direct URL
  return config.affiliateUrl || config.url;
}

/**
 * Get direct (non-affiliate) URL for a tool
 * Use this when you need to link without tracking
 */
export function getDirectLink(tool: AffiliateTool): string {
  return AFFILIATE_LINKS[tool].url;
}

/**
 * Check if we have an active affiliate link for a tool
 */
export function hasAffiliateLink(tool: AffiliateTool): boolean {
  return AFFILIATE_LINKS[tool].affiliateUrl.length > 0;
}

/**
 * Get commission info for display
 */
export function getCommissionInfo(tool: AffiliateTool): { rate: string; recurring: string } {
  const link = AFFILIATE_LINKS[tool];
  return {
    rate: link.commission,
    recurring: link.recurring
  };
}

/**
 * Get CTA data for AffiliateCTA component
 * Returns object with href, commission, and fallback values
 */
export function getAffiliateCTA(tool: AffiliateTool) {
  const config = AFFILIATE_LINKS[tool];
  return {
    href: config.affiliateUrl || config.url,
    commission: config.commission,
    hasAffiliate: config.affiliateUrl.length > 0,
    ctaText: config.ctaText
  };
}

/**
 * Check if we have an active affiliate relationship for CTA display
 */
export function hasAffiliateCTA(tool: AffiliateTool): boolean {
  return AFFILIATE_LINKS[tool].affiliateUrl.length > 0;
}

/**
 * Get all affiliate program URLs for easy access
 */
export function getAllProgramUrls(): Record<AffiliateTool, string> {
  return {
    '10web': AFFILIATE_LINKS['10web'].programUrl,
    framer: AFFILIATE_LINKS.framer.programUrl,
    durable: AFFILIATE_LINKS.durable.programUrl,
    relume: AFFILIATE_LINKS.relume.programUrl,
    webflow: AFFILIATE_LINKS.webflow.programUrl
  };
}

/**
 * Get affiliate status dashboard (shows which programs have been joined)
 */
export function getAffiliateStatus() {
  return Object.entries(AFFILIATE_LINKS).map(([key, data]) => ({
    key,
    name: data.name,
    hasAffiliate: data.affiliateUrl.length > 0,
    commission: data.commission,
    programUrl: data.programUrl
  }));
}
