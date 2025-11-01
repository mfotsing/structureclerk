#!/usr/bin/env node

/**
 * Test Script for StructureClerk Investor Landing Page
 * Validates all components, analytics, and mobile responsiveness
 */

const puppeteer = require('puppeteer');

class InvestorLandingTester {
  constructor() {
    this.url = process.env.TEST_URL || 'http://localhost:3000/investors';
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runTests() {
    console.log('🚀 Starting StructureClerk Investor Landing Page Tests...\n');

    const browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();

      // Set viewport to desktop
      await page.setViewport({ width: 1920, height: 1080 });

      // Enable console logging from the page
      page.on('console', msg => {
        console.log('PAGE LOG:', msg.text());
      });

      // Enable request interception for analytics testing
      await page.setRequestInterception(true);
      page.on('request', request => {
        // Allow all requests
        request.continue();
      });

      // Test 1: Page Load
      await this.testPageLoad(page);

      // Test 2: Hero Section
      await this.testHeroSection(page);

      // Test 3: Metrics Display
      await this.testMetricsSection(page);

      // Test 4: CTA Buttons
      await this.testCTAButtons(page);

      // Test 5: Demo Modal
      await this.testDemoModal(page);

      // Test 6: Pricing Section
      await this.testPricingSection(page);

      // Test 7: Mobile Responsiveness
      await this.testMobileResponsiveness(page);

      // Test 8: Analytics Tracking
      await this.testAnalyticsTracking(page);

      // Test 9: Performance
      await this.testPerformance(page);

      // Test 10: Accessibility
      await this.testAccessibility(page);

    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.results.failed++;
    } finally {
      await browser.close();
      this.printResults();
    }
  }

