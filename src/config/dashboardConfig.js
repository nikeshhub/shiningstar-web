import React from 'react';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  EventNote as EventNoteIcon,
  Inventory as InventoryIcon,
  Notifications as NotificationsIcon,
  Class as ClassIcon,
  Schedule as ScheduleIcon,
  HowToReg as HowToRegIcon,
  TrendingUp as TrendingUpIcon,
  MenuBook as MenuBookIcon,
  FamilyRestroom as FamilyIcon,
  ManageAccounts as ManageAccountsIcon,
  PersonAddAlt1 as PersonAddAlt1Icon,
} from '@mui/icons-material';

import DashboardHome from '../pages/DashboardHome';
import StudentList from '../pages/Students/StudentList';
import StudentForm from '../pages/Students/StudentForm';
import Promotion from '../pages/Students/Promotion';
import StudentDetail from '../pages/Students/StudentDetail';
import FeeManagement from '../pages/Fee/FeeManagement';
import FeeChargePage from '../pages/Fee/FeeChargePage';
import FeePaymentPage from '../pages/Fee/FeePaymentPage';
import FamilyList from '../pages/Family/FamilyList';
import FamilyForm from '../pages/Family/FamilyForm';
import FamilyDetail from '../pages/Family/FamilyDetail';
import FamilyLedger from '../pages/Family/FamilyLedger';
import AttendanceMark from '../pages/Attendance/AttendanceMark';
import AttendanceList from '../pages/Attendance/AttendanceList';
import ClassList from '../pages/Classes/ClassList';
import ClassDetail from '../pages/Classes/ClassDetail';
import ClassFormPage from '../pages/Classes/ClassFormPage';
import SubjectList from '../pages/Subjects/SubjectList';
import SubjectFormPage from '../pages/Subjects/SubjectFormPage';
import TeacherList from '../pages/Teachers/TeacherList';
import TeacherDetail from '../pages/Teachers/TeacherDetail';
import TeacherFormPage from '../pages/Teachers/TeacherFormPage';
import InventoryList from '../pages/Inventory/InventoryList';
import InventoryFormPage from '../pages/Inventory/InventoryFormPage';
import NotificationList from '../pages/Notifications/NotificationList';
import NotificationFormPage from '../pages/Notifications/NotificationFormPage';
import TimetableEditor from '../pages/Timetable/TimetableEditor';
import TeacherAttendanceDevice from '../pages/TeacherAttendance/TeacherAttendanceDevice';
import ParentDashboard from '../pages/Parent/ParentDashboard';
import ParentChildDetail from '../pages/Parent/ParentChildDetail';
import SuperAdminDashboardHome from '../pages/SuperAdmin/SuperAdminDashboardHome';
import SuperAdminUsers from '../pages/SuperAdmin/SuperAdminUsers';
import SuperAdminProvisioning from '../pages/SuperAdmin/SuperAdminProvisioning';

