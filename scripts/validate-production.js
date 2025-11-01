#!/usr/bin/env node

// Production validation script
const { validateProductionConfig, getProductionPricingSummary, validatePricingConfiguration } = require('../lib/validate-production-config');

console.log('🔍 VALIDATING STRUCTURECLERK PRODUCTION CONFIGURATION\n');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Validate configuration
const validation = validateProductionConfig();
const pricingValidation = validatePricingConfiguration();

console.log('📊 CONFIGURATION VALIDATION RESULTS:\n');

if (validation.success.length > 0) {
  console.log('✅ SUCCESSFUL CONFIGURATIONS:');
  validation.success.forEach(item => console.log(`   ${item}`));
  console.log('');
}

if (validation.warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  validation.warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('');
}

if (validation.errors.length > 0) {
  console.log('❌ ERRORS:');
  validation.errors.forEach(error => console.log(`   ${error}`));
  console.log('');
}

// Display pricing summary
console.log('💰 PRICING CONFIGURATION:');
const pricing = getProductionPricingSummary();

console.log('\n📋 PLANS:');
Object.entries(pricing.plans).forEach(([plan, details]) => {
  console.log(`\n   ${plan.toUpperCase()}:`);
  console.log(`   💵 Price: ${details.price}${details.period ? `/${details.period}` : ''}`);
  if (details.annualPrice) console.log(`   📅 Annual: ${details.annualPrice} (${details.savings})`);
  if (details.documents !== 'Unlimited') console.log(`   📄 Documents: ${details.documents}/month`);
  if (details.audioMinutes !== 'Unlimited') console.log(`   🎙️  Audio: ${details.audioMinutes} minutes`);
  if (details.storageGB !== 'Unlimited') console.log(`   💾 Storage: ${details.storageGB} GB`);
  console.log(`   ⭐ Features: ${details.features.slice(0, 3).join(', ')}${details.features.length > 3 ? '...' : ''}`);
});

console.log('\n🔧 ADD-ONS:');
Object.entries(pricing.addOns).forEach(([addOn, price]) => {
  console.log(`   • ${addOn}: ${price}`);
});

console.log(`\n💳 Currency: ${pricing.currency}`);
console.log(`🇨🇦 Taxes:`);
Object.entries(pricing.taxes).forEach(([region, tax]) => {
  if (region !== 'Other') console.log(`   ${region}: ${tax}`);
});

// Final validation result
console.log('\n🎯 FINAL VALIDATION RESULT:');
if (validation.isValid && pricingValidation.isValid) {
  console.log('✅ PRODUCTION CONFIGURATION IS VALID! 🚀');
  console.log('\n🎉 StructureClerk is ready for production deployment!');
  console.log('\n📈 Expected Performance:');
  console.log('   • Free plan: 5 docs/month (reduced from 10)');
  console.log('   • Professional: $29/month → $190/year (35% savings)');
  console.log('   • Business: $79/month → $590/year (38% savings)');
  console.log('   • Enterprise: Custom pricing');
  console.log('\n🎯 Target Metrics:');
  console.log('   • Free → Pro conversion: 15-20%');
  console.log('   • Pro → Business conversion: 8-12%');
  console.log('   • User retention: 70%+ (30 days)');
  console.log('   • Average revenue per user: $45-65/month');

  process.exit(0);
} else {
  console.log('❌ PRODUCTION CONFIGURATION HAS ISSUES! 🚨');
  console.log('\n🔧 Required Actions:');

  if (validation.errors.length > 0) {
    console.log('\n❌ Fix these critical errors:');
    validation.errors.forEach(error => console.log(`   • ${error}`));
  }

  if (pricingValidation.errors.length > 0) {
    console.log('\n💰 Fix these pricing issues:');
    pricingValidation.errors.forEach(error => console.log(`   • ${error}`));
  }

  if (validation.warnings.length > 0) {
    console.log('\n⚠️  Review these warnings:');
    validation.warnings.forEach(warning => console.log(`   • ${warning}`));
  }

  console.log('\n📞 Next Steps:');
  console.log('   1. Fix all critical errors above');
  console.log('   2. Review and address warnings');
  console.log('   3. Test payment flow with Stripe test mode');
  console.log('   4. Verify all webhooks are working');
  console.log('   5. Run production validation again');

  process.exit(1);
}