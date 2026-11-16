import { Department, DepartmentMCQQuestion, DepartmentWordPuzzle, MixedQuizItem } from '../types';

// ==========================================
// 1. ACCOUNTING QUESTION BANK
// ==========================================
export const ACCOUNTING_MCQ_QUESTIONS: DepartmentMCQQuestion[] = [
  {
    id: 'acct-mcq-1',
    department: 'Accounting',
    topic: 'Accrual & Revenue Recognition',
    question: 'Under accrual accounting, when should revenue from client services be recognized on the income statement?',
    options: [
      'When the cash payment is officially deposited in the bank account',
      'When the performance obligation is satisfied and services are rendered, regardless of cash receipt',
      'At the close of the calendar fiscal tax year',
      'When the client signs the initial engagement letter'
    ],
    correctIndex: 1,
    explanation: 'Accrual accounting mandates that revenue is recognized when earned (performance obligation satisfied) and expenses are matched in the period they helped generate revenue, rather than when cash transfers.'
  },
  {
    id: 'acct-mcq-2',
    department: 'Accounting',
    topic: 'Financial Statement Presentation',
    question: 'How is the "Allowance for Doubtful Accounts" reported on a standard corporate balance sheet?',
    options: [
      'As a current liability under accounts payable',
      'As a contra-asset account presented directly beneath Accounts Receivable',
      'As an equity reserve in retained earnings',
      'As an operating expense on the income statement only'
    ],
    correctIndex: 1,
    explanation: 'The Allowance for Doubtful Accounts is a contra-asset account with a credit balance that reduces gross Accounts Receivable to its net realizable value on the balance sheet.'
  },
  {
    id: 'acct-mcq-3',
    department: 'Accounting',
    topic: 'Bookkeeping & Double-Entry Ledgers',
    question: 'In double-entry bookkeeping, what is the effect of recording a DEBIT entry?',
    options: [
      'It increases liabilities and increases revenue',
      'It increases assets or expenses, and decreases liabilities or equity',
      'It decreases all accounts in the general ledger',
      'It increases owner equity and decreases inventory'
    ],
    correctIndex: 1,
    explanation: 'Debits (left side) increase asset and expense accounts, while decreasing liability, revenue, and equity accounts. Total debits must always equal total credits.'
  },
  {
    id: 'acct-mcq-4',
    department: 'Accounting',
    topic: 'Auditing & Internal Controls',
    question: 'In accounts payable internal controls, what is a "three-way match" required before issuing invoice payment?',
    options: [
      'Matching the bank statement, cash flow statement, and general ledger',
      'Verifying that the Vendor Invoice, Purchase Order, and Receiving Report agree in quantity and unit cost',
      'Obtaining signatures from three distinct accounting staff members',
      'Reconciling sales tax, income tax, and corporate payroll'
    ],
    correctIndex: 1,
    explanation: 'A three-way match verifies that the quantities and prices billed on the vendor invoice match both the authorized purchase order and the physical receiving report before funds are disbursed.'
  },
  {
    id: 'acct-mcq-5',
    department: 'Accounting',
    topic: 'Tax Withholding & Compliance',
    question: 'When remitting employee payroll deductions to tax authorities, what components are typically withheld from gross pay?',
    options: [
      'Sales tax (GST/HST) and business property tax only',
      'Employee income tax withholdings, pension contributions (e.g. CPP/401k), and social insurance premiums (e.g. EI)',
      'Corporate dividend taxes and capital gains tax',
      'Worker health and safety insurance levies paid by vendors'
    ],
    correctIndex: 1,
    explanation: 'Payroll deductions withheld from gross wages consist of statutory employee income tax, social security/pension withholdings (e.g. CPP), and employment insurance premiums (e.g. EI), which employers must remit on schedule.'
  }
];

