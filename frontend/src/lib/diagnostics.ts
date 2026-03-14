/**
 * Diagnostic utilities for debugging API connection issues
 */

export interface DiagnosticResult {
  apiUrl: string;
  isProduction: boolean;
  networkType: string;
  isOnline: boolean;
  hasServiceWorker: boolean;
  timestamp: string;
  issuesSeverity: 'critical' | 'warning' | 'none';
  issues: string[];
  suggestions: string[];
}

/**
 * Diagnostic check for API connectivity
 */
export async function diagnosePlatform(): Promise<DiagnosticResult> {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let severity: 'critical' | 'warning' | 'none' = 'none';

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const isProduction = import.meta.env.PROD;

  // Check 1: API URL configuration
  if (!apiUrl || apiUrl === 'http://localhost:8000' && isProduction) {
    issues.push('API_URL not configured for production');
    severity = 'critical';
    suggestions.push('Set VITE_API_URL environment variable for production');
  }

  // Check 2: Network status
  const isOnline = navigator.onLine;
  if (!isOnline) {
    issues.push('Device is offline');
    severity = 'critical';
    suggestions.push('Check your internet connection');
  }

  // Check 3: Network type
  const connection = (navigator as any).connection || (navigator as any).mozConnection;
  const networkType = connection?.effectiveType || 'unknown';
  if (networkType === '4g' || networkType === '3g') {
    suggestions.push('Mobile network detected. May have higher latency.');
  }

  // Check 4: Service Worker
  const hasServiceWorker = 'serviceWorker' in navigator;
  if (!hasServiceWorker && isProduction) {
    suggestions.push('Service Worker not available. Offline support disabled.');
  }

  // Check 5: CORS headers
  try {
    const response = await fetch(`${apiUrl}/ocr/engines`, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'GET',
      },
    }).catch(() => null);

    if (!response?.ok && isProduction) {
      issues.push('Possible CORS configuration issue');
      severity = severity === 'critical' ? 'critical' : 'warning';
      suggestions.push('Check backend CORS headers');
    }
  } catch (e) {
    // Network check failed - likely offline
  }

  return {
    apiUrl,
    isProduction,
    networkType,
    isOnline,
    hasServiceWorker,
    timestamp: new Date().toISOString(),
    issuesSeverity: severity,
    issues,
    suggestions,
  };
}

/**
 * Test API connectivity
 */
export async function testAPIConnection(endpoint: string): Promise<{
  success: boolean;
  statusCode?: number;
  responseTime: number;
  error?: string;
}> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const startTime = performance.now();

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    const responseTime = performance.now() - startTime;

    return {
      success: response.ok,
      statusCode: response.status,
      responseTime,
    };
  } catch (error: any) {
    const responseTime = performance.now() - startTime;
    return {
      success: false,
      responseTime,
      error: error.message,
    };
  }
}

/**
 * Log diagnostic information to console
 */
export function logDiagnostics(result: DiagnosticResult): void {
  const prefix = '%c[Brain Half Diagnostics]';
  const headerStyle = 'background: #10b981; color: white; padding: 8px; border-radius: 4px; font-weight: bold;';

  console.log(prefix, headerStyle);
  console.log('API URL:', result.apiUrl);
  console.log('Production:', result.isProduction);
  console.log('Network Type:', result.networkType);
  console.log('Online:', result.isOnline);
  console.log('Service Worker:', result.hasServiceWorker);

  if (result.issues.length > 0) {
    console.warn('%c❌ Issues found:', 'color: #ef4444; font-weight: bold;');
    result.issues.forEach(issue => console.warn('  • ' + issue));
  }

  if (result.suggestions.length > 0) {
    console.info('%c💡 Suggestions:', 'color: #3b82f6; font-weight: bold;');
    result.suggestions.forEach(suggestion => console.info('  • ' + suggestion));
  }
}

/**
 * Initialize diagnostic on page load
 */
export async function initializeDiagnostics(enableLogging = false): Promise<DiagnosticResult> {
  const result = await diagnosePlatform();

  if (enableLogging || result.issuesSeverity !== 'none') {
    logDiagnostics(result);
  }

  // Test API connectivity
  const apiTest = await testAPIConnection('/ocr/engines');
  if (!apiTest.success && result.issuesSeverity === 'none') {
    console.warn(`%c⚠️ API test failed (${apiTest.responseTime.toFixed(0)}ms): ${apiTest.error}`, 'color: #f59e0b;');
  } else if (apiTest.success) {
    console.log(`%c✅ API test successful (${apiTest.responseTime.toFixed(0)}ms)`, 'color: #10b981;');
  }

  return result;
}
