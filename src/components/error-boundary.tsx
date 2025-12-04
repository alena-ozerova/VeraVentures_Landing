"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-8">An error occurred while rendering this page.</p>
          <details className="w-full max-w-2xl bg-gray-900 p-4 rounded-lg mb-8">
            <summary className="cursor-pointer font-medium mb-2">Error details</summary>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap mt-2">
              {this.state.error?.stack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
