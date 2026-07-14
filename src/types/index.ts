// ============ USER & AUTH TYPES ============

export type UserRole = 'farmer' | 'vet';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  email: string;
  avatar_url: string | null;
  location: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  is_vet_complete?: boolean;
}

export interface Farmer {
  id: string;
  profile_id: string;
  farm_name: string | null;
  livestock_types: string[];
  district: string | null;
  notes: string | null;
}

export interface Veterinarian {
  id: string;
  profile_id: string;
  qualification: string;
  license_number: string | null;
  specializations: string[];
  bio: string | null;
  region: string | null;
  consultation_fee: number | null;
  consultation_methods: string[];
  verification_status: VerificationStatus;
  available_now: boolean;
  rating_average: number;
  total_reviews: number;
  profile?: Profile;
}

// ============ ANIMAL TYPES ============

export interface Animal {
  id: string;
  farmer_id: string;
  tag_number: string | null;
  species: string;
  breed: string | null;
  age: string | null;
  sex: 'male' | 'female' | 'unknown';
  notes: string | null;
  created_at: string;
}

// ============ ASSESSMENT TYPES ============

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type MessageRole = 'user' | 'assistant';

export interface Assessment {
  id: string;
  farmer_id: string;
  animal_id: string | null;
  raw_farmer_input: string;
  structured_symptoms: Record<string, any> | null;
  ai_summary: string;
  likely_condition: string;
  certainty_level: string;
  possible_causes: string[];
  suggested_next_steps: string[];
  prevention_tips: string[];
  urgency_level: UrgencyLevel;
  disclaimer: string;
  created_at: string;
  animal?: Animal;
  shared?: boolean;
}

export interface AssessmentMessage {
  id: string;
  assessment_id: string;
  role: MessageRole;
  message: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

// ============ VET SHARING TYPES ============

export type ShareStatus = 'pending' | 'viewed' | 'responded';

export interface VetShare {
  id: string;
  assessment_id: string;
  vet_id: string;
  farmer_id: string;
  shared_at: string;
  status: ShareStatus;
  assessment?: Assessment;
  farmer?: Profile;
}

// ============ CHAT TYPES ============

export type MessageType = 'text' | 'assessment_share' | 'image';

export interface Chat {
  id: string;
  farmer_id: string;
  vet_id: string;
  created_at: string;
  last_message_at: string;
  last_message?: string;
  other_user?: Profile;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  message_type: MessageType;
  related_assessment_id: string | null;
  created_at: string;
}

// ============ BOOKING TYPES ============

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type BookingType = 'chat' | 'call' | 'video' | 'in_person';

export interface Booking {
  id: string;
  farmer_id: string;
  vet_id: string;
  assessment_id: string | null;
  booking_type: BookingType;
  status: BookingStatus;
  scheduled_at: string;
  notes: string | null;
}

// ============ REVIEW TYPES ============

export interface Review {
  id: string;
  farmer_id: string;
  vet_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  farmer?: Profile;
}

// ============ NOTIFICATION TYPES ============

export type NotificationType =
  | 'chat_message'
  | 'vet_reply'
  | 'booking_update'
  | 'assessment_shared'
  | 'reminder'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

// ============ VET AVAILABILITY TYPES ============

export interface VetAvailability {
  id: string;
  vet_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

// ============ NAVIGATION TYPES ============

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  FarmerTabs: undefined;
  VetTabs: undefined;
  Legal: { type: 'privacy' | 'terms' };
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type FarmerTabParamList = {
  Home: undefined;
  Chats: undefined;
  Vets: undefined;
  Profile: undefined;
};

export type VetTabParamList = {
  Dashboard: undefined;
  Requests: undefined;
  Chats: undefined;
  Availability: undefined;
  VetProfile: undefined;
};

export type FarmerStackParamList = {
  FarmerHome: undefined;
  AssistantChat: undefined;
  AssessmentResult: { assessmentId: string };
  SavedAssessments: undefined;
  VetProfileView: { vetId: string };
  ChatWithVet: { chatId?: string; vetId?: string };
  Notifications: undefined;
  FarmerProfile: undefined;
};

export type VetStackParamList = {
  VetDashboard: undefined;
  FarmerRequests: undefined;
  SharedReports: undefined;
  SharedReportDetail: { shareId: string };
  VetChatScreen: { chatId: string };
  VetAvailability: undefined;
  VetProfileManagement: undefined;
  VetReviews: undefined;
  VetOnboarding: undefined;
};
