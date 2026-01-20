/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Client } from '../types';

const DEMO_STORAGE_KEY = 'markAStudioDemoPreferences';

/**
 * Demo Service for managing the "Mark A Studio" demo client
 */
export class DemoService {
  /**
   * Load demo client data from API
   */
  static async loadDemoClient(): Promise<Client> {
    try {
      const response = await fetch('/api/demo/client');
      const data = await response.json();

      if (data.success) {
        // Store demo preference in localStorage
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({
          isDemoMode: true,
          lastUsed: new Date().toISOString()
        }));
        return data.client;
      } else {
        throw new Error(data.error || 'Failed to load demo client');
      }
    } catch (error) {
      console.error('Failed to load demo client:', error);
      throw error;
    }
  }

  /**
   * Check if demo mode was previously used
   */
  static isDemoModeActive(): boolean {
    try {
      const demoPrefs = localStorage.getItem(DEMO_STORAGE_KEY);
      if (demoPrefs) {
        const parsed = JSON.parse(demoPrefs);
        return parsed.isDemoMode === true;
      }
      return false;
    } catch (error) {
      console.error('Error checking demo mode:', error);
      return false;
    }
  }

  /**
   * Clear demo mode and preferences
   */
  static clearDemoMode(): void {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing demo mode:', error);
    }
  }

  /**
   * Update demo client data
   */
  static async updateDemoClient(clientData: Partial<Client>): Promise<Client> {
    try {
      const response = await fetch('/api/demo/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientData }),
      });

      const data = await response.json();

      if (data.success) {
        return data.client;
      } else {
        throw new Error(data.error || 'Failed to update demo client');
      }
    } catch (error) {
      console.error('Failed to update demo client:', error);
      throw error;
    }
  }

  /**
   * Get demo client introduction message
   */
  static getDemoIntroduction(): string {
    return `
      Welcome to Mark A Studio Demo Mode!

      This demo showcases the key features of our marketing platform using
      a sample client. Explore the following features:

      • Strategy Generation - AI-powered marketing strategies
      • Studio Posters - Create professional poster designs
      • Campaign Planning - Develop marketing campaigns
      • Client Management - CRM functionality

      All data in demo mode is simulated and can be modified to test
      different scenarios. Enjoy exploring!
    `.trim();
  }
}
