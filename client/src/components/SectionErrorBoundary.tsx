import React from "react";
import { COLORS } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Section error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-white border rounded-xl p-6 text-center" style={{ borderColor: COLORS.border }}>
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
          <div className="font-medium mb-2" style={{ color: COLORS.text }}>
            Something went wrong
          </div>
          <div className="text-sm mb-4" style={{ color: COLORS.subt }}>
            This section encountered an error and couldn't load.
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: COLORS.primary, color: "white" }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
