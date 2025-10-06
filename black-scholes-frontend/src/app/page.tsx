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
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>Educational Tool</span>
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