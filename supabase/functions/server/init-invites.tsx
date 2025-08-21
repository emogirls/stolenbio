// This is a utility script to create initial invite codes
// Run this once to set up initial invite codes for testing

import * as kv from './kv_store.tsx';

// Create some initial invite codes for testing
export async function createInitialInvites() {
  const inviteCodes = [
    'WELCOME1',
    'BETA2024',
    'EARLY001',
    'TESTCODE',
    'DEMO123'
  ];

  console.log('Creating initial invite codes...');

  for (const code of inviteCodes) {
    try {
      await kv.set(`invite:${code}`, {
        code: code,
        active: true,
        createdAt: new Date().toISOString(),
        createdBy: 'system'
      });
      console.log(`Created invite code: ${code}`);
    } catch (error) {
      console.error(`Failed to create invite code ${code}:`, error);
    }
  }

  console.log('Initial invite codes setup complete!');
  console.log('Available codes:', inviteCodes.join(', '));
}

// Auto-run when the module is imported
createInitialInvites().catch(console.error);