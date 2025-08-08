import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EnrollmentService } from './enrollmentService'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to determine redirect path after login/signup based on enrollment count
export async function getPostAuthRedirectPath(userId: string): Promise<string> {
  try {
    const enrollmentCount = await EnrollmentService.countUserEnrollments(userId);
    
    // If user has 1 or more enrolled courses, redirect to my-learning
    if (enrollmentCount >= 1) {
      return '/my-learning';
    }
    
    // If user has 0 enrolled courses, redirect to homepage
    return '/';
  } catch (error) {
    console.error('Error determining redirect path:', error);
    // Default to homepage on error
    return '/';
  }
}
