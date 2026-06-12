import { UserProfile } from "@/types/user";
import { submitOnboardingToBackend, getUserFromBackend } from "@/api";

export const onboardingService = {
  /**
   * Save onboarding profile data for a user to the Flask backend
   */
  async saveProfile(uid: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const payload = {
        uid,
        full_name: (profileData as any).fullName || "",
        college: (profileData as any).college || "",
        graduation_year: (profileData as any).graduationYear || "",
        current_status: (profileData as any).currentStatus || "",
        education: (profileData as any).education || "",
        role: profileData.role || "",
        experience_level: profileData.experienceLevel || "",
        skills: profileData.skills || [],
        target_role: profileData.targetRole || "",
        learning_goals: profileData.learningGoals || "",
        preferred_domain: profileData.preferredDomain || ""
      };
      const response = await submitOnboardingToBackend(payload);
      return response.data.user;
    } catch (e) {
      console.error("Failed to save profile data", e);
      throw e;
    }
  },

  /**
   * Get the current profile for a user from the Flask backend
   */
  async getProfile(uid: string): Promise<any> {
    try {
      const response = await getUserFromBackend(uid);
      return response.data.user;
    } catch (e) {
      console.error("Failed to get profile data", e);
      return null;
    }
  },

  /**
   * Check if a user has completed onboarding by checking backend status
   */
  async checkOnboardingStatus(uid: string): Promise<boolean> {
    const profile = await this.getProfile(uid);
    return !!profile?.onboarding_completed;
  }
};
