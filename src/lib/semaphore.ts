import { Identity } from "@semaphore-protocol/identity";
import { ZKProof } from "@/types";

export class SemaphoreService {
  private identity: Identity | null = null;
  private members: string[] = [];

  constructor() {
    // Simplified constructor without Group dependency
  }

  generateIdentity(): Identity {
    this.identity = new Identity();
    return this.identity;
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  async addMember(commitment: string): Promise<void> {
    this.members.push(commitment);
  }

  async generateProof(
    externalNullifier: string,
    signal: string
  ): Promise<ZKProof> {
    if (!this.identity) {
      throw new Error("Identity not generated");
    }

    // For now, we'll create a mock proof structure
    // In a real implementation, you would use the actual Semaphore proof generation
    const mockProof: ZKProof = {
      proof: [1, 2, 3, 4, 5, 6, 7, 8], // Mock proof array
      publicSignals: [1, 2, 3], // Mock public signals
      nullifierHash: externalNullifier,
    };

    return mockProof;
  }

  getGroupRoot(): string {
    // Mock group root for static export
    return "mock-group-root";
  }

  getGroupSize(): number {
    return this.members.length;
  }

  getCommitment(): string | null {
    return this.identity ? this.identity.commitment.toString() : null;
  }
}

// Singleton instance
let semaphoreService: SemaphoreService | null = null;

export const getSemaphoreService = (): SemaphoreService => {
  if (!semaphoreService) {
    semaphoreService = new SemaphoreService();
  }
  return semaphoreService;
}; 