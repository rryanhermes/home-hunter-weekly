
export interface PropertyMetrics {
  capRate: number;
  cashOnCashReturn: number;
  netOperatingIncome: number;
  cashFlow: number;
  roi: number;
  breakEvenPoint: number;
  grm: number; // Gross Rent Multiplier
  dscr: number; // Debt Service Coverage Ratio
  riskScore: number; // 1-10, lower is better
}

export interface DealGrade {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number; // 0-100
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export class DealAnalysisService {
  // Calculate cap rate: Annual Net Operating Income / Property Value
  static calculateCapRate(annualNOI: number, propertyValue: number): number {
    return (annualNOI / propertyValue) * 100;
  }
  
  // Calculate cash on cash return: Annual Cash Flow / Total Cash Invested
  static calculateCashOnCash(annualCashFlow: number, totalInvestment: number): number {
    return (annualCashFlow / totalInvestment) * 100;
  }
  
  // Calculate Return on Investment (ROI)
  static calculateROI(annualProfit: number, totalInvestment: number): number {
    return (annualProfit / totalInvestment) * 100;
  }
  
  // Calculate all property metrics based on available data
  static analyzeProperty(propertyData: any, userInputs: any = {}): PropertyMetrics {
    // In a real implementation, this would use sophisticated models
    // For now, we're using simplified calculations
    
    const price = propertyData.price;
    const estimatedRent = propertyData.rentEstimate || price * 0.008; // 0.8% rule as fallback
    const annualRent = estimatedRent * 12;
    
    // Estimate expenses (typically 40-50% of gross income for residential)
    const expenseRatio = userInputs.expenseRatio || 0.45;
    const annualExpenses = annualRent * expenseRatio;
    
    // Calculate NOI
    const noi = annualRent - annualExpenses;
    
    // Estimate mortgage based on user inputs or defaults
    const downPayment = userInputs.downPayment || price * 0.2;
    const loanAmount = price - downPayment;
    const interestRate = userInputs.interestRate || 0.06; // 6% default
    const loanTerm = userInputs.loanTerm || 30; // 30 years default
    
    // Monthly mortgage calculation (principal + interest)
    const monthlyInterest = interestRate / 12;
    const totalPayments = loanTerm * 12;
    const monthlyMortgage = loanAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments)) / 
                          (Math.pow(1 + monthlyInterest, totalPayments) - 1);
    const annualMortgage = monthlyMortgage * 12;
    
    // Cash flow
    const cashFlow = noi - annualMortgage;
    
    // GRM = Price / Annual Gross Rent
    const grm = price / annualRent;
    
    // DSCR = NOI / Annual Debt Service
    const dscr = annualMortgage > 0 ? noi / annualMortgage : 999; // Avoid division by zero
    
    // Risk score calculation (simplified)
    let riskFactors = 0;
    
    // Age of property increases risk
    const buildYear = propertyData.yearBuilt || 2000;
    const propertyAge = new Date().getFullYear() - buildYear;
    riskFactors += propertyAge > 30 ? 2 : propertyAge > 15 ? 1 : 0;
    
    // Low cap rate increases risk
    const capRate = this.calculateCapRate(noi, price);
    riskFactors += capRate < 4 ? 2 : capRate < 6 ? 1 : 0;
    
    // Negative cash flow increases risk
    riskFactors += cashFlow < 0 ? 3 : 0;
    
    // Low DSCR increases risk
    riskFactors += dscr < 1.2 ? 2 : dscr < 1.5 ? 1 : 0;
    
    // Calculate final risk score (1-10)
    const riskScore = Math.min(10, Math.max(1, Math.round(riskFactors * 1.5)));
    
