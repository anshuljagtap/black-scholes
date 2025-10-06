# Black-Scholes Options Pricing Calculator

A comprehensive web application for calculating European option prices using the Black-Scholes model. Features an interactive Next.js frontend with real-time calculations, beautiful charts, and educational content.

🌐 **Live Demo**: [https://black-scholes-nine.vercel.app/](https://black-scholes-nine.vercel.app/)

[![Try it now](https://img.shields.io/badge/Try%20it%20now-Live%20Demo-blue?style=for-the-badge&logo=vercel)](https://black-scholes-nine.vercel.app/)

## 🚀 Features

### 📊 **Interactive Calculator**
- Real-time Black-Scholes option pricing
- Support for both call and put options
- Comprehensive input validation
- Instant calculations with visual feedback

### 📈 **Advanced Visualizations**
- Price sensitivity analysis charts
- Greeks visualization with bar charts
- Intrinsic vs. time value breakdown
- Responsive charts for all devices

### 📚 **Educational Content**
- Detailed explanations of all inputs and outputs
- Greeks analysis with practical interpretations
- Risk considerations and disclaimers
- Built-in help tooltips

### 🎨 **Modern UI/UX**
- Clean, professional design with Tailwind CSS
- Responsive layout for all screen sizes
- Intuitive form controls
- Real-time validation and error handling

## 🛠️ Technical Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **Mathematical Engine**: Custom Black-Scholes implementation

## 📋 Input Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| **Current Stock Price (S)** | Current market price of the underlying stock | $100 |
| **Strike Price (K)** | Price at which the option can be exercised | $105 |
| **Time to Maturity (T)** | Time remaining until expiration (in years) | 0.25 (3 months) |
| **Risk-Free Rate (r)** | Annual risk-free interest rate | 0.05 (5%) |
| **Volatility (σ)** | Annual volatility of the underlying stock | 0.25 (25%) |
| **Option Type** | Call or Put option | Call/Put |

## 📊 Output Analysis

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

## 🚀 Getting Started

### Quick Start
**Try the live demo**: [https://black-scholes-nine.vercel.app/](https://black-scholes-nine.vercel.app/)

### Local Development

#### Prerequisites
- Node.js 18+ 
- npm or yarn

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/anshuljagtap/black-scholes.git
cd black-scholes
```

2. Install dependencies:
```bash
cd black-scholes-frontend
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

## 📁 Project Structure

```
Black-Scholes/
├── blackscholes.py              # Original Python implementation
├── black-scholes-frontend/      # Next.js web application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/black-scholes/route.ts  # API endpoint
│   │   │   ├── page.tsx                    # Main page
│   │   │   └── layout.tsx                  # App layout
│   │   └── components/
│   │       ├── InputForm.tsx               # Input form component
│   │       └── ResultsDisplay.tsx          # Results and charts
│   ├── README.md                           # Frontend documentation
│   └── package.json                        # Dependencies
└── README.md                               # Main project documentation
```

## 🔧 API Endpoints

### POST `/api/black-scholes`

Calculates option prices and Greeks using the Black-Scholes model.

**Request Body:**
```json
{
  "S": 100,
  "K": 105,
  "T": 0.25,
  "r": 0.05,
  "sigma": 0.25,
  "option_type": "call"
}
```

**Response:**
```json
{
  "optionPrice": 3.44,
  "intrinsicValue": 0,
  "timeValue": 3.44,
  "greeks": {
    "delta": 0.4099,
    "gamma": 0.0311,
    "theta": -11.60,
    "vega": 19.44,
    "rho": 9.39
  },
  "sensitivityData": [...]
}
```

## 🧮 Mathematical Implementation

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

## ⚠️ Disclaimer

**Important**: This calculator is for educational purposes only. Options trading involves significant risk and may not be suitable for all investors. The Black-Scholes model makes several assumptions that may not hold in real markets:

- Constant volatility
- No dividends
- No transaction costs
- Continuous trading
- Risk-free interest rate is constant

Always consult with a qualified financial advisor before making investment decisions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Black-Scholes model by Fischer Black, Myron Scholes, and Robert Merton
- Next.js team for the amazing framework
- Recharts for beautiful chart components
- Tailwind CSS for utility-first styling

## 👨‍💻 Author

**Anshul Jagtap**
- GitHub: [@anshuljagtap](https://github.com/anshuljagtap)
- LinkedIn: [anshul-jagtap](https://www.linkedin.com/in/anshul-jagtap/)

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Happy Trading! 📈**
