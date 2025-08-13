import { supabase } from './supabaseClient';

export class LessonProgressService {
  // Mark a lesson as completed
  static async markLessonAsCompleted(userId, lessonId, courseId) {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          course_id: courseId,
          is_completed: true,
          completed_at: new Date().toISOString(),
          last_watched_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) {
        console.error('Error marking lesson as completed:', error);
        throw error;
      }

      // Update enrollment progress
      await this.updateEnrollmentProgress(userId, courseId);

      return data;
    } catch (error) {
      console.error('Error in markLessonAsCompleted:', error);
      throw error;
    }
  }

  // Mark a lesson as incomplete
  static async markLessonAsIncomplete(userId, lessonId, courseId) {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          course_id: courseId,
          is_completed: false,
          completed_at: null,
          last_watched_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) {
        console.error('Error marking lesson as incomplete:', error);
        throw error;
      }

      // Update enrollment progress
      await this.updateEnrollmentProgress(userId, courseId);

      return data;
    } catch (error) {
      console.error('Error in markLessonAsIncomplete:', error);
      throw error;
    }
  }

  // Get lesson progress for a user in a course
  static async getLessonProgress(userId, courseId) {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error fetching lesson progress:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getLessonProgress:', error);
      throw error;
    }
  }

  // Check if a specific lesson is completed
  static async isLessonCompleted(userId, lessonId) {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('is_completed')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking lesson completion:', error);
        throw error;
      }

      return data?.is_completed || false;
    } catch (error) {
      console.error('Error in isLessonCompleted:', error);
      return false;
    }
  }

  // Update enrollment progress percentage
  static async updateEnrollmentProgress(userId, courseId) {
    try {
      // Get total lessons in the course
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        throw lessonsError;
      }

      const totalLessons = lessonsData?.length || 0;

      if (totalLessons === 0) {
        return;
      }

      // Get completed lessons
      const { data: completedData, error: completedError } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('is_completed', true);

      if (completedError) {
        console.error('Error fetching completed lessons:', completedError);
        throw completedError;
      }

      const completedLessons = completedData?.length || 0;
      const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

      // Update enrollment progress
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .update({
          progress_percentage: progressPercentage,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (enrollmentError) {
        console.error('Error updating enrollment progress:', enrollmentError);
        throw enrollmentError;
      }

      return progressPercentage;
    } catch (error) {
      console.error('Error in updateEnrollmentProgress:', error);
      throw error;
    }
  }

  // Get course completion status
  static async getCourseCompletionStatus(userId, courseId) {
    try {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        throw lessonsError;
      }

      const totalLessons = lessonsData?.length || 0;

      if (totalLessons === 0) {
        return { completed: 0, total: 0, percentage: 0 };
      }

      const { data: completedData, error: completedError } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('is_completed', true);

      if (completedError) {
        console.error('Error fetching completed lessons:', completedError);
        throw completedError;
      }

      const completedLessons = completedData?.length || 0;
      const percentage = Math.round((completedLessons / totalLessons) * 100);

      return {
        completed: completedLessons,
        total: totalLessons,
        percentage: percentage
      };
    } catch (error) {
      console.error('Error in getCourseCompletionStatus:', error);
      return { completed: 0, total: 0, percentage: 0 };
    }
  }
}
