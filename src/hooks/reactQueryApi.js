import {
  attendanceAPI as rawAttendanceAPI,
  authAPI as rawAuthAPI,
  classAPI as rawClassAPI,
  examAPI as rawExamAPI,
  familyAPI as rawFamilyAPI,
  feeAPI as rawFeeAPI,
  inventoryAPI as rawInventoryAPI,
  notificationAPI as rawNotificationAPI,
  progressReportAPI as rawProgressReportAPI,
  settingsAPI as rawSettingsAPI,
  studentAPI as rawStudentAPI,
  subjectAPI as rawSubjectAPI,
  teacherAPI as rawTeacherAPI,
  teacherAttendanceAPI as rawTeacherAttendanceAPI,
  timetableAPI as rawTimetableAPI,
} from "../services/api";
import { queryClient } from "../config/queryClient";
import { getApiPayload } from "./useApiHelpers";

const toSuccessResponse = (data) => ({ data: { success: true, data } });

const fetchCached = async (queryKey, fn, errorMessage) => {
  const data = await queryClient.fetchQuery({
    queryKey,
    queryFn: async () => getApiPayload(await fn(), errorMessage),
  });
  return toSuccessResponse(data);
};

const mutateWithInvalidation = async (fn, invalidateKeys = [], errorMessage) => {
  const data = await getApiPayload(await fn(), errorMessage);
  await Promise.all(
    invalidateKeys.map((queryKey) =>
      queryClient.invalidateQueries({
        queryKey,
      })
    )
  );
  return toSuccessResponse(data);
};

export const studentAPI = {
  getAll: (params) =>
    fetchCached(["students", "list", params || {}], () => rawStudentAPI.getAll(params), "Failed to fetch students"),
  getById: (id) =>
    fetchCached(["students", "detail", id], () => rawStudentAPI.getById(id), "Failed to fetch student"),
  create: (data) =>
    mutateWithInvalidation(() => rawStudentAPI.create(data), [["students"]], "Failed to create student"),
  update: (id, data) =>
    mutateWithInvalidation(() => rawStudentAPI.update(id, data), [["students"]], "Failed to update student"),
  delete: (id) =>
    mutateWithInvalidation(() => rawStudentAPI.delete(id), [["students"]], "Failed to delete student"),
  promote: (data) =>
    mutateWithInvalidation(() => rawStudentAPI.promote(data), [["students"], ["classes"]], "Failed to promote students"),
  getHistory: (id) =>
    fetchCached(["students", "history", id], () => rawStudentAPI.getHistory(id), "Failed to fetch student history"),
  updateGPS: (id, data) =>
    mutateWithInvalidation(() => rawStudentAPI.updateGPS(id, data), [["students", "detail", id]], "Failed to update student GPS"),
};

export const feeAPI = {
  createCharge: (data) =>
    mutateWithInvalidation(() => rawFeeAPI.createCharge(data), [["fee"], ["families"]], "Failed to create charge"),
  createPayment: (data) =>
    mutateWithInvalidation(() => rawFeeAPI.createPayment(data), [["fee"], ["families"]], "Failed to create payment"),
  getLedger: (familyId, params) =>
    fetchCached(["fee", "ledger", familyId, params || {}], () => rawFeeAPI.getLedger(familyId, params), "Failed to fetch fee ledger"),
  getTransaction: (id) =>
    fetchCached(["fee", "transaction", id], () => rawFeeAPI.getTransaction(id), "Failed to fetch transaction"),
  getDuesList: (params) =>
    fetchCached(["fee", "dues", params || {}], () => rawFeeAPI.getDuesList(params), "Failed to fetch dues"),
  getCollectionSummary: (params) =>
    fetchCached(["fee", "summary", params || {}], () => rawFeeAPI.getCollectionSummary(params), "Failed to fetch collection summary"),
  generateBillNumber: () =>
    fetchCached(["fee", "bill-number"], () => rawFeeAPI.generateBillNumber(), "Failed to generate bill number"),
};

