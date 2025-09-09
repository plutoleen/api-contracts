import { LoanApplication, LoanData } from '../types/loan';

const createApplication = (userId: string) => {
  const newApplication: Omit<LoanApplication, 'id'> = {
    userId,
    name: `${new Date().toISOString()} - New Application`,
    status: 'draft',
    currentStep: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      documents: [],
      selectedFunds: [],
      personalInfo: {},
      loanTerms: {},
      pledgedAssets: [],
      contract: null,
    },
  };
  return newApplication;
};

const updateApplication = (
  applicationId: string,
  data: Partial<LoanData>,
  step: number,
  complete = false
): Partial<LoanApplication> => {
  const updateObject = {
    data,
    currentStep: step,
    status: complete ? 'complete' : 'draft',
    updatedAt: new Date(),
  };
  return updateObject;
};

export { createApplication, updateApplication };
