import { NextRequest, NextResponse } from 'next/server';

interface BlackScholesParams {
  S: number; // Current stock price
  K: number; // Strike price
  T: number; // Time to maturity (in years)
  r: number; // Risk-free rate
  sigma: number; // Volatility
  option_type: 'call' | 'put';
}

function blackScholes(S: number, K: number, T: number, r: number, sigma: number, optionType: 'call' | 'put'): number {
  // Calculate d1 and d2
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  
  // Standard normal cumulative distribution function approximation
  function normCDF(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x) / Math.sqrt(2.0);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return 0.5 * (1.0 + sign * y);
  }
  
  if (optionType === 'call') {
    return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
  } else {
    return K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
  }
}

function generateSensitivityData(params: BlackScholesParams) {
  const { S, K, T, r, sigma, option_type } = params;
  const data = [];
  
  // Generate data for different stock prices with better range
  const minPrice = Math.max(1, S * 0.6);
  const maxPrice = S * 1.4;
  const step = (maxPrice - minPrice) / 20; // 20 data points
  
  for (let price = minPrice; price <= maxPrice; price += step) {
    const optionPrice = blackScholes(price, K, T, r, sigma, option_type);
    const intrinsic = option_type === 'call' ? Math.max(0, price - K) : Math.max(0, K - price);
    data.push({
      stockPrice: Math.round(price * 100) / 100, // Round to 2 decimal places
      optionPrice: Math.round(optionPrice * 100) / 100,
      intrinsicValue: Math.round(intrinsic * 100) / 100,
      timeValue: Math.round((optionPrice - intrinsic) * 100) / 100
    });
  }
  
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body: BlackScholesParams = await request.json();
    
    // Validate inputs
    if (!body.S || !body.K || !body.T || !body.r || !body.sigma || !body.option_type) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    if (body.S <= 0 || body.K <= 0 || body.T <= 0 || body.sigma < 0) {
      return NextResponse.json(
        { error: 'Invalid parameter values' },
        { status: 400 }
      );
    }
    
    // Calculate option price
    const optionPrice = blackScholes(body.S, body.K, body.T, body.r, body.sigma, body.option_type);
    
    // Generate sensitivity analysis data
    const sensitivityData = generateSensitivityData(body);
    
    // Calculate Greeks (simplified approximations)
    const d1 = (Math.log(body.S / body.K) + (body.r + 0.5 * body.sigma * body.sigma) * body.T) / (body.sigma * Math.sqrt(body.T));
    const d2 = d1 - body.sigma * Math.sqrt(body.T);
    
    // Standard normal PDF approximation
    function normPDF(x: number): number {
      return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    }
    
    // Standard normal CDF approximation
    function normCDF(x: number): number {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      
      const sign = x >= 0 ? 1 : -1;
      x = Math.abs(x) / Math.sqrt(2.0);
      
      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      
      return 0.5 * (1.0 + sign * y);
    }
    
    const delta = body.option_type === 'call' ? normCDF(d1) : normCDF(d1) - 1;
    const gamma = normPDF(d1) / (body.S * body.sigma * Math.sqrt(body.T));
    const theta = -(body.S * normPDF(d1) * body.sigma) / (2 * Math.sqrt(body.T)) - 
                  body.r * body.K * Math.exp(-body.r * body.T) * (body.option_type === 'call' ? normCDF(d2) : normCDF(-d2));
    const vega = body.S * normPDF(d1) * Math.sqrt(body.T);
    const rho = body.K * body.T * Math.exp(-body.r * body.T) * (body.option_type === 'call' ? normCDF(d2) : -normCDF(-d2));
    
    const result = {
      optionPrice: optionPrice,
      intrinsicValue: body.option_type === 'call' ? Math.max(0, body.S - body.K) : Math.max(0, body.K - body.S),
      timeValue: optionPrice - (body.option_type === 'call' ? Math.max(0, body.S - body.K) : Math.max(0, body.K - body.S)),
      greeks: {
        delta: delta,
        gamma: gamma,
        theta: theta,
        vega: vega,
        rho: rho
      },
      sensitivityData: sensitivityData
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating Black-Scholes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
