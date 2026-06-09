import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 0',
          gap: 'var(--space-3)',
        }}>
          <h2 style={{ fontWeight: 600, color: 'var(--color-danger)' }}>Something went wrong</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{this.state.error?.message}</p>
          <button
            className="btn btn-primary btn-md"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
