import { CanadianTaxQuizQuestion } from '../types';

export const DEFAULT_CANADIAN_TAX_QUESTIONS: CanadianTaxQuizQuestion[] = [
  // --- Personal Tax (T1) ---
  {
    id: 'can-t1-1',
    topic: 'Personal Tax (T1)',
    question: 'What is the standard Canadian personal income tax (T1) filing deadline for most employed individuals?',
    options: [
      'March 31',
      'April 30',
      'June 15',
      'December 31'
    ],
    correctIndex: 1,
    explanation: 'Under Canada Revenue Agency (CRA) rules, the standard annual T1 personal tax return filing and payment deadline for most individuals is April 30 of the following calendar year.'
  },
  {
    id: 'can-t1-2',
    topic: 'Personal Tax (T1)',
    question: 'If an individual or their spouse carried on an unincorporated business (self-employed), what is their T1 tax filing deadline, and when is any balance owing due?',
    options: [
      'File by April 30; payment due June 15',
      'File by June 15; payment due April 30',
      'File and pay by June 30',
      'File and pay by July 1'
    ],
    correctIndex: 1,
    explanation: 'Self-employed individuals in Canada have an extended filing deadline of June 15, but any balance of tax owing must still be paid on or before April 30 to avoid CRA interest charges.'
  },
  {
    id: 'can-t1-3',
    topic: 'Personal Tax (T1)',
    question: 'What is the primary tax characteristic of contributions made to a Canadian Tax-Free Savings Account (TFSA)?',
    options: [
      'Contributions are tax-deductible against income, but withdrawals are taxable',
      'Contributions are not tax-deductible, but investment earnings and eligible withdrawals are tax-free',
      'Neither contributions nor withdrawals are monitored by the CRA',
      'Contributions are matched 50% by the federal government'
    ],
    correctIndex: 1,
    explanation: 'TFSA contributions are made using after-tax dollars (not tax-deductible), but all investment gains, dividends, and withdrawals are completely free of Canadian income tax.'
  },

  // --- GST / HST & Sales Tax ---
  {
    id: 'can-gst-1',
    topic: 'GST / HST & Sales Tax',
    question: 'What is the standard federal Goods and Services Tax (GST) rate applied to taxable supplies in Canada?',
    options: [
      '3%',
      '5%',
      '7%',
      '10%'
    ],
    correctIndex: 1,
    explanation: 'The federal component of the GST is 5% across all Canadian provinces and territories (either alone or combined into HST in participating provinces).'
  },
  {
    id: 'can-gst-2',
    topic: 'GST / HST & Sales Tax',
    question: 'What is the CRA gross worldwide taxable revenue threshold over four consecutive calendar quarters that requires a business to register for GST/HST?',
    options: [
      '$10,000',
      '$20,000',
      '$30,000',
      '$50,000'
    ],
    correctIndex: 2,
    explanation: 'Under CRA guidelines, a sole proprietor or corporation ceases to be a "small supplier" and must register for GST/HST once taxable sales exceed $30,000 across any single calendar quarter or four consecutive quarters.'
  },
  {
    id: 'can-gst-3',
    topic: 'GST / HST & Sales Tax',
    question: 'What mechanism allows a GST/HST-registered Canadian business to recover the sales tax it paid on commercial purchases and operating expenses?',
    options: [
      'Capital Cost Allowance (CCA)',
      'Input Tax Credits (ITCs)',
      'Scientific Research Credit (SR&ED)',
      'Non-Refundable Withholding'
    ],
    correctIndex: 1,
    explanation: 'Input Tax Credits (ITCs) allow registered businesses to recover GST/HST paid or payable on purchases and operating expenses consumed or used in commercial activities.'
  },
  {
    id: 'can-gst-4',
    topic: 'GST / HST & Sales Tax',
    question: 'Which of the following is considered a "zero-rated" supply under Canadian GST/HST rules (taxed at 0% with entitlement to ITCs)?',
    options: [
      'Basic groceries (such as milk, plain bread, and fresh fruit)',
      'Commercial office rent',
      'Legal and professional accounting services',
      'Passenger vehicle leases'
    ],
    correctIndex: 0,
    explanation: 'Basic groceries, prescription drugs, and agricultural products are zero-rated (0% GST), meaning suppliers charge 0% tax to customers yet remain entitled to claim full ITCs on business inputs.'
  },

  // --- Canadian Payroll & Deductions ---
  {
    id: 'can-pay-1',
    topic: 'Canadian Payroll & Deductions',
    question: 'What is the statutory deadline for Canadian employers to file T4 Information Returns and distribute T4 slips to employees?',
    options: [
      'January 15',
      'January 31',
      'The last day of February',
      'April 30'
    ],
    correctIndex: 2,
    explanation: 'Employers in Canada must file the T4 return with the CRA and deliver T4 slips to employees by the last day of February following the calendar year to which the slips apply.'
  },
  {
    id: 'can-pay-2',
    topic: 'Canadian Payroll & Deductions',
    question: 'In Canadian payroll, what is the required employer matching contribution for the Canada Pension Plan (CPP)?',
    options: [
      'Employers match 50% of the employee contribution',
      'Employers match 100% (equal 1:1 match) of the employee contribution',
      'Employers match 140% of the employee contribution',
      'Employers do not contribute to CPP'
    ],
    correctIndex: 1,
    explanation: 'Canadian employers are legally required to contribute a dollar-for-dollar match (100% or 1:1) of the employee CPP deduction up to the annual Maximum Pensionable Earnings limit.'
  },
  {
    id: 'can-pay-3',
    topic: 'Canadian Payroll & Deductions',
    question: 'What multiplier must an employer apply to an employee’s Employment Insurance (EI) premium when calculating the employer portion?',
    options: [
      '1.0 times the employee premium',
      '1.2 times the employee premium',
      '1.4 times the employee premium',
      '2.0 times the employee premium'
    ],
    correctIndex: 2,
    explanation: 'Unless an employer qualifies for a reduced rate under an approved wage loss replacement plan, the standard employer EI contribution is 1.4 times the employee premium amount.'
  },

  // --- Accounts Receivable & Accounts Payable ---
  {
    id: 'can-ar-1',
    topic: 'Accounts Receivable & Payable',
    question: 'What does the credit sales term "2/10, net 30" mean for a customer invoice?',
    options: [
      'The customer receives a 2% discount if paid within 10 days; otherwise, full balance is due within 30 days',
      'The invoice must be paid in 2 equal installments over 10 to 30 days',
      'A 10% penalty applies if paid after 2 days; net 30 days maximum',
      '2% interest is added to the account every 10 days for 30 days'
    ],
    correctIndex: 0,
    explanation: '"2/10, net 30" offers an early payment cash discount of 2% if the customer remits within 10 calendar days; otherwise, the full net amount must be paid within 30 days.'
  },
  {
    id: 'can-ar-2',
    topic: 'Accounts Receivable & Payable',
    question: 'How is the "Allowance for Doubtful Accounts" classified on a Canadian balance sheet under ASPE?',
    options: [
      'Current Liability',
      'Contra-Asset account reducing Accounts Receivable',
      'Shareholders’ Equity reserve',
      'Non-current Deferred Revenue'
    ],
    correctIndex: 1,
    explanation: 'The Allowance for Doubtful Accounts is a contra-asset account presented directly beneath Accounts Receivable to report net realizable value in accordance with ASPE matching rules.'
  },
  {
    id: 'can-ar-3',
    topic: 'Accounts Receivable & Payable',
    question: 'In Accounts Payable internal controls, what is a "three-way match" required before payment approval?',
    options: [
      'Checking the bank statement, cash flow statement, and general ledger',
      'Matching the Purchase Order, Receiving Report, and Vendor Invoice',
      'Verifying the customer credit score, sales receipt, and shipping label',
      'Signing the cheque with three distinct executive officers'
    ],
    correctIndex: 1,
    explanation: 'A three-way match verifies that the details on the vendor invoice correspond with the quantities received on the receiving report and the authorized prices on the purchase order.'
  },

  // --- Financial Statements & ASPE ---
  {
    id: 'can-fs-1',
    topic: 'Financial Statements & ASPE',
    question: 'Which Canadian accounting framework is specifically designed for non-publicly accountable commercial private corporations in Canada?',
    options: [
      'US GAAP',
      'ASPE (Accounting Standards for Private Enterprises)',
      'IFRS Foundation Tier 1',
      'CRA Tax Basis Only'
    ],
    correctIndex: 1,
    explanation: 'ASPE (Part II of the CPA Canada Handbook) is the standard accounting framework tailored specifically for private commercial enterprises in Canada.'
  },
  {
    id: 'can-fs-2',
    topic: 'Financial Statements & ASPE',
    question: 'What is the fundamental accounting equation that must always balance on a Canadian Balance Sheet?',
    options: [
      'Assets + Liabilities = Equity',
      'Assets = Liabilities + Shareholders’ Equity',
      'Net Income = Revenue - Dividends',
      'Assets = Net Cash Flow + Retained Earnings'
    ],
    correctIndex: 1,
    explanation: 'The foundation of double-entry bookkeeping and balance sheet reporting is Assets = Liabilities + Shareholders’ Equity.'
  },
  {
    id: 'can-fs-3',
    topic: 'Financial Statements & ASPE',
    question: 'What distinguishes a Balance Sheet from an Income Statement in financial reporting?',
    options: [
      'A Balance Sheet reflects a specific point in time; an Income Statement reflects financial performance over a period of time',
      'A Balance Sheet only records cash transactions; an Income Statement records non-cash transactions',
      'A Balance Sheet is only filed with the CRA; an Income Statement is shared with shareholders',
      'There is no technical difference between the two statements'
    ],
    correctIndex: 0,
    explanation: 'The Balance Sheet provides a financial snapshot of assets, debts, and equity at a specific date (e.g., December 31), while the Income Statement measures revenues, costs, and profits across an entire reporting period.'
  }
];

