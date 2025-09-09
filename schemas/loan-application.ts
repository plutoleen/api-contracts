import { LoanApplication, ApplicationStatus, LoanData } from '../types/loan';

const createApplication = (userId: string) => {
  const newApplication: Omit<LoanApplication, 'id'> = {
    userId,
    name: `${new Date().toISOString()} - New Application`,
    status: 'draft',
    // currentStep: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      // documents: [],
      selectedFunds: [],
      personalInfo: {},
      loanTerms: {},
      contract: null,
    },
  };
  return newApplication;
};

const updateApplication = (
  applicationId: string,
  data: Partial<LoanData>, //can be selectedFunds, personalInfo, loanTerms, or contract
  status: ApplicationStatus //can be draft, pending, manual_review, offered, accepted, rejected, cancelled
): Partial<LoanApplication> => {
  const updateObject = {
    data,
    status,
  };
  return updateObject;
};

export { createApplication, updateApplication };
