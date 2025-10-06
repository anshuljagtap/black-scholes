'use client';

import { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

interface InputFormProps {
  onCalculate: (params: {
    S: number;
    K: number;
    T: number;
    r: number;
    sigma: number;
    option_type: 'call' | 'put';
  }) => void;
  loading: boolean;
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  description: string;
  min?: number;
  max?: number;
  step?: number;
}

function InputField({ label, value, onChange, unit, description, min = 0, max, step = 0.01 }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} ({unit})
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Info className="w-3 h-3" />
        {description}
      </p>
    </div>
  );
}

export default function InputForm({ onCalculate, loading }: InputFormProps) {
  const [formData, setFormData] = useState({
    S: 100, // Current stock price
    K: 105, // Strike price (slightly out of the money)
    T: 0.25, // Time to maturity (3 months)
    r: 0.05, // Risk-free rate (5%)
    sigma: 0.25, // Volatility (25%)
    option_type: 'call' as 'call' | 'put'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const updateField = (field: string, value: number | string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Black-Scholes Calculator</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Current Stock Price"
            value={formData.S}
            onChange={(value) => updateField('S', value)}
            unit="$"
            description="The current market price of the underlying stock"
            min={0.01}
          />
          
          <InputField
            label="Strike Price"
            value={formData.K}
            onChange={(value) => updateField('K', value)}
            unit="$"
            description="The price at which the option can be exercised"
            min={0.01}
          />
          
          <InputField
            label="Time to Maturity"
            value={formData.T}
            onChange={(value) => updateField('T', value)}
            unit="years"
            description="Time remaining until option expiration (e.g., 0.25 for 3 months)"
            min={0.001}
            max={10}
            step={0.01}
          />
          
          <InputField
            label="Risk-Free Rate"
            value={formData.r}
            onChange={(value) => updateField('r', value)}
            unit="%"
            description="Annual risk-free interest rate (e.g., 0.05 for 5%)"
            min={0}
            max={1}
            step={0.001}
          />
          
          <InputField
            label="Volatility"
            value={formData.sigma}
            onChange={(value) => updateField('sigma', value)}
            unit="%"
            description="Annual volatility of the underlying stock (e.g., 0.20 for 20%)"
            min={0.001}
            max={2}
            step={0.001}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Option Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="call"
                  checked={formData.option_type === 'call'}
                  onChange={(e) => updateField('option_type', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Call Option</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="put"
                  checked={formData.option_type === 'put'}
                  onChange={(e) => updateField('option_type', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Put Option</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Call: Right to buy, Put: Right to sell
            </p>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Calculating...' : 'Calculate Option Price'}
        </button>
      </form>
    </div>
  );
}