const STORAGE_KEY_TAX_QUIZ = 'verbashift_canadian_tax_questions_v1';

export function loadCanadianTaxQuestions(): CanadianTaxQuizQuestion[] {
  if (typeof window === 'undefined') return DEFAULT_CANADIAN_TAX_QUESTIONS;
  const saved = localStorage.getItem(STORAGE_KEY_TAX_QUIZ);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY_TAX_QUIZ, JSON.stringify(DEFAULT_CANADIAN_TAX_QUESTIONS));
    return DEFAULT_CANADIAN_TAX_QUESTIONS;
  }
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CANADIAN_TAX_QUESTIONS;
  } catch {
    return DEFAULT_CANADIAN_TAX_QUESTIONS;
  }
}

export function saveCanadianTaxQuestions(questions: CanadianTaxQuizQuestion[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_TAX_QUIZ, JSON.stringify(questions));
}

export function resetTaxQuestionsToDefault(): CanadianTaxQuizQuestion[] {
  if (typeof window === 'undefined') return DEFAULT_CANADIAN_TAX_QUESTIONS;
  localStorage.setItem(STORAGE_KEY_TAX_QUIZ, JSON.stringify(DEFAULT_CANADIAN_TAX_QUESTIONS));
  return DEFAULT_CANADIAN_TAX_QUESTIONS;
}

/**
 * Selects 3 random questions from the question bank for a session.
 */
export function getRandomQuizSessionQuestions(count: number = 3): CanadianTaxQuizQuestion[] {
  const all = loadCanadianTaxQuestions();
  const shuffled = [...all].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
