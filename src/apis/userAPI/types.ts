export interface UserById {
  acceptedTermsAndConditions?: boolean | null;
  city?: string | null;
  created: string;
  creatorId: number | null;
  displayName: string;
  email: string;
  id: number;
  isCrisisTeamMember?: boolean | null;
  lastAccess: string;
  municipality?: string | null;
  municipalityname?: string | null;
  notifyChecklists: boolean;
  notifyDocuments: boolean;
  notifyMarketing?: boolean;
  notifyWithEmail?: boolean;
  onDuty?: boolean | null;
  phoneNumber: string | null;
  photoFileName: string;
  postalCode?: number | null;
  roles?: string[] | null;
  statusCode?: number | null;
  streetAddress?: string | null;
  title: string;
}
