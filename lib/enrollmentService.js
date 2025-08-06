import { supabase } from './supabaseClient';

export class EnrollmentService {
  // Check if user is enrolled in a course
  static async isEnrolled(userId, courseId) {
    if (!userId || !courseId) return false;
    
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking enrollment:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }
  }

  // Enroll user in a course
  static async enrollUser(userId, courseId) {
    if (!userId || !courseId) {
      throw new Error('User ID and Course ID are required');
    }
    
    try {
      // First check if already enrolled
      const isAlreadyEnrolled = await this.isEnrolled(userId, courseId);
      if (isAlreadyEnrolled) {
        return { success: true, message: 'Already enrolled' };
      }

      // Get course details to check if it's free
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('is_free, title')
        .eq('id', courseId)
        .single();

      if (courseError) {
        throw new Error('Course not found');
      }

      // Only allow enrollment for free courses
      if (!course.is_free) {
        throw new Error('Only free courses can be enrolled in directly');
      }

      // Create enrollment record
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          enrolled_at: new Date().toISOString(),
          progress_percentage: 0,
          last_accessed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error enrolling user:', error);
        throw new Error('Failed to enroll in course');
      }

      return { 
        success: true, 
        data, 
        message: `Successfully enrolled in ${course.title}` 
      };
    } catch (error) {
      console.error('Enrollment error:', error);
      throw error;
    }
  }

  // Get user's enrolled courses
  static async getUserEnrollments(userId) {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            thumbnail_url,
            instructor_id,
            duration_minutes,
            total_lessons,
            price,
            level,
            tags,
            rating,
            is_free,
            is_premium
          )
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false });

      if (error) {
        console.error('Error fetching enrollments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
  }

  // Get enrollment progress for a specific course
  static async getEnrollmentProgress(userId, courseId) {
    if (!userId || !courseId) return null;
    
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (error) {
        console.error('Error fetching enrollment progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching enrollment progress:', error);
      return null;
    }
  }

  // Update enrollment progress
  static async updateEnrollmentProgress(userId, courseId, progressPercentage) {
    if (!userId || !courseId) return false;
    
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({
          progress_percentage: progressPercentage,
          last_accessed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error updating enrollment progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
      return false;
    }
  }

  // Complete course enrollment
  static async completeEnrollment(userId, courseId) {
    if (!userId || !courseId) return false;
    
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({
          completed_at: new Date().toISOString(),
          progress_percentage: 100
        })
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error completing enrollment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error completing enrollment:', error);
      return false;
    }
  }
} 