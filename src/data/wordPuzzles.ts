import { WordPuzzle } from '../types';

export const WORD_PUZZLES: WordPuzzle[] = [
  // --- CANADIAN ACCOUNTING & TAX TERMINOLOGY ---
  {
    id: 'can-wp-1',
    word: 'GST',
    clue: 'Canadian Goods and Services Tax charged at 5% on taxable sales.',
    category: 'Canadian Tax',
    difficulty: 'Basic',
    bonusPoints: 60,
  },
  {
    id: 'can-wp-2',
    word: 'HST',
    clue: 'Harmonized Sales Tax combining the federal GST with provincial tax in provinces like Ontario.',
    category: 'Canadian Tax',
    difficulty: 'Basic',
    bonusPoints: 60,
  },
  {
    id: 'can-wp-3',
    word: 'CRA',
    clue: 'Canada Revenue Agency, the federal department that oversees tax collection and compliance.',
    category: 'Canadian Tax',
    difficulty: 'Basic',
    bonusPoints: 60,
  },
  {
    id: 'can-wp-4',
    word: 'CPP',
    clue: 'Canada Pension Plan, a statutory retirement deduction matched 1-to-1 by employers.',
    category: 'Canadian Payroll',
    difficulty: 'Basic',
    bonusPoints: 60,
  },
  {
    id: 'can-wp-5',
    word: 'ITC',
    clue: 'Input Tax Credit, claimed by GST/HST registrants to recover sales tax paid on business inputs.',
    category: 'Canadian Tax',
    difficulty: 'Basic',
    bonusPoints: 60,
  },
  {
    id: 'can-wp-6',
    word: 'ASPE',
    clue: 'Accounting Standards for Private Enterprises used by non-public commercial Canadian firms.',
    category: 'Canadian Standards',
    difficulty: 'Basic',
    bonusPoints: 70,
  },
  {
    id: 'can-wp-7',
    word: 'IFRS',
    clue: 'International Financial Reporting Standards required for Canadian publicly listed companies.',
    category: 'Canadian Standards',
    difficulty: 'Basic',
    bonusPoints: 70,
  },
  {
    id: 'can-wp-8',
    word: 'T4',
    clue: 'Statement of Remuneration Paid given to Canadian workers by the end of February.',
    category: 'Canadian Payroll',
    difficulty: 'Basic',
    bonusPoints: 50,
  },

  // --- PRACTICAL ACCOUNTING & BOOKKEEPING ---
  {
    id: 'acct-wp-1',
    word: 'CASH',
    clue: 'Bank balances, currency, and coins immediately available for business payments.',
    category: 'Assets & Banking',
    difficulty: 'Basic',
    bonusPoints: 60,
  },
  {
    id: 'acct-wp-2',
    word: 'TAX',
    clue: 'Mandatory government charge assessed on business income, payroll, and retail transactions.',
    category: 'Tax & Compliance',
    difficulty: 'Basic',
    bonusPoints: 50,
  },
  {
    id: 'acct-wp-3',
    word: 'DEBIT',
    clue: 'An entry on the left side of a Canadian ledger that increases assets and expenses.',
    category: 'Bookkeeping',
    difficulty: 'Basic',
    bonusPoints: 70,
  },
  {
    id: 'acct-wp-4',
    word: 'CREDIT',
    clue: 'An entry on the right side of a ledger that increases liabilities, equity, or revenue.',
    category: 'Bookkeeping',
    difficulty: 'Basic',
    bonusPoints: 70,
  },
  {
    id: 'acct-wp-5',
    word: 'ASSET',
    clue: 'An economic resource owned by an enterprise that delivers future financial benefit.',
    category: 'Financial Statements',
    difficulty: 'Basic',
    bonusPoints: 70,
  },
  {
    id: 'acct-wp-6',
    word: 'AUDIT',
    clue: 'Formal examination of financial records by an independent CPA to express an audit opinion.',
    category: 'Audit & Assurance',
    difficulty: 'Basic',
    bonusPoints: 70,
  },
  {
    id: 'acct-wp-7',
    word: 'EQUITY',
    clue: 'The residual ownership value in corporate assets after settling all liabilities.',
    category: 'Financial Statements',
    difficulty: 'Basic',
    bonusPoints: 75,
  },
  {
    id: 'acct-wp-8',
    word: 'LEDGER',
    clue: 'The master book or electronic record where all financial accounts are summarized.',
    category: 'Bookkeeping',
    difficulty: 'Basic',
    bonusPoints: 75,
  },
  {
    id: 'acct-wp-9',
    word: 'INVOICE',
    clue: 'A formal billing document sent to a client detailing services provided and amounts due.',
    category: 'Accounts Receivable',
    difficulty: 'Basic',
    bonusPoints: 80,
  },
  {
    id: 'acct-wp-10',
    word: 'PROFIT',
    clue: 'Net income remaining after all operating expenses and taxes are subtracted from revenues.',
    category: 'Financial Statements',
    difficulty: 'Basic',
    bonusPoints: 75,
  },
  {
    id: 'acct-wp-11',
    word: 'PAYROLL',
    clue: 'The calculation and disbursement of employee salaries, CPP, EI, and income tax withholdings.',
    category: 'Canadian Payroll',
    difficulty: 'Basic',
    bonusPoints: 80,
  },
  {
    id: 'acct-wp-12',
    word: 'BUDGET',
    clue: 'A quantified financial plan and target estimate prepared for an upcoming operational period.',
    category: 'Financial Planning',
    difficulty: 'Basic',
    bonusPoints: 75,
  },
  {
    id: 'acct-wp-13',
    word: 'BALANCE',
    clue: 'The net difference between total debits and total credits in an account at closing.',
    category: 'Bookkeeping',
    difficulty: 'Basic',
    bonusPoints: 75,
  },
  {
    id: 'acct-wp-14',
    word: 'DEBT',
    clue: 'Borrowed funds or supplier liabilities that a business is obligated to repay.',
    category: 'Liabilities',
    difficulty: 'Basic',
    bonusPoints: 60,
  },
  {
    id: 'acct-wp-15',
    word: 'ETHICS',
    clue: 'CPA Code of Conduct standard mandating integrity, objectivity, competence, and confidentiality.',
    category: 'Code of Conduct',
    difficulty: 'Basic',
    bonusPoints: 75,
  },
  {
    id: 'acct-wp-16',
    word: 'RECEIPT',
    clue: 'Documentary proof given to a customer acknowledging payment received for a transaction.',
    category: 'Bookkeeping',
    difficulty: 'Basic',
    bonusPoints: 80,
  }
];

export function shufflePuzzles(puzzles: WordPuzzle[]): WordPuzzle[] {
  const arr = [...puzzles];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
