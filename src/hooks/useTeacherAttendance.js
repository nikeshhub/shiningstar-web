import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherAttendanceAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const teacherAttendanceKeys = makeDomainKeys("teacher-attendance");

export const useTeacherAttendance = (params = {}, options = {}) =>
  useQuery({
    queryKey: teacherAttendanceKeys.list(params),
    queryFn: async () =>
      getApiPayload(
        await teacherAttendanceAPI.getAll(params),
        "Failed to fetch teacher attendance"
      ),
    ...options,
  });

export const useCreateTeacherAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(
        await teacherAttendanceAPI.create(data),
        "Failed to create teacher attendance record"
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teacherAttendanceKeys.all }),
  });
};

export const useUpdateTeacherAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(
        await teacherAttendanceAPI.update(id, data),
        "Failed to update teacher attendance"
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teacherAttendanceKeys.all }),
  });
};

export const useMarkTeacherAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await teacherAttendanceAPI.mark(data), "Failed to mark teacher attendance"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teacherAttendanceKeys.all }),
  });
};