export const ACCOUNTING_WORD_PUZZLES: DepartmentWordPuzzle[] = [
  {
    id: 'acct-word-1',
    department: 'Accounting',
    topic: 'Accrual & Revenue Recognition',
    word: 'ACCRUAL',
    clue: 'Accounting method recognizing revenues and expenses in the period incurred rather than when cash flows.',
    explanation: 'Accrual accounting aligns financial activity with economic events rather than cash transfers.'
  },
  {
    id: 'acct-word-2',
    department: 'Accounting',
    topic: 'Bookkeeping & Double-Entry Ledgers',
    word: 'LEDGER',
    clue: 'The master book or electronic record containing summarized debit and credit transactions across all accounts.',
    explanation: 'The general ledger is the central repository for all financial transactions in double-entry bookkeeping.'
  },
  {
    id: 'acct-word-3',
    department: 'Accounting',
    topic: 'Auditing & Internal Controls',
    word: 'AUDIT',
    clue: 'An independent examination of financial statements and internal controls to express professional assurance.',
    explanation: 'An audit provides reasonable assurance that financial statements are free of material misstatement.'
  },
  {
    id: 'acct-word-4',
    department: 'Accounting',
    topic: 'Bookkeeping & Double-Entry Ledgers',
    word: 'DEBIT',
    clue: 'An entry on the left side of a ledger account that increases assets and expenses.',
    explanation: 'Debits reflect resource inflows or expense incurrence in accounting ledgers.'
  },
  {
    id: 'acct-word-5',
    department: 'Accounting',
    topic: 'Financial Statement Presentation',
    word: 'EQUITY',
    clue: 'The residual interest in corporate assets remaining after deducting all obligations and liabilities.',
    explanation: 'Equity represents net book value belonging to owners or shareholders (Assets - Liabilities).'
  }
];

// ==========================================
// 2. MARKETING QUESTION BANK
// ==========================================
export const MARKETING_MCQ_QUESTIONS: DepartmentMCQQuestion[] = [
  {
    id: 'mkt-mcq-1',
    department: 'Marketing',
    topic: 'Unit Economics (CAC & LTV)',
    question: 'What is generally considered a healthy benchmark ratio between Customer Lifetime Value (LTV) and Customer Acquisition Cost (CAC) for scalable businesses?',
    options: [
      '1:1 (LTV equals CAC)',
      '3:1 (LTV is approximately three times CAC)',
      '1:5 (CAC is five times LTV)',
      '10:1 (indicating severe under-investment in growth)'
    ],
    correctIndex: 1,
    explanation: 'A 3:1 LTV:CAC ratio is widely regarded as the golden standard in marketing unit economics, demonstrating profitability while sustaining adequate capital investment in acquiring customers.'
  },
  {
    id: 'mkt-mcq-2',
    department: 'Marketing',
    topic: 'A/B Testing & Optimization',
    question: 'When conducting an A/B test on a landing page, what is required before declaring a variant the definitive winner?',
    options: [
      'At least 24 hours of total test runtime regardless of traffic',
      'Statistical significance (typically 95% confidence) with sufficient sample size to rule out random variance',
      'A unanimous vote from the creative branding design team',
      'The variant having higher click-through rates regardless of conversion rate'
    ],
    correctIndex: 1,
    explanation: 'A/B test winners must be verified with statistical significance (p < 0.05) and sufficient sample size to ensure differences in conversion are not the result of random traffic fluctuation.'
  },
  {
    id: 'mkt-mcq-3',
    department: 'Marketing',
    topic: 'SEO & Organic Growth',
    question: 'Which of the following represents a high-impact technical SEO best practice for modern search engine ranking?',
    options: [
      'Keyword stuffing repetitive phrases in hidden footer tags',
      'Optimizing page load speed, mobile responsiveness, and clean XML sitemap crawlability',
      'Purchasing bulk backlink directories from untrusted private blog networks',
      'Changing page URLs weekly to signal fresh content'
    ],
    correctIndex: 1,
    explanation: 'Search engines reward fast core web vitals, mobile responsive layouts, structured data schema, and clean technical architecture over manipulative keyword density tactics.'
  },
  {
    id: 'mkt-mcq-4',
    department: 'Marketing',
    topic: 'Analytics & Customer Satisfaction',
    question: 'How is the Net Promoter Score (NPS) calculated from customer survey responses on a 0-10 likelihood-to-recommend scale?',
    options: [
      'Average rating score divided by 10',
      'Percentage of Promoters (scores 9-10) minus the Percentage of Detractors (scores 0-6)',
      'Percentage of Passives (scores 7-8) multiplied by total respondents',
      'Total number of positive reviews minus total negative reviews'
    ],
    correctIndex: 1,
    explanation: 'NPS is calculated as % Promoters (rating 9-10) minus % Detractors (rating 0-6). Passives (7-8) are factored into total headcount but do not contribute to the net score.'
  },
  {
    id: 'mkt-mcq-5',
    department: 'Marketing',
    topic: 'Brand Strategy & Positioning',
    question: 'In marketing strategy, what is the core purpose of creating a detailed "Buyer Persona"?',
    options: [
      'To design an fictional mascot for television advertisements',
      'To build a research-backed archetype representing target customer demographics, pain points, and decision triggers',
      'To track the personal social media accounts of competitor executives',
      'To calculate internal employee payroll incentives'
    ],
    correctIndex: 1,
    explanation: 'Buyer personas synthesize customer research into actionable customer archetypes, aligning messaging, product positioning, and acquisition channels to genuine buyer pain points.'
  }
];