export const classAPI = {
  getAll: (params) =>
    fetchCached(["classes", "list", params || {}], () => rawClassAPI.getAll(params), "Failed to fetch classes"),
  getById: (id) =>
    fetchCached(["classes", "detail", id], () => rawClassAPI.getById(id), "Failed to fetch class"),
  create: (data) =>
    mutateWithInvalidation(() => rawClassAPI.create(data), [["classes"]], "Failed to create class"),
  update: (id, data) =>
    mutateWithInvalidation(() => rawClassAPI.update(id, data), [["classes"]], "Failed to update class"),
  delete: (id) =>
    mutateWithInvalidation(() => rawClassAPI.delete(id), [["classes"]], "Failed to delete class"),
  getStudents: (id) =>
    fetchCached(["classes", "students", id], () => rawClassAPI.getStudents(id), "Failed to fetch class students"),
  getTimetable: (id) =>
    fetchCached(["classes", "timetable", id], () => rawClassAPI.getTimetable(id), "Failed to fetch class timetable"),
  setTimetable: (id, data) =>
    mutateWithInvalidation(() => rawClassAPI.setTimetable(id, data), [["classes", "timetable", id], ["timetable"]], "Failed to set class timetable"),
  updateSubjectBook: (classId, subjectId, data) =>
    mutateWithInvalidation(
      () => rawClassAPI.updateSubjectBook(classId, subjectId, data),
      [["classes", "detail", classId]],
      "Failed to update subject book"
    ),
};

export const attendanceAPI = {
  mark: (data) =>
    mutateWithInvalidation(() => rawAttendanceAPI.mark(data), [["attendance"]], "Failed to mark attendance"),
  getByDate: (params) =>
    fetchCached(["attendance", "date", params || {}], () => rawAttendanceAPI.getByDate(params), "Failed to fetch attendance by date"),
  getStudentReport: (params) =>
    fetchCached(["attendance", "student-report", params || {}], () => rawAttendanceAPI.getStudentReport(params), "Failed to fetch student report"),
  getMonthlyReport: (params) =>
    fetchCached(["attendance", "monthly-report", params || {}], () => rawAttendanceAPI.getMonthlyReport(params), "Failed to fetch monthly report"),
  getAbsentStudents: (params) =>
    fetchCached(["attendance", "absent", params || {}], () => rawAttendanceAPI.getAbsentStudents(params), "Failed to fetch absent students"),
};

export const examAPI = {
  getAll: (params) =>
    fetchCached(["exams", "list", params || {}], () => rawExamAPI.getAll(params), "Failed to fetch exams"),
  getById: (id) =>
    fetchCached(["exams", "detail", id], () => rawExamAPI.getById(id), "Failed to fetch exam"),
  create: (data) =>
    mutateWithInvalidation(() => rawExamAPI.create(data), [["exams"]], "Failed to create exam"),
  update: (id, data) =>
    mutateWithInvalidation(() => rawExamAPI.update(id, data), [["exams"]], "Failed to update exam"),
  delete: (id) =>
    mutateWithInvalidation(() => rawExamAPI.delete(id), [["exams"]], "Failed to delete exam"),
  generateNotice: (id) =>
    mutateWithInvalidation(() => rawExamAPI.generateNotice(id), [["exams", "detail", id]], "Failed to generate notice"),
  downloadNotice: (id) => rawExamAPI.downloadNotice(id),
  enterMarks: (data) => mutateWithInvalidation(() => rawExamAPI.enterMarks(data), [["exams"]], "Failed to enter marks"),
  bulkEnterMarks: (data) =>
    mutateWithInvalidation(() => rawExamAPI.bulkEnterMarks(data), [["exams"]], "Failed to bulk enter marks"),
  deleteMarks: (id) => mutateWithInvalidation(() => rawExamAPI.deleteMarks(id), [["exams"]], "Failed to delete marks"),
  getMarksheet: (params) =>
    fetchCached(["exams", "marksheet", params || {}], () => rawExamAPI.getMarksheet(params), "Failed to fetch marksheet"),
  getTerminalMarks: (params) =>
    fetchCached(["exams", "terminal", params || {}], () => rawExamAPI.getTerminalMarks(params), "Failed to fetch terminal marks"),
  getClassResult: (params) =>
    fetchCached(["exams", "class-result", params || {}], () => rawExamAPI.getClassResult(params), "Failed to fetch class result"),
};

