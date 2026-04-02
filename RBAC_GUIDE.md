# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This application implements comprehensive Role-Based Access Control (RBAC) on the frontend to manage user permissions and UI visibility based on user roles.

## User Roles

The system supports three primary roles:

1. **Admin** - Full access to all features
   - Red badge color (#d32f2f)

2. **Teacher** - Limited access to student and academic management
   - Blue badge color (#1976d2)

3. **Parent** - View-only access to their children's information
   - Green badge color (#2e7d32)

## Key Components

### 1. AuthContext (`src/context/AuthContext.jsx`)

Provides authentication and authorization functionality:

```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, hasRole, hasPermission } = useAuth();

  // Check if user has a specific role
  const isAdmin = hasRole('Admin');

  // Check if user has permission for an action
  const canEdit = hasPermission('students', 'edit');

  return ...;
}
```

**Available methods:**
- `hasRole(...roles)` - Check if user has one of the specified roles
- `hasPermission(module, action)` - Check if user can perform action on module
- `login(identifier, password)` - Authenticate user
- `logout()` - Log out current user
- `updateUser(userData)` - Update user data

### 2. ProtectedRoute (`src/components/ProtectedRoute.jsx`)

Protects routes from unauthorized access:

```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route
  path="/admin-only"
  element={
    <ProtectedRoute allowedRoles={['Admin']}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

**Features:**
- Redirects unauthenticated users to login
- Redirects unauthorized users to their default dashboard
- Shows loading spinner during auth check

### 3. RoleBasedAccess (`src/components/common/RoleBasedAccess.jsx`)

Conditional rendering based on roles and permissions:

```jsx
import { RoleBasedAccess } from './components/common';

function MyComponent() {
  return (
    <div>
      {/* Only visible to Admin */}
      <RoleBasedAccess allowedRoles="Admin">
        <Button>Delete Student</Button>
      </RoleBasedAccess>

      {/* Visible to Admin and Teacher */}
      <RoleBasedAccess allowedRoles={['Admin', 'Teacher']}>
        <Button>Edit Student</Button>
      </RoleBasedAccess>

      {/* Permission-based access */}
      <RoleBasedAccess module="students" action="create">
        <Button>Add New Student</Button>
      </RoleBasedAccess>

      {/* With fallback content */}
      <RoleBasedAccess
        allowedRoles="Admin"
        fallback={<Typography>Access Denied</Typography>}
      >
        <SecretContent />
      </RoleBasedAccess>
    </div>
  );
}
```

### 4. Custom Hooks

**useHasRole** - Check if user has specific role(s):
```jsx
import { useHasRole } from './components/common';

function MyComponent() {
  const isAdmin = useHasRole('Admin');
  const isTeacherOrAdmin = useHasRole('Admin', 'Teacher');

  return isAdmin ? <AdminTools /> : <UserTools />;
}
```

**useHasPermission** - Check specific permissions:
```jsx
import { useHasPermission } from './components/common';

function StudentList() {
  const canDelete = useHasPermission('students', 'delete');
  const canEdit = useHasPermission('students', 'edit');

  return (
    <Table>
      {/* ... */}
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </Table>
  );
}
```

**useUserRole** - Get current user's role:
```jsx
import { useUserRole } from './components/common';

function MyComponent() {
  const role = useUserRole();

  return <Typography>Welcome, {role}!</Typography>;
}
```

## Permissions Configuration

### Available Modules (`src/config/permissions.js`)

```javascript
MODULES = {
  STUDENTS: 'students',
  FAMILIES: 'families',
  CLASSES: 'classes',
  SUBJECTS: 'subjects',
  TEACHERS: 'teachers',
  ATTENDANCE: 'attendance',
  EXAMS: 'exams',
  FEES: 'fees',
  INVENTORY: 'inventory',
  NOTIFICATIONS: 'notifications',
  TIMETABLE: 'timetable',
  TEACHER_ATTENDANCE: 'teacher_attendance',
  PROGRESS_REPORTS: 'progress_reports',
}
```

### Available Actions

```javascript
ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  EXPORT: 'export',
  MANAGE: 'manage', // Full access
}
```

### Role Permissions Matrix

| Module | Admin | Teacher | Parent |
|--------|-------|---------|--------|
| Students | Full | View, Create, Edit | View (own children) |
| Families | Full | None | View (own) |
| Classes | Full | View | View |
| Subjects | Full | View | View |
| Teachers | Full | None | View |
| Attendance | Full | View, Create, Edit | View (own children) |
| Exams | Full | View, Edit | View (own children) |
| Fees | Full | None | View (own) |
| Inventory | Full | None | None |
| Notifications | Full | View | View |
| Timetable | Full | View | View |
| Teacher Attendance | Full | None | None |
| Progress Reports | Full | View, Create | View (own children) |

## Dashboard Sidebar

The sidebar automatically filters menu items based on the user's role. Menu items are defined with role restrictions:

```javascript
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['Admin', 'Teacher'] },
  { text: 'Students', icon: <PeopleIcon />, path: '/dashboard/students', roles: ['Admin', 'Teacher'] },
  { text: 'Families', icon: <FamilyIcon />, path: '/dashboard/families', roles: ['Admin'] },
  // ...
];
```

## Usage Examples

### Example 1: Conditional Button Visibility

```jsx
import { RoleBasedAccess } from '../components/common';
import { Button } from '@mui/material';

