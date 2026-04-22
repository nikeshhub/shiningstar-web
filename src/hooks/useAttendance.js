import { useMutation, useQuery } from "@tanstack/react-query";
import { attendanceAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const attendanceKeys = makeDomainKeys("attendance");

export const useAttendanceByDate = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...attendanceKeys.all, "by-date", params],
    queryFn: async () =>
      getApiPayload(await attendanceAPI.getByDate(params), "Failed to fetch attendance"),
    ...options,
  });

export const useStudentAttendanceReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...attendanceKeys.all, "student-report", params],
    queryFn: async () =>
      getApiPayload(
        await attendanceAPI.getStudentReport(params),
        "Failed to fetch attendance report"
      ),
    ...options,
  });

export const useMonthlyAttendanceReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...attendanceKeys.all, "monthly-report", params],
    queryFn: async () =>
      getApiPayload(
        await attendanceAPI.getMonthlyReport(params),
        "Failed to fetch monthly attendance report"
      ),
    ...options,
  });

export const useAbsentStudents = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...attendanceKeys.all, "absent", params],
    queryFn: async () =>
      getApiPayload(await attendanceAPI.getAbsentStudents(params), "Failed to fetch absent students"),
    ...options,
  });

export const useMarkAttendance = () =>
  useMutation({
    mutationFn: async (data) =>
      getApiPayload(await attendanceAPI.mark(data), "Failed to mark attendance"),
  });

