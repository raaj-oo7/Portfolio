import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Compact fallback for embedded widgets (e.g. 3D canvases) */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

/** Catches render errors so a failing subtree (e.g. WebGL) never kills the page. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="glass mx-auto my-8 max-w-md rounded-2xl p-6 text-center">
            <p className="font-display text-lg font-semibold">Something went wrong here.</p>
            <p className="mt-1 text-sm text-(--fg-muted)">
              This part of the page failed to render — the rest of the site still works.
            </p>
          </div>
        )
      )
    }
    return this.props.children
  }
}
