/**
 * Configuration for query parsing patterns and category terms
 */

/**
 * Regular expression patterns for price extraction
 */
export const PRICE_PATTERNS = {
  // Match "between X and Y" and "between X-Y" formats
  RANGE: [
    /between\s+\$?(\d+)(?:\.(\d+))?\$?\s+(?:and|to|-)\s+\$?(\d+)(?:\.(\d+))?\$?/i,
    /between\s+\$?(\d+)(?:\.(\d+))?\$?-\$?(\d+)(?:\.(\d+))?\$?/i,
  ],
  // Match "under X", "less than X", etc.
  UNDER: /(?:under|less than|below|cheaper than)\s+\$?(\d+)(?:\.(\d+))?\$?/i,
  // Match "over X", "above X", etc.
  OVER: /(?:over|above|more than|higher than)\s+\$?(\d+)(?:\.(\d+))?\$?/i,
  // Match exact price with "dollars"
  EXACT: /\$?(\d+)(?:\.(\d+))?\$?\s+dollars/i,
} as const;

/**
 * Regular expression patterns for search term extraction
 */
export const SEARCH_PATTERNS = {
  // Main search pattern for extracting terms
  SEARCH_TERMS:
    /(?:find|search|looking for|show me|do you have|suggest|get|want|give me|send me)\s+(?:some|good|best)?\s+(.*?)(?:\s+(?:for|in\s+range\s+of|around|about)\s+(\d+)(?:\.(\d+))?\s+dollars)?/i,

  // Pre/post workout patterns
  PRE_WORKOUT: /pre.?workout|pre workout|preworkout/i,
  POST_WORKOUT: /post.?workout|post workout|postworkout/i,

  // Product keywords pattern
  PRODUCT_KEYWORDS:
    /weight loss|fat loss|vitamin|protein|creatine|pre.?workout|pre workout|preworkout|post.?workout|post workout|postworkout|supplement|bcaa|omega|fish oil|amino|collagen/gi,

  // Simple product match
  SIMPLE_PRODUCT:
    /\b(weight loss|fat loss|vitamin|protein|creatine|pre.?workout|post.?workout|supplement|bcaa|omega|fish oil|amino|collagen)s?\b/i,
} as const;

/**
 * Category terms for matching
 */
export const CATEGORY_TERMS = [
  "weight",
  "loss",
  "fat",
  "burn",
  "diet",
  "vitamin",
  "protein",
  "creatine",
  "pre",
  "post",
  "workout",
  "supplement",
  "bcaa",
  "omega",
  "fish oil",
  "amino",
  "collagen",
] as const;

/**
 * Product query detection pattern
 */
export const PRODUCT_QUERY_PATTERN =
  /product|supplement|protein|creatine|pre.?workout|vitamin|nutrition|bcaa|omega|fish oil|amino|collagen|weight\s+loss|fat\s+loss|fat\s+burn|diet|slimming|thermogenic|under|less than|over|above|more than|higher than|between|\$|show me|give me|looking for|do you have|can i get|recommend|suggest/i;

/**
 * Default fallback search terms
 */
export const FALLBACK_TERMS = {
  DEFAULT_SUPPLEMENT: "supplement",
  GENERIC_PRODUCT: "supplement",
} as const;