export const MARKETING_WORD_PUZZLES: DepartmentWordPuzzle[] = [
  {
    id: 'mkt-word-1',
    department: 'Marketing',
    topic: 'Unit Economics (CAC & LTV)',
    word: 'FUNNEL',
    clue: 'Visual model tracking buyer progression from initial awareness through consideration to final purchase.',
    explanation: 'The marketing funnel charts customer conversion rates across awareness, interest, decision, and action.'
  },
  {
    id: 'mkt-word-2',
    department: 'Marketing',
    topic: 'Analytics & Customer Satisfaction',
    word: 'CHURN',
    clue: 'The rate at which existing customers cancel subscriptions or cease purchasing over a specific period.',
    explanation: 'Customer churn rate directly impacts Lifetime Value (LTV) and long-term net revenue retention.'
  },
  {
    id: 'mkt-word-3',
    department: 'Marketing',
    topic: 'Brand Strategy & Positioning',
    word: 'PERSONA',
    clue: 'A semi-fictional profile depicting the ideal target customer based on market research and real data.',
    explanation: 'Personas humanize target market segments to guide messaging and product-market fit.'
  },
  {
    id: 'mkt-word-4',
    department: 'Marketing',
    topic: 'A/B Testing & Optimization',
    word: 'METRIC',
    clue: 'A quantifiable measure used to track, monitor, and assess the success of a marketing campaign.',
    explanation: 'Key performance metrics (KPIs) like CTR, CPA, and ROAS quantify marketing campaign ROI.'
  },
  {
    id: 'mkt-word-5',
    department: 'Marketing',
    topic: 'A/B Testing & Optimization',
    word: 'CONVERSION',
    clue: 'The desired action a user takes on a site or ad, such as completing a form or purchasing a product.',
    explanation: 'Conversion rate optimization (CRO) maximizes the percentage of visitors who complete the target objective.'
  }
];

