'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, AlertTriangle, Info } from 'lucide-react';

interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

interface SensitivityData {
  stockPrice: number;
  optionPrice: number;
  intrinsicValue: number;
  timeValue: number;
}

interface ResultsDisplayProps {
  result: {
    optionPrice: number;
    intrinsicValue: number;
    timeValue: number;
    greeks: Greeks;
    sensitivityData: SensitivityData[];
  };
  inputs: {
    S: number;
    K: number;
    T: number;
    r: number;
    sigma: number;
    option_type: 'call' | 'put';
  };
}

export default function ResultsDisplay({ result, inputs }: ResultsDisplayProps) {
  const { optionPrice, intrinsicValue, timeValue, greeks, sensitivityData } = result;
  const { option_type } = inputs;

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  const greeksData = [
    { name: 'Delta', value: greeks.delta, description: 'Price sensitivity to underlying asset' },
    { name: 'Gamma', value: greeks.gamma, description: 'Rate of change of delta' },
    { name: 'Theta', value: greeks.theta, description: 'Time decay (daily)' },
    { name: 'Vega', value: greeks.vega, description: 'Volatility sensitivity' },
    { name: 'Rho', value: greeks.rho, description: 'Interest rate sensitivity' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Results */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Option Pricing Results
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800">Option Price</h4>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(optionPrice)}</p>
            <p className="text-xs text-blue-600">Fair market value</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-800">Intrinsic Value</h4>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(intrinsicValue)}</p>
            <p className="text-xs text-green-600">
              {option_type === 'call' ? 'Max(0, S-K)' : 'Max(0, K-S)'}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800">Time Value</h4>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(timeValue)}</p>
            <p className="text-xs text-purple-600">Option price - Intrinsic value</p>
          </div>
        </div>
      </div>

      {/* Price Sensitivity Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Price Sensitivity Analysis
        </h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensitivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="stockPrice" 
                label={{ value: 'Stock Price ($)', position: 'insideBottom', offset: -5 }}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                label={{ value: 'Option Price ($)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                labelFormatter={(value) => `Stock Price: ${formatCurrency(value)}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="optionPrice" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Option Price"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="intrinsicValue" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Intrinsic Value"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Interpretation:</strong> This chart shows how the option price changes as the underlying stock price varies. 
            The intrinsic value represents the immediate exercise value, while the option price includes both intrinsic and time value.
          </p>
        </div>
      </div>

      {/* Greeks Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Option Greeks
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {greeksData.map((greek, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800">{greek.name}</h4>
              <p className="text-lg font-bold text-gray-900">
                {greek.name === 'Theta' ? formatCurrency(greek.value) : greek.value.toFixed(4)}
              </p>
              <p className="text-xs text-gray-600">{greek.description}</p>
            </div>
          ))}
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={greeksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => {
                  if (Math.abs(value) < 0.01) return value.toFixed(4);
                  if (Math.abs(value) < 1) return value.toFixed(3);
                  return value.toFixed(2);
                }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'Theta' ? formatCurrency(value) : value.toFixed(4), 
                  name
                ]}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <Bar 
                dataKey="value" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Understanding Your Results
        </h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-900">Option Price Breakdown</h4>
            <p className="text-sm text-gray-600">
              The total option price consists of intrinsic value (immediate exercise value) and time value 
              (premium for potential future price movements). Time value decreases as expiration approaches.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-900">Greeks Explained</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Delta:</strong> How much the option price changes for every $1 change in stock price</li>
              <li><strong>Gamma:</strong> How much delta changes for every $1 change in stock price</li>
              <li><strong>Theta:</strong> How much the option loses value each day due to time decay</li>
              <li><strong>Vega:</strong> How much the option price changes for every 1% change in volatility</li>
              <li><strong>Rho:</strong> How much the option price changes for every 1% change in interest rates</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-900">Risk Considerations</h4>
            <p className="text-sm text-gray-600">
              Options are complex financial instruments with significant risk. This calculator provides theoretical 
              values based on the Black-Scholes model assumptions. Real market prices may differ due to factors 
              like liquidity, bid-ask spreads, and market sentiment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
