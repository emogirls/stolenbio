#!/usr/bin/env node

// Simple environment variable checker for local development
console.log('🔍 Checking environment variables...\n');

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const optionalVars = [
  'VITE_SUPABASE_PROJECT_ID'
];

let hasAllRequired = true;

console.log('📋 Required variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    hasAllRequired = false;
  }
});

console.log('\n📋 Optional variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: Not set (will be auto-extracted from URL)`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasAllRequired) {
  console.log('🎉 All required environment variables are set!');
  console.log('🚀 You can run "npm run dev" to start the development server.');
} else {
  console.log('❌ Missing required environment variables.');
  console.log('📖 Please check the .env.example file and create .env.local');
  console.log('📚 See README.md for detailed setup instructions.');
  process.exit(1);
}

console.log('\n💡 Tip: Make sure your .env.local file is in the project root.');
console.log('💡 Tip: Environment variables starting with VITE_ are accessible in the browser.');
console.log('\n' + '='.repeat(50));