export const inventoryAPI = {
  getAll: (params) =>
    fetchCached(["inventory", "list", params || {}], () => rawInventoryAPI.getAll(params), "Failed to fetch inventory"),
  getById: (id) =>
    fetchCached(["inventory", "detail", id], () => rawInventoryAPI.getById(id), "Failed to fetch inventory item"),
  create: (data) =>
    mutateWithInvalidation(() => rawInventoryAPI.create(data), [["inventory"]], "Failed to create inventory item"),
  update: (id, data) =>
    mutateWithInvalidation(() => rawInventoryAPI.update(id, data), [["inventory"]], "Failed to update inventory item"),
  delete: (id) =>
    mutateWithInvalidation(() => rawInventoryAPI.delete(id), [["inventory"]], "Failed to delete inventory item"),
  distribute: (data) =>
    mutateWithInvalidation(() => rawInventoryAPI.distribute(data), [["inventory"]], "Failed to distribute inventory"),
  getStudentDistributions: (studentId) =>
    fetchCached(
      ["inventory", "student-distributions", studentId],
      () => rawInventoryAPI.getStudentDistributions(studentId),
      "Failed to fetch student distributions"
    ),
  getAllDistributions: (params) =>
    fetchCached(["inventory", "all-distributions", params || {}], () => rawInventoryAPI.getAllDistributions(params), "Failed to fetch distributions"),
};

export const teacherAPI = {
  getAll: (params) =>
    fetchCached(["teachers", "list", params || {}], () => rawTeacherAPI.getAll(params), "Failed to fetch teachers"),
  getById: (id) =>
    fetchCached(["teachers", "detail", id], () => rawTeacherAPI.getById(id), "Failed to fetch teacher"),
  create: (data) =>
    mutateWithInvalidation(() => rawTeacherAPI.create(data), [["teachers"]], "Failed to create teacher"),
  update: (id, data) =>
    mutateWithInvalidation(() => rawTeacherAPI.update(id, data), [["teachers"]], "Failed to update teacher"),
  delete: (id) =>
    mutateWithInvalidation(() => rawTeacherAPI.delete(id), [["teachers"]], "Failed to delete teacher"),
};

export const subjectAPI = {
  getAll: (params) =>
    fetchCached(["subjects", "list", params || {}], () => rawSubjectAPI.getAll(params), "Failed to fetch subjects"),
  getById: (id) =>
    fetchCached(["subjects", "detail", id], () => rawSubjectAPI.getById(id), "Failed to fetch subject"),
  create: (data) =>
    mutateWithInvalidation(() => rawSubjectAPI.create(data), [["subjects"]], "Failed to create subject"),
  update: (id, data) =>
    mutateWithInvalidation(() => rawSubjectAPI.update(id, data), [["subjects"]], "Failed to update subject"),
  delete: (id) =>
    mutateWithInvalidation(() => rawSubjectAPI.delete(id), [["subjects"]], "Failed to delete subject"),
};

export const notificationAPI = {
  getAll: (params) =>
    fetchCached(["notifications", "list", params || {}], () => rawNotificationAPI.getAll(params), "Failed to fetch notifications"),
  getById: (id) =>
    fetchCached(["notifications", "detail", id], () => rawNotificationAPI.getById(id), "Failed to fetch notification"),
  create: (data) =>
    mutateWithInvalidation(() => rawNotificationAPI.create(data), [["notifications"]], "Failed to create notification"),
  update: (id, data) =>
    mutateWithInvalidation(() => rawNotificationAPI.update(id, data), [["notifications"]], "Failed to update notification"),
  delete: (id) =>
    mutateWithInvalidation(() => rawNotificationAPI.delete(id), [["notifications"]], "Failed to delete notification"),
  send: (id) =>
    mutateWithInvalidation(() => rawNotificationAPI.send(id), [["notifications"]], "Failed to send notification"),
  sendFeeReminder: (data) => rawNotificationAPI.sendFeeReminder(data),
  sendAbsenceAlert: (data) => rawNotificationAPI.sendAbsenceAlert(data),
};

export const authAPI = {
  login: async (data) => toSuccessResponse(await getApiPayload(await rawAuthAPI.login(data), "Failed to login")),
  register: async (data) => toSuccessResponse(await getApiPayload(await rawAuthAPI.register(data), "Failed to register")),
  profile: () =>
    fetchCached(["auth", "profile"], () => rawAuthAPI.profile(), "Failed to fetch profile"),
  getSystemOverview: () =>
    fetchCached(["auth", "system-overview"], () => rawAuthAPI.getSystemOverview(), "Failed to fetch overview"),
  getProvisionTargets: (params) =>
    fetchCached(["auth", "provision-targets", params || {}], () => rawAuthAPI.getProvisionTargets(params), "Failed to fetch provision targets"),
  provisionAccount: (data) =>
    mutateWithInvalidation(() => rawAuthAPI.provisionAccount(data), [["auth"]], "Failed to provision account"),
  getUsers: (params) =>
    fetchCached(["auth", "users", params || {}], () => rawAuthAPI.getUsers(params), "Failed to fetch users"),
  updatePermissions: (data) =>
    mutateWithInvalidation(() => rawAuthAPI.updatePermissions(data), [["auth"]], "Failed to update permissions"),
  toggleUserStatus: (data) =>
    mutateWithInvalidation(() => rawAuthAPI.toggleUserStatus(data), [["auth"]], "Failed to toggle user status"),
  createUser: (data) =>
    mutateWithInvalidation(() => rawAuthAPI.createUser(data), [["auth"]], "Failed to create user"),
};

