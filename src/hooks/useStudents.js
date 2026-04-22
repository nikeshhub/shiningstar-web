import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const studentKeys = makeDomainKeys("students");

export const useStudents = (params = {}, options = {}) =>
  useQuery({
    queryKey: studentKeys.list(params),
    queryFn: async () =>
      getApiPayload(await studentAPI.getAll(params), "Failed to fetch students"),
    ...options,
  });

export const useStudent = (id, options = {}) =>
  useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: async () =>
      getApiPayload(await studentAPI.getById(id), "Failed to fetch student"),
    enabled: !!id,
    ...options,
  });

export const useStudentHistory = (id, options = {}) =>
  useQuery({
    queryKey: [...studentKeys.detail(id), "history"],
    queryFn: async () =>
      getApiPayload(await studentAPI.getHistory(id), "Failed to fetch student history"),
    enabled: !!id,
    ...options,
  });

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await studentAPI.create(data), "Failed to create student"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await studentAPI.update(id, data), "Failed to update student"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) =>
      getApiPayload(await studentAPI.delete(id), "Failed to delete student"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
};

export const usePromoteStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await studentAPI.promote(data), "Failed to promote students"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
};

export const useUpdateStudentGPS = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await studentAPI.updateGPS(id, data), "Failed to update location"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });
    },
  });
};

