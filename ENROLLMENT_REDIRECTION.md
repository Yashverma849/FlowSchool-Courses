# Enrollment-Based Redirection Implementation

## Overview

This implementation adds intelligent redirection logic after user authentication based on their enrollment status. The system automatically redirects users to the most appropriate page after login or signup.

## Requirements

1. **Enrolled Users (1+ courses)**: Redirect to `/my-learning` page
2. **New Users (0 courses)**: Redirect to homepage (`/`)
3. **Error Handling**: Default to homepage on any errors

## Implementation Details

### 1. Enrollment Counting Service

Added `countUserEnrollments()` method to `lib/enrollmentService.js`:

```javascript
static async countUserEnrollments(userId) {
  if (!userId) return 0;
  
  try {
    const { count, error } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error counting enrollments:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error counting enrollments:', error);
    return 0;
  }
}
```

### 2. Redirection Utility Function

Added `getPostAuthRedirectPath()` to `lib/utils.ts`:

```typescript
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
```

### 3. Authentication Flow Updates

Modified `app/auth-overlay.jsx` to use the new redirection logic:

#### Login Handler
```javascript
// Handle login
async function handleLogin(e) {
  e.preventDefault();
  setLoading(true);
  setError("");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password: loginPassword,
  });
  setLoading(false);
  if (error) {
    setError(error.message);
  } else {
    onOpenChange(false); // Close overlay
    setLoginEmail("");
    setLoginPassword("");
    
    // Get redirect path based on enrollment count
    if (data.user) {
      const redirectPath = await getPostAuthRedirectPath(data.user.id);
      router.push(redirectPath);
    }
  }
}
```

#### Signup Handler
```javascript
// Handle signup
async function handleSignup(e) {
  // ... existing validation logic ...
  
  setLoading(false);
  if (error) {
    setError(error.message);
  } else {
    onOpenChange(false); // Close overlay
    // ... clear form fields ...
    
    // Get redirect path based on enrollment count
    if (data.user) {
      const redirectPath = await getPostAuthRedirectPath(data.user.id);
      router.push(redirectPath);
    }
  }
}
```

### 4. Hook Enhancement

Added `countUserEnrollments()` method to `hooks/use-enrollment.js` for easy access:

```javascript
const countUserEnrollments = async () => {
  if (!user) return 0;
  
  try {
    return await EnrollmentService.countUserEnrollments(user.id);
  } catch (error) {
    console.error('Error counting user enrollments:', error);
    return 0;
  }
};
```

## Database Requirements

The implementation relies on the existing `enrollments` table with the following structure:

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_percentage INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  UNIQUE(user_id, course_id)
);
```

## Usage Examples

### Using the Utility Function Directly
```javascript
import { getPostAuthRedirectPath } from '@/lib/utils';

const redirectPath = await getPostAuthRedirectPath(userId);
router.push(redirectPath);
```

### Using the Hook
```javascript
import { useEnrollment } from '@/hooks/use-enrollment';

const { countUserEnrollments } = useEnrollment();
const enrollmentCount = await countUserEnrollments();
```

## Error Handling

- If enrollment counting fails, users are redirected to the homepage (`/`)
- All errors are logged to the console for debugging
- The system gracefully handles missing users or database connection issues

## Testing

To test the implementation:

1. **New User Test**: Create a new account and verify redirection to homepage
2. **Enrolled User Test**: Enroll in a course, log out, log back in, and verify redirection to `/my-learning`
3. **Error Test**: Simulate database errors and verify fallback to homepage

## Performance Considerations

- The enrollment count query uses `count: 'exact', head: true` for optimal performance
- The query only counts records, not fetching full data
- Caching could be added for frequently accessed users if needed
