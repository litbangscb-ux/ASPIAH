export type UserRole = 'EMPLOYEE' | 'MANAGEMENT' | 'COOPERATIVE';

export interface EmployeeInfo {
  name: string;
  nik: string;
  position: string;
  phone: string;
  department: string;
  salaryDeductionAuth: boolean;
}

export interface GoodsDetails {
  itemName: string;
  specification: string;
  supplierName: string;
  originalPrice: number; // Harga Asli
  downpayment: number;   // Uang Muka (DP)
  financingAmount: number; // Nilai Pembiayaan (Harga - DP)
  marginRate: number;      // Margin pertahun / perbulan (%)
  marginAmount: number;    // Jumlah Margin dalam Rupiah
  totalSellingPrice: number; // Harga Jual Koperasi (Nilai Pembiayaan + Margin)
  months: number;          // Jangka waktu (bulan)
  monthlyInstallment: number; // Cicilan per bulan
}

export interface ManagementRecommendation {
  status: 'RECOMMENDED' | 'NOT_RECOMMENDED' | 'PENDING';
  reviewerName: string;
  notes: string;
  date?: string;
}

export interface CooperativeVerification {
  status: 'APPROVED' | 'CONSIDERED' | 'REJECTED' | 'PENDING';
  verifierName: string;
  notes: string;
  date?: string;
  finalMarginRate?: number;
}

export interface AkadMurabahah {
  contractNumber: string;
  date?: string;
  isSigned: boolean;
  employeeSignature?: string; // Base64 or drawn text
  cooperativeSignature?: string; // Fuad Habibi Siregar signature
  witnessName1?: string;
  witnessSignature1?: string;
  signedAt?: string;
}

export type ApplicationStatus =
  | 'PENDING_RECOMMENDATION'
  | 'PENDING_COOPERATIVE'
  | 'APPROVED'
  | 'CONSIDERED'
  | 'REJECTED'
  | 'SIGNED';

export interface FinancingApplication {
  id: string;
  createdAt: string;
  employee: EmployeeInfo;
  goods: GoodsDetails;
  status: ApplicationStatus;
  managementRecommendation: ManagementRecommendation;
  cooperativeVerification: CooperativeVerification;
  akadMurabahah: AkadMurabahah;
}

export interface ProgramInfoSection {
  id: string;
  title: string;
  icon: string;
  content: string | string[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nik: string;
  position: string;
  department: string;
  avatarUrl?: string;
}

