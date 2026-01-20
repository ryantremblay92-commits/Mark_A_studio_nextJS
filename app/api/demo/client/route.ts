/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { NextResponse } from 'next/server';
import { Client } from '../../../../types';

// Mock demo client data for "Mark A Studio"
const DEMO_CLIENT: Client = {
  id: 'demo-mark-a-studio',
  agencyId: 'demo-agency',
  name: 'Mark A Studio',
  industry: 'Digital Marketing & Branding',
  website: 'https://markastudio.com',
  primaryObjective: 'Increase brand awareness and generate qualified leads',
  monthlyBudget: '$7,500',
  brandVoice: 'Professional yet approachable, innovative and results-driven',
  painPoints: [
    'Low brand recognition in competitive market',
    'Inconsistent lead flow and conversion rates',
    'Difficulty measuring ROI on marketing campaigns',
    'Need for more targeted content strategy'
  ],
  logo: {
    file: new File([''], 'mark-a-studio-logo.png', { type: 'image/png' }),
    base64: '' // Would contain base64 logo data in real implementation
  },
  phoneNumber: '(555) 123-4567'
};

/**
 * GET /api/demo/client
 * Returns the demo client data for "Mark A Studio"
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      client: DEMO_CLIENT,
      message: 'Demo client data loaded successfully'
    });
  } catch (error) {
    console.error('Demo client error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load demo client' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/demo/client
 * Creates or updates demo client data
 */
export async function POST(request: Request) {
  try {
    const { clientData } = await request.json();

    // In a real implementation, this would save to a database
    // For demo purposes, we'll just return the updated data
    const updatedClient = { ...DEMO_CLIENT, ...clientData };

    return NextResponse.json({
      success: true,
      client: updatedClient,
      message: 'Demo client updated successfully'
    });
  } catch (error) {
    console.error('Update demo client error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update demo client' },
      { status: 500 }
    );
  }
}
