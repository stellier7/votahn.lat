export interface User {
  id: string;
  email?: string;
  walletAddress?: string;
  phone?: string;
  kycVerified: boolean;
  kycDocuments?: {
    idDocument: string;
    selfie: string;
  };
  zkIdentity?: {
    commitment: string;
    nullifierHash: string;
  };
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  voteCount: number;
  exists: boolean;
}

export interface Vote {
  nullifierHash: string;
  candidateId: number;
  timestamp: number;
}

export interface VoteReceipt {
  receiptNumber: string;
  timestamp: number;
  candidateId: number;
}

export interface KYCData {
  idDocument: File | null;
  idDocumentBack: File | null;
  qrCode: File | null;
  selfie: File | null;
}

export interface ZKProof {
  proof: number[];
  publicSignals: number[];
  nullifierHash: string;
}

export interface VotingSession {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  candidates: Candidate[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
} 