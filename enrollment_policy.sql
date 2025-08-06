-- Enable Row Level Security on enrollments table
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Policy for all operations on enrollments table
CREATE POLICY "enrollments_policy"
ON "public"."enrollments"
AS PERMISSIVE
FOR ALL
TO public
USING (
  -- Users can only access their own enrollments
  auth.uid() = user_id
)
WITH CHECK (
  -- Users can only create/update enrollments for themselves
  auth.uid() = user_id
);

-- Additional policy for course instructors to view enrollments in their courses
-- (Optional - uncomment if you want instructors to see who enrolled in their courses)
/*
CREATE POLICY "instructor_enrollment_view"
ON "public"."enrollments"
AS PERMISSIVE
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = enrollments.course_id 
    AND courses.instructor_id = auth.uid()
  )
);
*/

-- Policy for admin users (if you have an admin role)
-- (Optional - uncomment if you have admin users)
/*
CREATE POLICY "admin_enrollment_access"
ON "public"."enrollments"
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
*/ 