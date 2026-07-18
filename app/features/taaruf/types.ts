export interface ProcessLog {
  id: number;
  prosesId: number;
  status: string;
  keterangan: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessDetails {
  id: number;
  requesterUserId: number;
  targetUserId: number;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  requesterName: string;
  targetName: string;
  logs: ProcessLog[];
}

export interface TaarufProcessOtherUser {
  id: number;
  name: string | null;
  image: string | null;
  kodeUser: string | null;
  gender: string | null;
  kotaNama: string | null;
}

export interface TaarufProcess {
  id: number;
  requesterUserId: number;
  targetUserId: number;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  requesterName: string | null;
  requesterImage: string | null;
  requesterKode: string | null;
  requesterGender: string | null;
  requesterKota: string | null;
  otherUser: TaarufProcessOtherUser;
}

export interface TaarufProsesAdmin {
  id: number;
  requesterUserId: number;
  targetUserId: number;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  requester: {
    name: string | null;
    kodeUser: string | null;
  };
  target: {
    name: string | null;
    kodeUser: string | null;
  };
}