function StudentListActions({ student }) {
  return (
    <Box>
      {/* All users with access can view */}
      <Button variant="outlined">View Details</Button>

      {/* Only Admin and Teacher can edit */}
      <RoleBasedAccess allowedRoles={['Admin', 'Teacher']}>
        <Button variant="contained">Edit</Button>
      </RoleBasedAccess>

      {/* Only Admin can delete */}
      <RoleBasedAccess allowedRoles="Admin">
        <Button variant="contained" color="error">Delete</Button>
      </RoleBasedAccess>

      {/* Only Admin can promote */}
      <RoleBasedAccess module="students" action="manage">
        <Button variant="contained" color="secondary">Promote</Button>
      </RoleBasedAccess>
    </Box>
  );
}
```

### Example 2: Form Field Restrictions

```jsx
import { useHasRole } from '../components/common';

function StudentForm() {
  const isAdmin = useHasRole('Admin');
  const canEditStatus = isAdmin;

  return (
    <form>
      <TextField name="name" label="Student Name" />
      <TextField name="class" label="Class" />

      {/* Only admin can change student status */}
      {canEditStatus && (
        <Select name="status" label="Status">
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      )}
    </form>
  );
}
```

### Example 3: Dynamic Page Content

```jsx
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/permissions';

function DashboardHome() {
  const { user } = useAuth();

  return (
    <div>
      <Typography variant="h4">
        Welcome, {user.username}!
      </Typography>

      {user.role === ROLES.ADMIN && <AdminDashboard />}
      {user.role === ROLES.TEACHER && <TeacherDashboard />}
      {user.role === ROLES.PARENT && <ParentDashboard />}
    </div>
  );
}
```

### Example 4: Menu Items with Permissions

```jsx
import { RoleBasedAccess } from '../components/common';
import { Menu, MenuItem } from '@mui/material';

function ActionsMenu({ student }) {
  return (
    <Menu>
      <MenuItem>View Details</MenuItem>

      <RoleBasedAccess allowedRoles={['Admin', 'Teacher']}>
        <MenuItem>Edit Student</MenuItem>
      </RoleBasedAccess>

      <RoleBasedAccess allowedRoles="Admin">
        <MenuItem>Delete Student</MenuItem>
      </RoleBasedAccess>

      <RoleBasedAccess module="fees" action="view">
        <MenuItem>View Fee Ledger</MenuItem>
      </RoleBasedAccess>
    </Menu>
  );
}
```

## Route Protection

All protected routes are defined in `App.js`. Here's how they're structured:

```jsx
// Admin-only routes
<Route path="/dashboard/families" element={
  <ProtectedRoute allowedRoles={['Admin']}>
    <FamilyList />
  </ProtectedRoute>
} />

// Admin and Teacher routes
<Route path="/dashboard/students" element={
  <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
    <StudentList />
  </ProtectedRoute>
} />

// Parent-only routes
<Route path="/parent" element={
  <ProtectedRoute allowedRoles={['Parent']}>
    <ParentDashboard />
  </ProtectedRoute>
} />
```

## Best Practices

1. **Always check permissions on both frontend and backend**
   - Frontend RBAC is for UX only
   - Backend must enforce all security rules

2. **Use RoleBasedAccess for UI elements**
   - Hide features users can't access
   - Provide better UX than showing disabled buttons

3. **Use ProtectedRoute for pages**
   - Prevent navigation to unauthorized pages
   - Automatic redirection to appropriate dashboard

4. **Be specific with permissions**
   - Use module + action combinations when possible
   - More granular than role-only checks

5. **Handle loading states**
   - Auth context provides loading state
   - Show loading spinner during auth check

6. **Test with different roles**
   - Login as Admin, Teacher, and Parent
   - Verify correct permissions and UI visibility

## Troubleshooting

### Issue: Menu items still showing for wrong role
- Check that menu items have `roles` array defined
- Verify user object has correct `role` property
- Clear localStorage and login again

### Issue: ProtectedRoute redirecting incorrectly
- Check `getDefaultRoute()` function in AuthContext
- Verify route paths match exactly
- Check browser console for errors

### Issue: Permissions not working
- Ensure user object includes role
- Check ROLE_PERMISSIONS configuration
- Verify module and action names match exactly

## Security Notes

⚠️ **Important:** Frontend RBAC is for user experience only. Always enforce permissions on the backend API. Never trust client-side checks for security.

The backend already implements role-based authentication using middleware:
```javascript
// Example from backend
router.post('/students', authenticate, authorize('Admin', 'Teacher'), createStudent);
```

## Summary

This RBAC implementation provides:
- ✅ Role-based route protection
- ✅ Conditional UI rendering
- ✅ Permission-based feature access
- ✅ Clean, reusable components
- ✅ Comprehensive hooks and utilities
- ✅ Easy to maintain and extend

For questions or issues, refer to the component documentation or check the examples above.
