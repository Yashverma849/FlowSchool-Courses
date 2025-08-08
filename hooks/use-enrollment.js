import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { EnrollmentService } from '@/lib/enrollmentService';

export function useEnrollment() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  // Check enrollment status for a specific course
  const checkEnrollment = async (courseId) => {
    if (!user || !courseId) return false;
    
    try {
      const isEnrolled = await EnrollmentService.isEnrolled(user.id, courseId);
      setEnrollments(prev => ({ ...prev, [courseId]: isEnrolled }));
      return isEnrolled;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }
  };

  // Enroll in a course
  const enrollInCourse = async (courseId) => {
    if (!user || !courseId) {
      throw new Error('User must be logged in to enroll');
    }

    try {
      const result = await EnrollmentService.enrollUser(user.id, courseId);
      if (result.success) {
        setEnrollments(prev => ({ ...prev, [courseId]: true }));
      }
      return result;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  };

  // Get enrollment progress for a course
  const getEnrollmentProgress = async (courseId) => {
    if (!user || !courseId) return null;
    
    try {
      return await EnrollmentService.getEnrollmentProgress(user.id, courseId);
    } catch (error) {
      console.error('Error getting enrollment progress:', error);
      return null;
    }
  };

  // Update enrollment progress
  const updateProgress = async (courseId, progressPercentage) => {
    if (!user || !courseId) return false;
    
    try {
      const success = await EnrollmentService.updateEnrollmentProgress(user.id, courseId, progressPercentage);
      if (success) {
        // Update local state if needed
        setEnrollments(prev => ({ ...prev, [courseId]: true }));
      }
      return success;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };

  // Get all user enrollments
  const getUserEnrollments = async () => {
    if (!user) return [];
    
    try {
      return await EnrollmentService.getUserEnrollments(user.id);
    } catch (error) {
      console.error('Error getting user enrollments:', error);
      return [];
    }
  };

  // Check if user is enrolled in multiple courses
  const checkMultipleEnrollments = async (courseIds) => {
    if (!user || !courseIds.length) return {};
    
    try {
      const enrollmentPromises = courseIds.map(async (courseId) => {
        const isEnrolled = await EnrollmentService.isEnrolled(user.id, courseId);
        return { courseId, isEnrolled };
      });
      
      const results = await Promise.all(enrollmentPromises);
      const enrollmentMap = {};
      results.forEach(({ courseId, isEnrolled }) => {
        enrollmentMap[courseId] = isEnrolled;
      });
      
      setEnrollments(enrollmentMap);
      return enrollmentMap;
    } catch (error) {
      console.error('Error checking multiple enrollments:', error);
      return {};
    }
  };

  // Count total enrolled courses for the current user
  const countUserEnrollments = async () => {
    if (!user) return 0;
    
    try {
      return await EnrollmentService.countUserEnrollments(user.id);
    } catch (error) {
      console.error('Error counting user enrollments:', error);
      return 0;
    }
  };

  return {
    user,
    enrollments,
    loading,
    checkEnrollment,
    enrollInCourse,
    getEnrollmentProgress,
    updateProgress,
    getUserEnrollments,
    checkMultipleEnrollments,
    countUserEnrollments,
  };
} 