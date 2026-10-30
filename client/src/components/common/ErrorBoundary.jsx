import React from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { api } from '../../api/client';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Captured in ErrorBoundary:', error, errorInfo);

    // Report client error telemetry to backend if available
    try {
      api.post('/error-log', {
        message: error?.message || 'Unknown React render error',
        stack: error?.stack,
        url: window.location.href,
        info: errorInfo?.componentStack,
        timestamp: new Date().toISOString()
      }).catch(() => {});
    } catch (e) {
      // Ignore network failures in error reporting
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-cream-200 p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-forest-700 bg-forest-50 px-3 py-1 rounded-full">
                System Recovery
              </span>
              <h2 className="font-serif text-2xl font-bold text-forest-950 mt-3">
                Something didn't go quite right
              </h2>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                We encountered an unexpected issue while rendering this page. Our technical team has been automatically notified.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary flex-1 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="btn-secondary flex-1 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Back Home</span>
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-stone-50 p-3 rounded-xl border border-stone-200 text-[10px] text-stone-700 overflow-auto max-h-40">
                <summary className="font-bold cursor-pointer text-stone-900">Developer Diagnostic Info</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.toString()}</pre>
                <pre className="mt-1 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
