import { PredictResponse, PredictRequest } from "@/types/prediction";

export interface DBUser {
  id: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AssessmentRecord {
  id: string;
  userId: string;
  date: string;
  request: PredictRequest;
  response: PredictResponse;
}

const initializeDB = () => {
    return {
        users: [
          { id: 'CS-ADMIN-001', name: 'System Admin', role: 'admin' }
        ] as DBUser[],
        records: [] as AssessmentRecord[],
    }
}

declare global {
  var _pseudoDb: ReturnType<typeof initializeDB> | undefined;
}

export const db = globalThis._pseudoDb || initializeDB();
if (process.env.NODE_ENV !== "production") {
  globalThis._pseudoDb = db;
}
