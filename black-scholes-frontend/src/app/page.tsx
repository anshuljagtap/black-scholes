'use client';

import { useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Calculator, TrendingUp, BookOpen } from 'lucide-react';

interface CalculationResult {
  optionPrice: number;
  intrinsicValue: number;
  timeValue: number;
  greeks: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
  };
  sensitivityData: Array<{
    stockPrice: number;
    optionPrice: number;
    intrinsicValue: number;
    timeValue: number;
  }>;
}

export default function Home() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInputs, setLastInputs] = useState<{
    S: number;
    K: number;
    T: number;
    r: number;
    sigma: number;
    option_type: 'call' | 'put';
  } | null>(null);

  const handleCalculate = async (inputs: {
    S: number;
    K: number;
    T: number;
    r: number;
    sigma: number;
    option_type: 'call' | 'put';
  }) => {
    setLoading(true);
    setError(null);
    setLastInputs(inputs);

    try {
      const response = await fetch('/api/black-scholes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Calculation failed');
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Black-Scholes Calculator</h1>
                <p className="text-sm text-gray-600">Advanced options pricing and analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BookOpen className="w-4 h-4" />
                <span>Educational Tool</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/anshuljagtap/black-scholes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/anshul-jagtap/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <InputForm onCalculate={handleCalculate} loading={loading} />
          </div>

          {/* Results */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Error</h3>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            )}

            {result && lastInputs && (
              <ResultsDisplay result={result} inputs={lastInputs} />
            )}

            {!result && !loading && !error && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-gray-600">
                  Enter your option parameters in the form to get started with pricing analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This calculator is for educational purposes only. 
              Options trading involves significant risk and may not be suitable for all investors.
            </p>
            <p>
              The Black-Scholes model makes several assumptions that may not hold in real markets. 
              Always consult with a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}