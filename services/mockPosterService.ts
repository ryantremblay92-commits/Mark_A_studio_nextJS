/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  LogoPlacement,
  LogoSize,
  BrandContext,
  AspectRatio,
  PosterStyle,
  PosterData
} from '../types';

// Mock poster templates with excellent designs
const POSTER_TEMPLATES = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Sleek, futuristic design with gradient backgrounds',
    getImage: (params: {headline: string; subheadline: string; brandName: string; aspectRatio: AspectRatio}) => {
      const {headline, subheadline, brandName, aspectRatio} = params;
  const width = aspectRatio === AspectRatio.SQUARE ? 1200 : aspectRatio === AspectRatio.BANNER ? 1600 : 800;
  const height = aspectRatio === AspectRatio.SQUARE ? 1200 : aspectRatio === AspectRatio.BANNER ? 900 : 1600;

      return `data:image/svg+xml;base64,${btoa(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#gradient)" />

          <rect x="50" y="50" width="${width-100}" height="${height-100}" rx="20" fill="rgba(0,0,0,0.7)" />

          <text x="${width/2}" y="${height/2 - 50}" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">
            ${headline}
          </text>

          <text x="${width/2}" y="${height/2 + 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.9">
            ${subheadline}
          </text>

          <text x="${width/2}" y="${height - 80}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="white" opacity="0.8">
            ${brandName}
          </text>

          <rect x="50" y="${height - 120}" width="100" height="40" rx="8" fill="white" opacity="0.2" />
          <text x="100" y="${height - 100}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white">
            LEARN MORE
          </text>
        </svg>
      `)}`;
    }
  },
  {
    id: 'minimalist-elegance',
    name: 'Minimalist Elegance',
    description: 'Clean, sophisticated design with ample white space',
    getImage: (params: {headline: string; subheadline: string; brandName: string; aspectRatio: AspectRatio}) => {
      const {headline, subheadline, brandName, aspectRatio} = params;
  const width = aspectRatio === AspectRatio.SQUARE ? 1200 : aspectRatio === AspectRatio.BANNER ? 1600 : 800;
  const height = aspectRatio === AspectRatio.SQUARE ? 1200 : aspectRatio === AspectRatio.BANNER ? 900 : 1600;

      return `data:image/svg+xml;base64,${btoa(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#F8FAFC" />

          <rect x="100" y="100" width="${width-200}" height="${height-200}" fill="white" stroke="#E2E8F0" stroke-width="2" />

          <text x="${width/2}" y="${height/2 - 80}" text-anchor="middle" font-family="Helvetica, sans-serif" font-size="42" font-weight="600" fill="#1E293B">
            ${headline}
          </text>

          <text x="${width/2}" y="${height/2 + 20}" text-anchor="middle" font-family="Helvetica, sans-serif" font-size="20" fill="#64748B">
            ${subheadline}
          </text>

          <line x1="100" y1="${height - 150}" x2="${width-100}" y2="${height - 150}" stroke="#E2E8F0" stroke-width="1" />

          <text x="${width/2}" y="${height - 120}" text-anchor="middle" font-family="Helvetica, sans-serif" font-size="16" fill="#64748B">
            ${brandName}
          </text>

          <circle cx="${width - 150}" cy="${height - 120}" r="12" fill="#4F46E5" />
        </svg>
      `)}`;
    }
  },
  {
    id: 'vibrant-creative',
    name: 'Vibrant Creative',
    description: 'Bold colors and dynamic layouts for creative brands',
    getImage: (params: {headline: string; subheadline: string; brandName: string; aspectRatio: AspectRatio}) => {
      const {headline, subheadline, brandName, aspectRatio} = params;
  const width = aspectRatio === AspectRatio.SQUARE ? 1200 : aspectRatio === AspectRatio.BANNER ? 1600 : 800;
  const height = aspectRatio === AspectRatio.SQUARE ? 1200 : aspectRatio === AspectRatio.BANNER ? 900 : 1600;

      return `data:image/svg+xml;base64,${btoa(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${width}" height="${height}" fill="#FEF3C7" />

          <polygon points="${width/2},50 ${width-50},${height/2} ${width/2},${height-50} 50,${height/2}" fill="#F59E0B" opacity="0.8" />

          <text x="${width/2}" y="${height/2 - 60}" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="#1E293B">
            ${headline}
          </text>

          <text x="${width/2}" y="${height/2 + 30}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#1E293B" opacity="0.8">
            ${subheadline}
          </text>

          <rect x="${width/2 - 120}" y="${height - 100}" width="240" height="50" rx="25" fill="#1E293B" />
          <text x="${width/2}" y="${height - 75}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="white">
            ${brandName}
          </text>
        </svg>
      `)}`;
    }
  }
];

/**
 * Generate a mock poster image based on the given parameters
 */
export const generateMockPosterImage = async (
  prompt: string,
  logoPlacement: LogoPlacement,
  logoSize: LogoSize,
  fontSize: number,
  brandContext: BrandContext,
  ratio: AspectRatio,
  style?: PosterStyle
): Promise<string> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Select template based on style or use default
  const template = style ? POSTER_TEMPLATES.find(t => t.id === style.id) || POSTER_TEMPLATES[0] : POSTER_TEMPLATES[0];

  // Extract key information from prompt for poster content
  const headlineMatch = prompt.match(/headline:?\s*(.+?)(?=\s*subheadline|$)/i);
  const subheadlineMatch = prompt.match(/subheadline:?\s*(.+)/i);

  const headline = headlineMatch ? headlineMatch[1].trim() : "Innovative Solutions";
  const subheadline = subheadlineMatch ? subheadlineMatch[1].trim() : "Transforming Your Business";
  const brandName = (brandContext as any).brandName || "Your Brand";

  // Generate the poster image using the selected template
  return template.getImage({
    headline,
    subheadline,
    brandName,
    aspectRatio: ratio
  });
};

/**
 * Get available poster styles for the mock service
 */
export const getAvailablePosterStyles = (): PosterStyle[] => {
  return POSTER_TEMPLATES.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    promptModifier: `Create a ${template.name} style poster with ${template.description}`,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    previewImage: template.getImage({
      headline: "Sample Poster",
      subheadline: "Beautiful Design",
      brandName: "Demo Brand",
      aspectRatio: AspectRatio.SQUARE
    })
  }));
};
