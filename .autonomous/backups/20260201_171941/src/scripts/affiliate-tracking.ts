/**
 * Affiliate Link Tracking Script
 *
 * Automatically adds gtag event tracking to all affiliate links across the site.
 * This script runs after page load and enhances all external links with proper tracking.
 *
 * FEATURES:
 * - Auto-detects affiliate links by domain patterns
 * - Tracks clicks with tool name, location, and page context
 * - Distinguishes between affiliate and direct links
 * - Respects privacy (no PII collected)
 *
 * INSTALLATION:
 * This script is included in Layout.astro and runs automatically.
 */

interface AffiliateLinkData {
  toolName: string;
  isAffiliate: boolean;
  location: string;
  pagePath: string;
  pageTitle: string;
}

/**
 * Detect if a URL is an affiliate link based on known domains
 */
function isAffiliateUrl(url: string): boolean {
  const affiliateDomains = [
    '10web.io',
    'framer.com',
    'durable.co',
    'webflow.com',
    'wix.com',
    'squarespace.com',
    'hostinger.com',
    'relume.io',
    'dorik.com',
    'bookmark.com',
    'teleporthq.io',
    'b12.io',
    'mixo.io',
    'pineapplebuilder.com',
    'codewp.ai',
    'unicornplatform.com',
    'codedesign.ai',
    'godaddy.com',
    'ionos.com',
    'jimdo.com',
    'site123.com',
    'namecheap.com',
    'web.com',
    'strikingly.com',
    'zyro.com',
    'wordpress.com', // for 10Web
  ];

  try {
    const urlObj = new URL(url);
    return affiliateDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Extract tool name from URL
 */
function extractToolName(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Map hostnames to tool names
    const toolMapping: Record<string, string> = {
      '10web.io': '10Web',
      'framer.com': 'Framer',
      'durable.co': 'Durable',
      'webflow.com': 'Webflow',
      'wix.com': 'Wix',
      'squarespace.com': 'Squarespace',
      'hostinger.com': 'Hostinger',
      'relume.io': 'Relume',
      'dorik.com': 'Dorik',
      'bookmark.com': 'Bookmark',
      'teleporthq.io': 'TeleportHQ',
      'b12.io': 'B12',
      'mixo.io': 'Mixo',
      'pineapplebuilder.com': 'Pineapple Builder',
      'codewp.ai': 'CodeWP',
      'unicornplatform.com': 'Unicorn Platform',
      'codedesign.ai': 'CodeDesign.ai',
      'godaddy.com': 'GoDaddy',
      'ionos.com': 'IONOS',
      'jimdo.com': 'Jimdo',
      'site123.com': 'Site123',
      'namecheap.com': 'Namecheap',
      'web.com': 'web.com',
      'strikingly.com': 'Strikingly',
      'zyro.com': 'Zyro',
    };

    for (const [domain, toolName] of Object.entries(toolMapping)) {
      if (hostname.includes(domain)) {
        return toolName;
      }
    }

    return 'Unknown';
  } catch {
    return 'Unknown';
  }
}

/**
 * Get link location context (where the link appears on page)
 */
function getLinkLocation(element: HTMLElement): string {
  // Check for data-location attribute first
  if (element.hasAttribute('data-location')) {
    return element.getAttribute('data-location') || 'unknown';
  }

  // Check parent elements for context
  const parent = element.closest('section, div, article');
  if (parent) {
    const classList = parent.className;
    if (classList.includes('hero')) return 'hero';
    if (classList.includes('cta')) return 'cta-section';
    if (classList.includes('sidebar')) return 'sidebar';
    if (classList.includes('footer')) return 'footer';
    if (classList.includes('comparison')) return 'comparison';
    if (classList.includes('testimonial')) return 'testimonial';
  }

  return 'body';
}

/**
 * Track affiliate link click with gtag
 */
function trackAffiliateClick(url: string, element: HTMLElement): void {
  if (typeof gtag === 'undefined') {
    console.log('[Affiliate Tracking] gtag not available, skipping tracking');
    return;
  }

  const toolName = extractToolName(url);
  const isAffiliate = isAffiliateUrl(url);
  const location = getLinkLocation(element);
  const pagePath = window.location.pathname;
  const pageTitle = document.title;

  const eventData: AffiliateLinkData = {
    toolName,
    isAffiliate,
    location,
    pagePath,
    pageTitle,
  };

  // Track the click event
  gtag('event', 'affiliate_click', {
    tool_name: toolName,
    is_affiliate: isAffiliate,
    location: location,
    page_path: pagePath,
    page_title: pageTitle,
    link_url: url,
    send_to: 'default',
  });

  console.log('[Affiliate Tracking] Click tracked:', eventData);
}

/**
 * Initialize affiliate link tracking
 */
function initAffiliateTracking(): void {
  // Find all links that might be affiliate links
  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Skip same-page links and anchor links
    if (href.startsWith('#') || href.startsWith('/')) return;

    // Check if this is an affiliate link
    if (isAffiliateUrl(href)) {
      // Add click tracking
      link.addEventListener('click', (e) => {
        trackAffiliateClick(href, link as HTMLElement);
      });

      // Mark as affiliate link for debugging
      link.setAttribute('data-affiliate-tracked', 'true');
    }
  });

  console.log(`[Affiliate Tracking] Initialized. Tracked ${document.querySelectorAll('[data-affiliate-tracked]').length} affiliate links.`);
}

/**
 * Track affiliate impressions (links visible on page load)
 */
function trackAffiliateImpressions(): void {
  if (typeof gtag === 'undefined') return;

  const trackedLinks = document.querySelectorAll('[data-affiliate-tracked]');
  const toolsSeen = new Set<string>();

  trackedLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const toolName = extractToolName(href);
    toolsSeen.add(toolName);
  });

  // Track which affiliate tools are shown on this page
  if (toolsSeen.size > 0) {
    gtag('event', 'affiliate_impression', {
      tools: Array.from(toolsSeen),
      page_path: window.location.pathname,
      page_title: document.title,
      tool_count: toolsSeen.size,
      send_to: 'default',
    });
  }
}

// Run on page load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAffiliateTracking();
      trackAffiliateImpressions();
    });
  } else {
    initAffiliateTracking();
    trackAffiliateImpressions();
  }
}

// Re-run after dynamic content changes (for SPAs)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    initAffiliateTracking();
    trackAffiliateImpressions();
  }
}).observe(document.body, { childList: true, subtree: true });

export { initAffiliateTracking, trackAffiliateClick, isAffiliateUrl, extractToolName };
