interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp: number;
}

interface UserMetrics {
  userId: string;
  plan: string;
  documentsProcessed: number;
  audioMinutesUsed: number;
  storageUsed: number;
  lastActiveAt: number;
  signupDate: number;
  sessionCount: number;
  featuresUsed: string[];
  conversionEvents: {
    trialStarted?: number;
    trialEnded?: number;
    planUpgraded?: number;
    planDowngraded?: number;
    subscriptionCancelled?: number;
  };
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private metrics: Map<string, UserMetrics> = new Map();

  // Track user actions
  track(event: string, userId?: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      userId,
      properties,
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);
    this.updateUserMetrics(userId, event, properties);

    // In production, send to analytics service
    if (typeof window !== 'undefined') {
      this.sendToAnalytics(analyticsEvent);
    }
  }

  // Track page views
  pageView(path: string, userId?: string) {
    this.track('page_view', userId, { path });
  }

  // Track feature usage
  trackFeature(feature: string, userId?: string, properties?: Record<string, any>) {
    this.track('feature_used', userId, { feature, ...properties });
  }

  // Track conversion events
  trackConversion(event: string, userId: string, properties?: Record<string, any>) {
    this.track('conversion', userId, { conversion_event: event, ...properties });
  }

  // Track errors
  trackError(error: Error, userId?: string, context?: Record<string, any>) {
    this.track('error', userId, {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, userId?: string) {
    this.track('performance', userId, { metric, value });
  }

  // Update user metrics
  private updateUserMetrics(userId: string | undefined, event: string, properties?: Record<string, any>) {
    if (!userId) return;

    let metrics = this.metrics.get(userId);

    if (!metrics) {
      metrics = {
        userId,
        plan: 'free',
        documentsProcessed: 0,
        audioMinutesUsed: 0,
        storageUsed: 0,
        lastActiveAt: Date.now(),
        signupDate: Date.now(),
        sessionCount: 1,
        featuresUsed: [],
        conversionEvents: {}
      };
      this.metrics.set(userId, metrics);
    }

    metrics.lastActiveAt = Date.now();

    // Update metrics based on event
    switch (event) {
      case 'document_uploaded':
        metrics.documentsProcessed++;
        break;
      case 'audio_processed':
        metrics.audioMinutesUsed += properties?.duration || 0;
        break;
      case 'feature_used':
        if (properties?.feature && !metrics.featuresUsed.includes(properties.feature)) {
          metrics.featuresUsed.push(properties.feature);
        }
        break;
      case 'session_start':
        metrics.sessionCount++;
        break;
      case 'trial_started':
        metrics.conversionEvents.trialStarted = Date.now();
        break;
      case 'trial_ended':
        metrics.conversionEvents.trialEnded = Date.now();
        break;
      case 'plan_upgraded':
        metrics.conversionEvents.planUpgraded = Date.now();
        metrics.plan = properties?.newPlan || metrics.plan;
        break;
      case 'plan_downgraded':
        metrics.conversionEvents.planDowngraded = Date.now();
        metrics.plan = properties?.newPlan || metrics.plan;
        break;
      case 'subscription_cancelled':
        metrics.conversionEvents.subscriptionCancelled = Date.now();
        break;
    }
  }

  // Get user metrics
  getUserMetrics(userId: string): UserMetrics | undefined {
    return this.metrics.get(userId);
  }

  // Get all metrics
  getAllMetrics(): UserMetrics[] {
    return Array.from(this.metrics.values());
  }

  // Calculate key business metrics
  getBusinessMetrics() {
    const allMetrics = this.getAllMetrics();
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    const activeUsers = allMetrics.filter(m => m.lastActiveAt > thirtyDaysAgo);
    const newUsers = allMetrics.filter(m => m.signupDate > thirtyDaysAgo);
    const upgradedUsers = allMetrics.filter(m => m.conversionEvents.planUpgraded && m.conversionEvents.planUpgraded > thirtyDaysAgo);

    const planDistribution = allMetrics.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgDocumentsPerUser = activeUsers.length > 0
      ? activeUsers.reduce((sum, user) => sum + user.documentsProcessed, 0) / activeUsers.length
      : 0;

    const avgAudioMinutesPerUser = activeUsers.length > 0
      ? activeUsers.reduce((sum, user) => sum + user.audioMinutesUsed, 0) / activeUsers.length
      : 0;

    return {
      totalUsers: allMetrics.length,
      activeUsers: activeUsers.length,
      newUsers: newUsers.length,
      upgradedUsers: upgradedUsers.length,
      planDistribution,
      avgDocumentsPerUser: Math.round(avgDocumentsPerUser * 10) / 10,
      avgAudioMinutesPerUser: Math.round(avgAudioMinutesPerUser * 10) / 10,
      conversionRate: newUsers.length > 0 ? (upgradedUsers.length / newUsers.length) * 100 : 0
    };
  }

  // Send to analytics service (placeholder for production)
  private sendToAnalytics(event: AnalyticsEvent) {
    // In production, send to your analytics service
    // Examples: Google Analytics, Mixpanel, Amplitude, PostHog
    console.log('Analytics Event:', event);
  }

  // Export data for analysis
  exportData() {
    return {
      events: this.events,
      metrics: this.getAllMetrics(),
      businessMetrics: this.getBusinessMetrics()
    };
  }

  // Clear data (for testing)
  clearData() {
    this.events = [];
    this.metrics.clear();
  }
}

export const analytics = new AnalyticsService();