// ==========================================
// 3. ENGINEERING QUESTION BANK
// ==========================================
export const ENGINEERING_MCQ_QUESTIONS: DepartmentMCQQuestion[] = [
  {
    id: 'eng-mcq-1',
    department: 'Engineering',
    topic: 'Algorithms & Complexity',
    question: 'What is the worst-case time complexity of finding an element using Binary Search on a sorted array of size n?',
    options: [
      'O(1) constant time',
      'O(log n) logarithmic time',
      'O(n) linear time',
      'O(n^2) quadratic time'
    ],
    correctIndex: 1,
    explanation: 'Binary search divides the search space in half with every comparison, yielding an O(log n) worst-case time complexity, compared to O(n) for linear search.'
  },
  {
    id: 'eng-mcq-2',
    department: 'Engineering',
    topic: 'Database Design & Indexing',
    question: 'In relational database normalization, what defines Third Normal Form (3NF)?',
    options: [
      'Tables with no foreign keys or indexes',
      'The table is in 2NF and contains no transitive functional dependencies between non-key attributes',
      'Every column must store multiple comma-separated values in an array',
      'All database queries run in sub-millisecond execution times'
    ],
    correctIndex: 1,
    explanation: 'A relation is in 3NF if it is in 2NF and every non-prime attribute is non-transitively dependent on every candidate key (every attribute depends on the key, the whole key, and nothing but the key).'
  },
  {
    id: 'eng-mcq-3',
    department: 'Engineering',
    topic: 'CI/CD & DevOps Practices',
    question: 'What is the primary benefit of deploying software updates using a "Canary Deployment" strategy?',
    options: [
      'Rebuilding all server hardware from physical scratch on every build',
      'Routing a small percentage of live production traffic to the new version to monitor errors before full rollout',
      'Writing deployment scripts exclusively in Python or Bash',
      'Skipping code reviews to accelerate deployment release velocity'
    ],
    correctIndex: 1,
    explanation: 'Canary deployments roll out changes to a small fraction of real users first. If error rates or latency spike, the deployment safely rolls back before impacting the entire user base.'
  },
  {
    id: 'eng-mcq-4',
    department: 'Engineering',
    topic: 'REST API & Web Architecture',
    question: 'Which of the following HTTP methods is defined as IDEMPOTENT by the HTTP/1.1 specification?',
    options: [
      'POST (creating new resources)',
      'PUT (replacing target resource state) and DELETE (removing resource)',
      'PATCH with custom non-deterministic payload transformations',
      'CONNECT used for establishing TLS network tunnels'
    ],
    correctIndex: 1,
    explanation: 'An HTTP method is idempotent if executing it multiple times produces the same server state as executing it once. PUT, DELETE, and GET are idempotent; POST is not.'
  },
  {
    id: 'eng-mcq-5',
    department: 'Engineering',
    topic: 'System Design & Scalability',
    question: 'What is the primary purpose of introducing an asynchronous message queue (e.g. RabbitMQ, Kafka) into a distributed system?',
    options: [
      'To store relational table records permanently without a database',
      'To decouple producer and consumer services, smooth traffic spikes, and allow asynchronous background processing',
      'To replace TLS encryption certificates across network endpoints',
      'To eliminate the need for server memory (RAM)'
    ],
    correctIndex: 1,
    explanation: 'Message queues decouple microservices, buffer bursty network traffic, and facilitate asynchronous background job processing without blocking user-facing HTTP request cycles.'
  }
];

export const ENGINEERING_WORD_PUZZLES: DepartmentWordPuzzle[] = [
  {
    id: 'eng-word-1',
    department: 'Engineering',
    topic: 'System Design & Scalability',
    word: 'LATENCY',
    clue: 'The duration of time it takes for a data packet to travel from sender to receiver across a network.',
    explanation: 'Minimizing network and execution latency is critical for high-throughput distributed applications.'
  },
  {
    id: 'eng-word-2',
    department: 'Engineering',
    topic: 'Database Design & Indexing',
    word: 'SCHEMA',
    clue: 'The formal structural blueprint defining tables, columns, data types, and relationships in a database.',
    explanation: 'A database schema enforces structural integrity and relational constraints on stored entities.'
  },
  {
    id: 'eng-word-3',
    department: 'Engineering',
    topic: 'REST API & Web Architecture',
    word: 'ENDPOINT',
    clue: 'The specific URL route where an API service receives incoming requests and returns resource responses.',
    explanation: 'API endpoints expose web service capabilities to client applications via HTTP.'
  },
  {
    id: 'eng-word-4',
    department: 'Engineering',
    topic: 'CI/CD & DevOps Practices',
    word: 'DOCKER',
    clue: 'Popular container platform standardizing application code, libraries, and dependencies into portable images.',
    explanation: 'Containers package application code with its runtime environment to guarantee uniform execution.'
  },
  {
    id: 'eng-word-5',
    department: 'Engineering',
    topic: 'Algorithms & Complexity',
    word: 'REFACTOR',
    clue: 'Restructuring existing computer code to improve internal design without altering external behavior.',
    explanation: 'Code refactoring reduces technical debt, boosts readability, and simplifies future maintenance.'
  }
];

