import numpy as np
import scipy.stats as stats

def black_scholes(S, K, T, r, sigma, option_type='call'):
    """
    Black-Scholes formula for European call/put options.
    """
    d1 = (np.log(S/K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    
    if option_type == 'call':
        return S * stats.norm.cdf(d1) - K * np.exp(-r * T) * stats.norm.cdf(d2)
    elif option_type == 'put':
        return K * np.exp(-r * T) * stats.norm.cdf(-d2) - S * stats.norm.cdf(-d1)
    else:
        raise ValueError("Invalid option type. Use 'call' or 'put'.")

# Example usage
S = 100  # Current stock price
K = 100  # Strike price
T = 240/365   # Time to maturity (in years)
r = 0.01 # Risk-free rate
sigma = 0.30 # Volatility
option_type = 'call'

price = black_scholes(S, K, T, r, sigma, option_type)
print(f"The {option_type} option price is: {price:.4f}")

