import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      let errorDetails = null;
      try {
        if (this.state.error?.message) {
          errorDetails = JSON.parse(this.state.error.message);
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-red-100">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-8">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">오류가 발생했습니다</h1>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              애플리케이션 실행 중 예기치 않은 오류가 발생했습니다. 아래 정보를 확인하시거나 페이지를 새로고침해 주세요.
            </p>

            {errorDetails ? (
              <div className="bg-slate-900 rounded-2xl p-6 mb-8 overflow-x-auto">
                <p className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-4">Error Diagnostics</p>
                <pre className="text-slate-300 font-mono text-sm">
                  {JSON.stringify(errorDetails, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 rounded-2xl p-6 mb-8">
                <p className="text-red-600 font-bold text-sm">
                  {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
              >
                <RefreshCw className="w-5 h-5" /> 페이지 새로고침
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                다시 시도
              </button>
            </div>
            
            <p className="mt-8 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">
              System Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