// ==========================================
// 4. HUMAN RESOURCES (HR) QUESTION BANK
// ==========================================
export const HR_MCQ_QUESTIONS: DepartmentMCQQuestion[] = [
  {
    id: 'hr-mcq-1',
    department: 'HR',
    topic: 'Talent Acquisition & Interviewing',
    question: 'What does the acronym "STAR" represent in structured behavioral candidate interviewing?',
    options: [
      'Strategy, Talent, Assessment, Remuneration',
      'Situation, Task, Action, Result',
      'Seniority, Testing, Aptitude, References',
      'Salary, Timing, Availability, Retention'
    ],
    correctIndex: 1,
    explanation: 'The STAR framework (Situation, Task, Action, Result) helps interviewers evaluate past behavior objectively by prompting candidates to describe concrete workplace scenarios and measurable results.'
  },
  {
    id: 'hr-mcq-2',
    department: 'HR',
    topic: 'Workplace Compliance & Investigation',
    question: 'When an employee formally reports a workplace harassment complaint, what is HR’s immediate legal and ethical obligation?',
    options: [
      'Instruct the employee to informally resolve the dispute directly with the accused person',
      'Initiate an impartial, prompt, and documented investigation while ensuring protection from retaliation',
      'Wait for the annual employee performance review cycle to address the issue',
      'Immediately terminate the accused employee without gathering factual evidence'
    ],
    correctIndex: 1,
    explanation: 'HR must promptly initiate a fair, documented, and confidential investigation, ensure due process for all parties, and enforce strict non-retaliation protections.'
  },
  {
    id: 'hr-mcq-3',
    department: 'HR',
    topic: 'Employee Engagement & Retention',
    question: 'What is the primary advantage of conducting regular, short "pulse surveys" compared to an annual engagement survey?',
    options: [
      'They eliminate the need for manager one-on-one meetings',
      'They provide continuous, real-time feedback on team morale and surface emerging concerns before they escalate into turnover',
      'They take only 5 seconds to analyze and guarantee zero employee turnover',
      'They are legally required by federal labor standards'
    ],
    correctIndex: 1,
    explanation: 'Pulse surveys allow HR and leaders to track real-time sentiment trends, assess the impact of recent changes, and resolve emerging friction before it results in talent attrition.'
  },
  {
    id: 'hr-mcq-4',
    department: 'HR',
    topic: 'Performance Management',
    question: 'What distinguishes "formative" performance feedback from "summative" performance evaluation?',
    options: [
      'Formative feedback is shared via email; summative feedback is printed on paper',
      'Formative feedback provides continuous guidance for ongoing learning and skill development; summative feedback evaluates overall outcomes against benchmarks at period end',
      'Formative feedback always includes cash bonuses; summative feedback never does',
      'There is no technical difference in performance management'
    ],
    correctIndex: 1,
    explanation: 'Formative feedback occurs continually to nurture growth and identify training needs, whereas summative evaluation assesses cumulative performance against standards at formal review milestones.'
  },
  {
    id: 'hr-mcq-5',
    department: 'HR',
    topic: 'Compensation & Benefits Strategy',
    question: 'In compensation management, what does "internal equity" refer to?',
    options: [
      'Ensuring the company’s stock options are offered only to executive leadership',
      'Ensuring that employees performing similar roles with comparable responsibilities and contributions receive fair, consistent pay relative to one another',
      'Paying identical salaries across completely different technical departments regardless of market demand',
      'Setting salary bands based strictly on employee age'
    ],
    correctIndex: 1,
    explanation: 'Internal equity ensures fair, non-discriminatory compensation comparisons among peers inside the organization based on responsibility, competence, and contribution.'
  }
];

