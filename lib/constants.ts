export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'

export interface Clause {
  id: string
  title: string
  category?: string
  text: string
  riskLevel: RiskLevel
  explanation: string
  recommendation: string
}

export interface Contract {
  id: string
  title: string
  date: string
  status: 'review' | 'flagged' | 'approved'
  riskScore?: number
  clauses: Clause[]
  summary?: {
    totalClauses?: number
    criticalIssues?: number
    highIssues?: number
    mediumIssues?: number
    businessSummary?: string
    legalSummary?: string
    financialObligations?: string[]
    keyDates?: string[]
  }
}

export const SAMPLE_CONTRACT: Contract = {
  id: 'contract-001',
  title: 'Service Agreement - TechCorp & LegalPro Inc.',
  date: 'January 15, 2024',
  status: 'review',
  clauses: [
    {
      id: 'clause-001',
      title: 'Limitation of Liability',
      text: 'Neither party shall be liable for any indirect, incidental, special, or consequential damages arising out of or relating to this Agreement, regardless of the form of action or the basis of the claim.',
      riskLevel: 'critical',
      explanation:
        'This clause completely eliminates liability for indirect damages, which could expose your company to significant financial risk. The broad language captures almost all types of business damages.',
      recommendation:
        'Consider limiting this to indirect damages only, exclude direct damages and lost revenue. Add a cap on total liability (e.g., 12 months of fees or actual amount paid).',
    },
    {
      id: 'clause-002',
      title: 'Indemnification Obligations',
      text: 'Each party agrees to indemnify and hold harmless the other party from any third-party claims, damages, or expenses arising from its breach of this Agreement or violation of applicable law.',
      riskLevel: 'high',
      explanation:
        'This indemnification is quite broad and could require you to cover the other party\'s legal fees even in cases where you\'re not responsible. The scope should be narrower.',
      recommendation:
        'Limit indemnification to claims directly caused by the indemnifying party\'s negligence or willful misconduct. Add a notice and defense requirement.',
    },
    {
      id: 'clause-003',
      title: 'Termination for Convenience',
      text: 'Either party may terminate this Agreement at any time without cause upon thirty (30) days written notice to the other party.',
      riskLevel: 'medium',
      explanation:
        'While providing flexibility, this allows the other party to exit without penalty, potentially leaving you without anticipated revenue. Consider adding transition services requirements.',
      recommendation:
        'Add financial penalties for early termination (e.g., prorated refund of prepayment), require continued service during transition period, or establish minimum term.',
    },
    {
      id: 'clause-004',
      title: 'Data Protection and Privacy',
      text: 'Both parties shall maintain appropriate security measures to protect any personal data exchanged during the performance of this Agreement in accordance with applicable data protection laws.',
      riskLevel: 'low',
      explanation:
        'This clause appropriately incorporates data protection compliance and requires reasonable security measures. Language is balanced and compliant with GDPR/CCPA standards.',
      recommendation:
        'Consider adding specific audit rights, breach notification procedures, and data processing addendum (DPA) reference for enhanced protection.',
    },
    {
      id: 'clause-005',
      title: 'Intellectual Property Rights',
      text: 'Any intellectual property created by either party during performance of this Agreement shall be owned by that party. Work product developed jointly shall be owned equally by both parties.',
      riskLevel: 'high',
      explanation:
        'Joint ownership creates complications for commercialization. Either party could license to competitors without the other\'s consent, diluting competitive advantage.',
      recommendation:
        'Clarify that jointly developed IP requires mutual written consent for licensing. Consider exclusive license provisions or buy-out mechanisms.',
    },
    {
      id: 'clause-006',
      title: 'Confidentiality Duration',
      text: 'Confidential information shall remain confidential for a period of five (5) years from the date of disclosure, after which time such information shall be deemed public domain.',
      riskLevel: 'medium',
      explanation:
        'Five years may be insufficient for trade secrets and proprietary technology. This could expose long-term competitive advantages within an industry cycle.',
      recommendation:
        'Extend to 7-10 years minimum. Add explicit carve-out that trade secrets remain confidential indefinitely, even after contract termination.',
    },
  ],
  summary: {
    totalClauses: 6,
    criticalIssues: 1,
    highIssues: 2,
    mediumIssues: 2,
  },
}

export const SAMPLE_CONTRACTS: Contract[] = [
  {
    id: 'contract-001',
    title: 'Service Agreement - TechCorp & LegalPro Inc.',
    date: 'January 15, 2024',
    status: 'review',
    clauses: SAMPLE_CONTRACT.clauses,
    summary: SAMPLE_CONTRACT.summary,
  },
  {
    id: 'contract-002',
    title: 'NDA - FinanceHub Partners',
    date: 'December 10, 2023',
    status: 'flagged',
    clauses: [
      {
        id: 'clause-nda-001',
        title: 'Duration of Confidentiality',
        text: 'Information shall remain confidential for 3 years.',
        riskLevel: 'high',
        explanation: 'Too short for financial data.',
        recommendation: 'Extend to 5-7 years minimum.',
      },
    ],
    summary: {
      totalClauses: 4,
      criticalIssues: 0,
      highIssues: 1,
      mediumIssues: 1,
    },
  },
  {
    id: 'contract-003',
    title: 'License Agreement - SoftWare Solutions',
    date: 'November 22, 2023',
    status: 'approved',
    clauses: [],
    summary: {
      totalClauses: 8,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
    },
  },
]

export const MOCK_AI_RESPONSES = [
  'Based on my analysis, the limitation of liability clause is the highest priority concern. I recommend adding a cap on liability.',
  'The indemnification section appears overly broad. Consider narrowing it to direct negligence only.',
  'This contract looks fairly standard for a service agreement. The main risks are in the termination and IP sections.',
  'The data protection clause is well-written and GDPR compliant. No major concerns there.',
  'Have you considered adding a specific dispute resolution mechanism (arbitration vs litigation)?',
  'The financial terms seem reasonable, but ensure payment terms are clearly specified in a schedule.',
  'I notice there\'s no force majeure clause. You may want to add one for unforeseen circumstances.',
]