  async testPageLoad(page) {
    const testName = 'Page Load Test';
    try {
      const startTime = Date.now();
      await page.goto(this.url, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;

      // Check if page loaded successfully
      const title = await page.title();
      const hasContent = await page.$('h1') !== null;

      if (title.includes('StructureClerk') && hasContent && loadTime < 5000) {
        this.addPass(testName, `Page loaded in ${loadTime}ms with title: "${title}"`);
      } else {
        this.addFail(testName, `Page load issues - Title: "${title}", Has content: ${hasContent}, Load time: ${loadTime}ms`);
      }
    } catch (error) {
      this.addFail(testName, `Error loading page: ${error.message}`);
    }
  }

  async testHeroSection(page) {
    const testName = 'Hero Section Test';
    try {
      // Check hero elements
      const heroTitle = await page.$eval('h1', el => el.textContent);
      const heroCTA = await page.$('button');
      const canadianBadge = await page.$('text=🍁');

      if (heroTitle.includes('AI') && heroCTA && canadianBadge) {
        this.addPass(testName, 'Hero section contains all required elements');
      } else {
        this.addFail(testName, 'Missing hero elements');
      }
    } catch (error) {
      this.addFail(testName, `Hero section error: ${error.message}`);
    }
  }

  async testMetricsSection(page) {
    const testName = 'Metrics Section Test';
    try {
      // Scroll to metrics
      await page.evaluate(() => {
        document.querySelector('[data-testid="metrics-section"]')?.scrollIntoView();
      });
      await page.waitForTimeout(1000);

      // Check for key metrics
      const metrics = await page.$$eval('[data-testid="metric-card"]', cards =>
        cards.map(card => card.textContent)
      );

      const hasTAM = metrics.some(m => m.includes('$324M'));
      const hasBusinesses = metrics.some(m => m.includes('2.7M'));

      if (hasTAM && hasBusinesses) {
        this.addPass(testName, 'Metrics section displays key financial metrics');
      } else {
        this.addFail(testName, 'Missing key metrics in section');
      }
    } catch (error) {
      this.addFail(testName, `Metrics section error: ${error.message}`);
    }
  }

  async testCTAButtons(page) {
    const testName = 'CTA Buttons Test';
    try {
      const ctaButtons = await page.$$('button');
      const primaryCTA = await page.$eval('button', btn => btn.textContent);

      if (ctaButtons.length >= 2 && primaryCTA.includes('Investor')) {
        this.addPass(testName, `Found ${ctaButtons.length} CTA buttons with proper text`);
      } else {
        this.addFail(testName, 'Insufficient or incorrect CTA buttons');
      }
    } catch (error) {
      this.addFail(testName, `CTA buttons error: ${error.message}`);
    }
  }

  async testDemoModal(page) {
    const testName = 'Demo Modal Test';
    try {
      // Click demo button
      const demoButton = await page.$('button:has-text("Demo")');
      if (demoButton) {
        await demoButton.click();
        await page.waitForTimeout(500);

        // Check if modal opened
        const modal = await page.$('[role="dialog"]');
        if (modal) {
          this.addPass(testName, 'Demo modal opens successfully');

          // Close modal
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        } else {
          this.addFail(testName, 'Demo modal did not open');
        }
      } else {
        this.addFail(testName, 'Demo button not found');
      }
    } catch (error) {
      this.addFail(testName, `Demo modal error: ${error.message}`);
    }
  }

  async testPricingSection(page) {
    const testName = 'Pricing Section Test';
    try {
      // Scroll to pricing
      await page.evaluate(() => {
        document.querySelector('[data-testid="pricing-section"]')?.scrollIntoView();
      });
      await page.waitForTimeout(1000);

      // Check pricing tiers
      const pricingTiers = await page.$$eval('[data-testid="pricing-tier"]', tiers =>
        tiers.map(tier => tier.textContent)
      );

      const hasProfessional = pricingTiers.some(t => t.includes('Professional'));
      const hasEnterprise = pricingTiers.some(t => t.includes('Enterprise'));

      if (pricingTiers.length >= 3 && hasProfessional && hasEnterprise) {
        this.addPass(testName, 'Pricing section displays all tiers');
      } else {
        this.addFail(testName, 'Missing pricing tiers');
      }
    } catch (error) {
      this.addFail(testName, `Pricing section error: ${error.message}`);
    }
  }

  async testMobileResponsiveness(page) {
    const testName = 'Mobile Responsiveness Test';
    try {
      // Switch to mobile viewport
      await page.setViewport({ width: 375, height: 667 });

      // Check mobile navigation
      const mobileMenu = await page.$('button[aria-label="Open menu"]');
      const mobileLayout = await page.$('.mobile-layout');

      if (mobileMenu || mobileLayout) {
        this.addPass(testName, 'Mobile layout adapts correctly');
      } else {
        this.addFail(testName, 'Mobile layout issues detected');
      }

      // Switch back to desktop
      await page.setViewport({ width: 1920, height: 1080 });
    } catch (error) {
      this.addFail(testName, `Mobile responsiveness error: ${error.message}`);
    }
  }

  async testAnalyticsTracking(page) {
    const testName = 'Analytics Tracking Test';
    try {
      // Listen for network requests to analytics endpoint
      let analyticsRequestFound = false;

      page.on('request', request => {
        if (request.url().includes('/api/analytics/events')) {
          analyticsRequestFound = true;
        }
      });

      // Trigger some events
      await page.click('button');
      await page.waitForTimeout(1000);

      // Wait a bit for analytics to fire
      await page.waitForTimeout(2000);

      if (analyticsRequestFound) {
        this.addPass(testName, 'Analytics events are being tracked');
      } else {
        this.addFail(testName, 'No analytics requests detected');
      }
    } catch (error) {
      this.addFail(testName, `Analytics tracking error: ${error.message}`);
    }
  }

  async testPerformance(page) {
    const testName = 'Performance Test';
    try {
      const metrics = await page.metrics();

      const {
        LayoutShift,
        FirstContentfulPaint,
        LargestContentfulPaint
      } = metrics;

      // Check Core Web Vitals
      const clsGood = LayoutShift < 0.1;
      const fcpGood = FirstContentfulPaint < 2000;
      const lcpGood = LargestContentfulPaint < 2500;

      if (clsGood && fcpGood && lcpGood) {
        this.addPass(testName, 'Performance metrics meet Web Vitals standards');
      } else {
        this.addFail(testName, `Performance issues - CLS: ${LayoutShift}, FCP: ${FirstContentfulPaint}, LCP: ${LargestContentfulPaint}`);
      }
    } catch (error) {
      this.addFail(testName, `Performance test error: ${error.message}`);
    }
  }

  async testAccessibility(page) {
    const testName = 'Accessibility Test';
    try {
      // Check for proper heading structure
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', headings =>
        headings.map(h => ({ tag: h.tagName, text: h.textContent }))
      );

      const hasH1 = headings.some(h => h.tag === 'H1');
      const properOrder = headings.every((h, i) => {
        if (i === 0) return h.tag === 'H1';
        const prevLevel = parseInt(headings[i-1].tag[1]);
        const currLevel = parseInt(h.tag[1]);
        return currLevel <= prevLevel + 1;
      });

      // Check for alt text on images
      const imagesWithoutAlt = await page.$$eval('img:not([alt])', imgs => imgs.length);

      if (hasH1 && properOrder && imagesWithoutAlt === 0) {
        this.addPass(testName, 'Accessibility standards met');
      } else {
        this.addFail(testName, `Accessibility issues - H1: ${hasH1}, Proper heading order: ${properOrder}, Images without alt: ${imagesWithoutAlt}`);
      }
    } catch (error) {
      this.addFail(testName, `Accessibility test error: ${error.message}`);
    }
  }

  addPass(testName, message) {
    this.results.passed++;
    this.results.tests.push({ name: testName, status: 'PASS', message });
    console.log(`✅ ${testName}: ${message}`);
  }

  addFail(testName, message) {
    this.results.failed++;
    this.results.tests.push({ name: testName, status: 'FAIL', message });
    console.log(`❌ ${testName}: ${message}`);
  }

  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => console.log(`  - ${test.name}: ${test.message}`));
    }

    console.log('\n🚀 StructureClerk Investor Landing Page Testing Complete!');

    if (this.results.failed === 0) {
      console.log('🎉 All tests passed! The landing page is ready for investors.');
    } else {
      console.log('⚠️  Some tests failed. Please review and fix issues before investor presentation.');
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new InvestorLandingTester();
  tester.runTests().catch(console.error);
}

module.exports = InvestorLandingTester;