export const HR_WORD_PUZZLES: DepartmentWordPuzzle[] = [
  {
    id: 'hr-word-1',
    department: 'HR',
    topic: 'Talent Acquisition & Interviewing',
    word: 'ONBOARD',
    clue: 'The structured integration process familiarizing newly hired employees with company culture and role responsibilities.',
    explanation: 'Effective onboarding accelerates time-to-productivity and boosts long-term new hire retention.'
  },
  {
    id: 'hr-word-2',
    department: 'HR',
    topic: 'Compensation & Benefits Strategy',
    word: 'BENEFITS',
    clue: 'Non-wage compensation provided to employees such as health insurance, retirement plans, and paid leave.',
    explanation: 'Comprehensive benefits packages protect employee wellbeing and enhance competitive hiring offers.'
  },
  {
    id: 'hr-word-3',
    department: 'HR',
    topic: 'Talent Acquisition & Interviewing',
    word: 'TALENT',
    clue: 'The collective skills, capabilities, and knowledge possessed by an organization\'s workforce.',
    explanation: 'Strategic talent management optimizes hiring, skill development, and executive succession planning.'
  },
  {
    id: 'hr-word-4',
    department: 'HR',
    topic: 'Performance Management',
    word: 'APPRAISAL',
    clue: 'A periodic formal evaluation reviewing an employee’s job performance, achievements, and development goals.',
    explanation: 'Performance appraisals align individual employee milestones with organizational business objectives.'
  },
  {
    id: 'hr-word-5',
    department: 'HR',
    topic: 'Workplace Compliance & Investigation',
    word: 'COMPLIANCE',
    clue: 'Adherence to statutory employment laws, safety regulations, anti-discrimination policies, and labor standards.',
    explanation: 'HR compliance protects organizations from regulatory liability and fosters an equitable workplace.'
  }
];

// Helper: Generate Department Mixed Quiz Session (Alternating MCQ, Word Puzzle, MCQ, Word Puzzle)
export function generateDepartmentQuizSession(department: Department, totalQuestions: number = 4): MixedQuizItem[] {
  let mcqBank: DepartmentMCQQuestion[];
  let wordBank: DepartmentWordPuzzle[];

  switch (department) {
    case 'Marketing':
      mcqBank = [...MARKETING_MCQ_QUESTIONS].sort(() => 0.5 - Math.random());
      wordBank = [...MARKETING_WORD_PUZZLES].sort(() => 0.5 - Math.random());
      break;
    case 'Engineering':
      mcqBank = [...ENGINEERING_MCQ_QUESTIONS].sort(() => 0.5 - Math.random());
      wordBank = [...ENGINEERING_WORD_PUZZLES].sort(() => 0.5 - Math.random());
      break;
    case 'HR':
      mcqBank = [...HR_MCQ_QUESTIONS].sort(() => 0.5 - Math.random());
      wordBank = [...HR_WORD_PUZZLES].sort(() => 0.5 - Math.random());
      break;
    case 'Accounting':
    default:
      mcqBank = [...ACCOUNTING_MCQ_QUESTIONS].sort(() => 0.5 - Math.random());
      wordBank = [...ACCOUNTING_WORD_PUZZLES].sort(() => 0.5 - Math.random());
      break;
  }

  const items: MixedQuizItem[] = [];
  let mcqIdx = 0;
  let wordIdx = 0;

  for (let i = 0; i < totalQuestions; i++) {
    const isMcq = i % 2 === 0;

    if (isMcq && mcqIdx < mcqBank.length) {
      const q = mcqBank[mcqIdx++];
      items.push({
        id: `mcq-${department}-${q.id}-${Date.now()}-${i}`,
        type: 'mcq',
        department,
        topic: q.topic,
        prompt: q.question,
        options: [...q.options],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    } else if (wordIdx < wordBank.length) {
      const p = wordBank[wordIdx++];
      items.push({
        id: `word-${department}-${p.id}-${Date.now()}-${i}`,
        type: 'word_puzzle',
        department,
        topic: p.topic,
        prompt: p.clue,
        targetWord: p.word.toUpperCase(),
        category: p.topic,
        explanation: `Solution: ${p.word}. ${p.explanation}`,
      });
    } else if (mcqIdx < mcqBank.length) {
      const q = mcqBank[mcqIdx++];
      items.push({
        id: `mcq-${department}-${q.id}-${Date.now()}-${i}`,
        type: 'mcq',
        department,
        topic: q.topic,
        prompt: q.question,
        options: [...q.options],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    }
  }

  return items;
}