export const timetableAPI = {
  getAll: (params) =>
    fetchCached(["timetable", "list", params || {}], () => rawTimetableAPI.getAll(params), "Failed to fetch timetable"),
  setAll: (data) =>
    mutateWithInvalidation(() => rawTimetableAPI.setAll(data), [["timetable"], ["classes"]], "Failed to update timetable"),
};

export const teacherAttendanceAPI = {
  getAll: (params) =>
    fetchCached(["teacher-attendance", "list", params || {}], () => rawTeacherAttendanceAPI.getAll(params), "Failed to fetch teacher attendance"),
  create: (data) =>
    mutateWithInvalidation(() => rawTeacherAttendanceAPI.create(data), [["teacher-attendance"]], "Failed to create teacher attendance"),
  update: (id, data) =>
    mutateWithInvalidation(() => rawTeacherAttendanceAPI.update(id, data), [["teacher-attendance"]], "Failed to update teacher attendance"),
  mark: (data) =>
    mutateWithInvalidation(() => rawTeacherAttendanceAPI.mark(data), [["teacher-attendance"]], "Failed to mark teacher attendance"),
};

export const progressReportAPI = {
  generate: (data) =>
    mutateWithInvalidation(() => rawProgressReportAPI.generate(data), [["progress-reports"]], "Failed to generate progress report"),
  bulkGenerate: (data) =>
    mutateWithInvalidation(() => rawProgressReportAPI.bulkGenerate(data), [["progress-reports"]], "Failed to bulk generate progress reports"),
  get: (params) =>
    fetchCached(["progress-reports", "list", params || {}], () => rawProgressReportAPI.get(params), "Failed to fetch progress reports"),
  getByClass: (params) =>
    fetchCached(["progress-reports", "class", params || {}], () => rawProgressReportAPI.getByClass(params), "Failed to fetch class progress reports"),
  generatePDF: (params) => rawProgressReportAPI.generatePDF(params),
  downloadPDF: (params) => rawProgressReportAPI.downloadPDF(params),
};

export const familyAPI = {
  getAll: (params) =>
    fetchCached(["families", "list", params || {}], () => rawFamilyAPI.getAll(params), "Failed to fetch families"),
  getById: (id) =>
    fetchCached(["families", "detail", id], () => rawFamilyAPI.getById(id), "Failed to fetch family"),
  create: (data) =>
    mutateWithInvalidation(() => rawFamilyAPI.create(data), [["families"]], "Failed to create family"),
  update: (id, data) =>
    mutateWithInvalidation(() => rawFamilyAPI.update(id, data), [["families"]], "Failed to update family"),
  delete: (id) =>
    mutateWithInvalidation(() => rawFamilyAPI.delete(id), [["families"]], "Failed to delete family"),
  getFeeSummary: (id) =>
    fetchCached(["families", "fee-summary", id], () => rawFamilyAPI.getFeeSummary(id), "Failed to fetch family fee summary"),
  linkStudent: (data) =>
    mutateWithInvalidation(() => rawFamilyAPI.linkStudent(data), [["families"], ["students"]], "Failed to link student"),
  unlinkStudent: (studentId) =>
    mutateWithInvalidation(() => rawFamilyAPI.unlinkStudent(studentId), [["families"], ["students"]], "Failed to unlink student"),
  generateId: () =>
    fetchCached(["families", "generate-id"], () => rawFamilyAPI.generateId(), "Failed to generate family ID"),
};

export const settingsAPI = {
  get: () =>
    fetchCached(["settings"], () => rawSettingsAPI.get(), "Failed to fetch settings"),
  update: (data) =>
    mutateWithInvalidation(() => rawSettingsAPI.update(data), [["settings"]], "Failed to update settings"),
};

