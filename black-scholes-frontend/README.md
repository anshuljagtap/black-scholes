# Black-Scholes Calculator

A modern, interactive web application for calculating European option prices using the Black-Scholes model. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🧮 **Advanced Calculator**
- Real-time Black-Scholes option pricing
- Support for both call and put options
- Comprehensive input validation
- Instant calculations with visual feedback

### 📊 **Interactive Charts**
- Price sensitivity analysis
- Intrinsic vs. time value breakdown
- Greeks visualization
- Responsive charts that work on all devices

### 📚 **Educational Content**
- Detailed explanations of all inputs
- Greeks analysis with practical interpretations
- Risk considerations and disclaimers
- Built-in help tooltips

### 🎨 **Modern UI/UX**
- Clean, professional design
- Responsive layout for all screen sizes
- Intuitive form controls
- Real-time validation and error handling

## Input Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| **Current Stock Price (S)** | Current market price of the underlying stock | $100 |
| **Strike Price (K)** | Price at which the option can be exercised | $100 |
| **Time to Maturity (T)** | Time remaining until expiration (in years) | 0.25 (3 months) |
| **Risk-Free Rate (r)** | Annual risk-free interest rate | 0.05 (5%) |
| **Volatility (σ)** | Annual volatility of the underlying stock | 0.20 (20%) |
| **Option Type** | Call or Put option | Call/Put |

## Output Analysis

### Option Pricing
- **Option Price**: Fair market value based on Black-Scholes model
- **Intrinsic Value**: Immediate exercise value
- **Time Value**: Premium for potential future price movements

### Greeks Analysis
- **Delta**: Price sensitivity to underlying asset changes
- **Gamma**: Rate of change of delta
- **Theta**: Time decay (daily value loss)
- **Vega**: Volatility sensitivity
- **Rho**: Interest rate sensitivity

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd black-scholes-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## API Endpoints

### POST `/api/black-scholes`

Calculates option prices and Greeks using the Black-Scholes model.

**Request Body:**
```json
{
  "S": 100,
  "K": 100,
  "T": 0.25,
  "r": 0.05,
  "sigma": 0.20,
  "option_type": "call"
}
```

**Response:**
```json
{
  "optionPrice": 9.98,
  "intrinsicValue": 0,
  "timeValue": 9.98,
  "greeks": {
    "delta": 0.5398,
    "gamma": 0.0198,
    "theta": -0.0123,
    "vega": 0.1987,
    "rho": 0.1234
  },
  "sensitivityData": [...]
}
```

## Mathematical Implementation

The application implements the standard Black-Scholes formula:

**For Call Options:**
```
C = S * N(d1) - K * e^(-r*T) * N(d2)
```

**For Put Options:**
```
P = K * e^(-r*T) * N(-d2) - S * N(-d1)
```

Where:
- `d1 = [ln(S/K) + (r + σ²/2)*T] / (σ*√T)`
- `d2 = d1 - σ*√T`
- `N(x)` = Standard normal cumulative distribution function

## Disclaimer

⚠️ **Important**: This calculator is for educational purposes only. Options trading involves significant risk and may not be suitable for all investors. The Black-Scholes model makes several assumptions that may not hold in real markets:

- Constant volatility
- No dividends
- No transaction costs
- Continuous trading
- Risk-free interest rate is constant

Always consult with a qualified financial advisor before making investment decisions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue on GitHub.