export const dashboardNavigationSections = [
  {
    label: 'OVERVIEW',
    items: [
      { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard', roles: ['Admin', 'Teacher'] },
    ],
  },
  {
    label: 'ACADEMIC',
    items: [
      { text: 'Students', icon: PeopleIcon, path: '/dashboard/students', roles: ['Admin', 'Teacher'] },
      { text: 'Classes', icon: ClassIcon, path: '/dashboard/classes', roles: ['Admin', 'Teacher'] },
      { text: 'Subjects', icon: MenuBookIcon, path: '/dashboard/subjects', roles: ['Admin', 'Teacher'] },
      { text: 'Teachers', icon: SchoolIcon, path: '/dashboard/teachers', roles: ['Admin'] },
      { text: 'Attendance', icon: EventNoteIcon, path: '/dashboard/attendance', roles: ['Admin', 'Teacher'] },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { text: 'Families', icon: FamilyIcon, path: '/dashboard/families', roles: ['Admin'] },
      { text: 'Promotion', icon: TrendingUpIcon, path: '/dashboard/students/promote', roles: ['Admin'] },
      { text: 'Fee Management', icon: PaymentIcon, path: '/dashboard/fee', roles: ['Admin'] },
      { text: 'Teacher Attendance', icon: HowToRegIcon, path: '/dashboard/teacher-attendance', roles: ['Admin'] },
      { text: 'Inventory', icon: InventoryIcon, path: '/dashboard/inventory', roles: ['Admin'] },
      { text: 'Timetable', icon: ScheduleIcon, path: '/dashboard/timetable', roles: ['Admin', 'Teacher'] },
      { text: 'Notifications', icon: NotificationsIcon, path: '/dashboard/notifications', roles: ['Admin'] },
    ],
  },
];

export const dashboardRouteDefinitions = [
  { index: true, element: DashboardHome, allowedRoles: ['Admin', 'Teacher'], title: 'Dashboard' },
  { path: 'students', element: StudentList, allowedRoles: ['Admin', 'Teacher'], title: 'Students' },
  { path: 'students/add', element: StudentForm, allowedRoles: ['Admin'], title: 'Add Student' },
  { path: 'students/promote', element: Promotion, allowedRoles: ['Admin'], title: 'Promotion' },
  { path: 'students/edit/:id', element: StudentForm, allowedRoles: ['Admin'], title: 'Edit Student' },
  { path: 'students/:id', element: StudentDetail, allowedRoles: ['Admin', 'Teacher'], title: 'Student Details' },
  { path: 'fee', element: FeeManagement, allowedRoles: ['Admin'], title: 'Fee Management' },
  { path: 'families', element: FamilyList, allowedRoles: ['Admin'], title: 'Families' },
  { path: 'families/create', element: FamilyForm, allowedRoles: ['Admin'], title: 'Create Family' },
  { path: 'families/edit/:id', element: FamilyForm, allowedRoles: ['Admin'], title: 'Edit Family' },
  { path: 'families/:id', element: FamilyDetail, allowedRoles: ['Admin'], title: 'Family Details' },
  { path: 'families/:id/ledger', element: FamilyLedger, allowedRoles: ['Admin'], title: 'Family Fee Ledger' },
  { path: 'families/:id/charge', element: FeeChargePage, allowedRoles: ['Admin'], title: 'Family Charge' },
  { path: 'families/:id/payment', element: FeePaymentPage, allowedRoles: ['Admin'], title: 'Family Payment' },
  { path: 'attendance', element: AttendanceList, allowedRoles: ['Admin', 'Teacher'], title: 'Attendance' },
  { path: 'attendance/mark', element: AttendanceMark, allowedRoles: ['Admin', 'Teacher'], title: 'Mark Attendance' },
  { path: 'classes', element: ClassList, allowedRoles: ['Admin', 'Teacher'], title: 'Classes' },
  { path: 'classes/add', element: ClassFormPage, allowedRoles: ['Admin'], title: 'Add Class' },
  { path: 'classes/edit/:id', element: ClassFormPage, allowedRoles: ['Admin'], title: 'Edit Class' },
  { path: 'classes/:id', element: ClassDetail, allowedRoles: ['Admin', 'Teacher'], title: 'Class Details' },
  { path: 'subjects', element: SubjectList, allowedRoles: ['Admin', 'Teacher'], title: 'Subjects' },
  { path: 'subjects/add', element: SubjectFormPage, allowedRoles: ['Admin'], title: 'Add Subject' },
  { path: 'subjects/edit/:id', element: SubjectFormPage, allowedRoles: ['Admin'], title: 'Edit Subject' },
  { path: 'teachers', element: TeacherList, allowedRoles: ['Admin'], title: 'Teachers' },
  { path: 'teachers/add', element: TeacherFormPage, allowedRoles: ['Admin'], title: 'Add Teacher' },
  { path: 'teachers/edit/:id', element: TeacherFormPage, allowedRoles: ['Admin'], title: 'Edit Teacher' },
  { path: 'teachers/:id', element: TeacherDetail, allowedRoles: ['Admin'], title: 'Teacher Details' },
  { path: 'inventory', element: InventoryList, allowedRoles: ['Admin'], title: 'Inventory' },
  { path: 'inventory/add', element: InventoryFormPage, allowedRoles: ['Admin'], title: 'Add Inventory' },
  { path: 'inventory/edit/:id', element: InventoryFormPage, allowedRoles: ['Admin'], title: 'Edit Inventory' },
  { path: 'notifications', element: NotificationList, allowedRoles: ['Admin'], title: 'Notifications' },
  { path: 'notifications/add', element: NotificationFormPage, allowedRoles: ['Admin'], title: 'Add Notification' },
  { path: 'notifications/edit/:id', element: NotificationFormPage, allowedRoles: ['Admin'], title: 'Edit Notification' },
  { path: 'timetable', element: TimetableEditor, allowedRoles: ['Admin', 'Teacher'], title: 'Timetable' },
  { path: 'teacher-attendance', element: TeacherAttendanceDevice, allowedRoles: ['Admin'], title: 'Teacher Attendance' },
];

export const parentRouteDefinitions = [
  { index: true, element: ParentDashboard, title: 'Parent Portal' },
  { path: 'children/:id', element: ParentChildDetail, title: 'Child Details' },
];

export const superAdminNavigationSections = [
  {
    label: 'OVERVIEW',
    items: [
      { text: 'Dashboard', icon: DashboardIcon, path: '/superadmin', roles: ['SuperAdmin'] },
    ],
  },
  {
    label: 'ACCESS',
    items: [
      { text: 'Users', icon: ManageAccountsIcon, path: '/superadmin/users', roles: ['SuperAdmin'] },
      { text: 'Provisioning', icon: PersonAddAlt1Icon, path: '/superadmin/provisioning', roles: ['SuperAdmin'] },
    ],
  },
];

export const superAdminRouteDefinitions = [
  { index: true, element: SuperAdminDashboardHome, title: 'Dashboard' },
  { path: 'users', element: SuperAdminUsers, title: 'Users' },
  { path: 'provisioning', element: SuperAdminProvisioning, title: 'Provisioning' },
];

const findBestNavigationMatch = (sections, normalizedPath) => sections
  .flatMap((section) => section.items)
  .filter((item) => normalizedPath === item.path || normalizedPath.startsWith(`${item.path}/`))
  .sort((left, right) => right.path.length - left.path.length)[0];

export function getDashboardTitle(pathname) {
  const normalizedPath = pathname.replace(/\/$/, '') || '/dashboard';
  const navigationItem = findBestNavigationMatch(dashboardNavigationSections, normalizedPath);

  if (navigationItem) {
    return navigationItem.text;
  }

  const routeTitle = dashboardRouteDefinitions.find((route) => {
    if (route.index) {
      return normalizedPath === '/dashboard';
    }

    const routePath = `/dashboard/${route.path}`;
    const routePattern = new RegExp(`^${routePath.replace(/:[^/]+/g, '[^/]+')}$`);
    return routePattern.test(normalizedPath);
  });

  return routeTitle?.title || 'Dashboard';
}

export function getSuperAdminTitle(pathname) {
  const normalizedPath = pathname.replace(/\/$/, '') || '/superadmin';
  const navigationItem = findBestNavigationMatch(superAdminNavigationSections, normalizedPath);

  if (navigationItem) {
    return navigationItem.text;
  }

  const routeTitle = superAdminRouteDefinitions.find((route) => {
    if (route.index) {
      return normalizedPath === '/superadmin';
    }

    const routePath = `/superadmin/${route.path}`;
    const routePattern = new RegExp(`^${routePath.replace(/:[^/]+/g, '[^/]+')}$`);
    return routePattern.test(normalizedPath);
  });

  return routeTitle?.title || 'SuperAdmin';
}

export function renderRouteElement(Component) {
  return <Component />;
}