    return {
      capRate: capRate,
      cashOnCashReturn: this.calculateCashOnCash(cashFlow, downPayment),
      netOperatingIncome: noi,
      cashFlow: cashFlow,
      roi: this.calculateROI(cashFlow + (price * 0.03), downPayment), // Adding 3% appreciation
      breakEvenPoint: cashFlow >= 0 ? 0 : Math.ceil(Math.abs(downPayment / cashFlow)),
      grm: grm,
      dscr: dscr,
      riskScore: riskScore
    };
  }
  
  // Grade a property deal based on metrics and user preferences
  static gradeDeal(metrics: PropertyMetrics, userPreferences: any = {}): DealGrade {
    let score = 0;
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];
    
    // Cap rate scoring (0-25 points)
    if (metrics.capRate >= 8) {
      score += 25;
      strengths.push(`Excellent cap rate of ${metrics.capRate.toFixed(1)}%`);
    } else if (metrics.capRate >= 6) {
      score += 20;
      strengths.push(`Good cap rate of ${metrics.capRate.toFixed(1)}%`);
    } else if (metrics.capRate >= 4) {
      score += 10;
      recommendations.push(`Average cap rate of ${metrics.capRate.toFixed(1)}%. Consider negotiating price to improve returns.`);
    } else {
      weaknesses.push(`Low cap rate of ${metrics.capRate.toFixed(1)}%. This property may not generate sufficient income relative to its price.`);
    }
    
    // Cash flow scoring (0-25 points)
    if (metrics.cashFlow >= 500 * 12) { // $500+/month
      score += 25;
      strengths.push(`Strong positive cash flow of $${Math.round(metrics.cashFlow/12)}/month`);
    } else if (metrics.cashFlow > 0) {
      score += 15;
      strengths.push(`Positive cash flow of $${Math.round(metrics.cashFlow/12)}/month`);
    } else if (metrics.cashFlow > -200 * 12) { // Less than $200/month negative
      score += 5;
      weaknesses.push(`Slight negative cash flow of $${Math.abs(Math.round(metrics.cashFlow/12))}/month`);
      recommendations.push("Consider strategies to increase rent or reduce expenses.");
    } else {
      weaknesses.push(`Significant negative cash flow of $${Math.abs(Math.round(metrics.cashFlow/12))}/month`);
      recommendations.push("This property may require significant additional monthly investment.");
    }
    
    // ROI scoring (0-20 points)
    if (metrics.roi >= 15) {
      score += 20;
      strengths.push(`Exceptional projected ROI of ${metrics.roi.toFixed(1)}%`);
    } else if (metrics.roi >= 10) {
      score += 15;
      strengths.push(`Strong projected ROI of ${metrics.roi.toFixed(1)}%`);
    } else if (metrics.roi >= 7) {
      score += 10;
      recommendations.push(`Moderate ROI of ${metrics.roi.toFixed(1)}%. Consider improvements to increase property value.`);
    } else {
      weaknesses.push(`Low projected ROI of ${metrics.roi.toFixed(1)}%`);
    }
    
    // Risk scoring (0-20 points)
    if (metrics.riskScore <= 3) {
      score += 20;
      strengths.push("Low risk investment");
    } else if (metrics.riskScore <= 5) {
      score += 15;
      strengths.push("Moderate-low risk profile");
    } else if (metrics.riskScore <= 7) {
      score += 5;
      recommendations.push("Moderate risk. Consider getting a thorough inspection and budget for repairs.");
    } else {
      weaknesses.push(`High risk score of ${metrics.riskScore}/10. Proceed with caution.`);
    }
    
    // DSCR scoring (0-10 points)
    if (metrics.dscr >= 2) {
      score += 10;
      strengths.push(`Excellent debt service coverage ratio of ${metrics.dscr.toFixed(2)}`);
    } else if (metrics.dscr >= 1.5) {
      score += 7;
      strengths.push(`Good debt service coverage ratio of ${metrics.dscr.toFixed(2)}`);
    } else if (metrics.dscr >= 1.2) {
      score += 3;
      recommendations.push(`Acceptable but tight debt service coverage ratio of ${metrics.dscr.toFixed(2)}`);
    } else if (metrics.dscr >= 1) {
      recommendations.push(`Minimal debt service coverage ratio of ${metrics.dscr.toFixed(2)}. This leaves little room for unexpected expenses.`);
    } else {
      weaknesses.push(`Insufficient debt service coverage ratio of ${metrics.dscr.toFixed(2)}. The property income cannot cover the debt payments.`);
    }
    
    // Determine letter grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 85) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 55) grade = 'C';
    else if (score >= 40) grade = 'D';
    else grade = 'F';
    
    return {
      grade,
      score,
      explanation: `This property received a grade of ${grade} (${score}/100) based on its financial performance metrics and risk profile.`,
      strengths,
      weaknesses,
      recommendations
    };
  }
}
