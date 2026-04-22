import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const teacherKeys = makeDomainKeys("teachers");

export const useTeachers = (params = {}, options = {}) =>
  useQuery({
    queryKey: teacherKeys.list(params),
    queryFn: async () =>
      getApiPayload(await teacherAPI.getAll(params), "Failed to fetch teachers"),
    ...options,
  });

export const useTeacher = (id, options = {}) =>
  useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: async () =>
      getApiPayload(await teacherAPI.getById(id), "Failed to fetch teacher"),
    enabled: !!id,
    ...options,
  });

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await teacherAPI.create(data), "Failed to create teacher"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teacherKeys.lists() }),
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await teacherAPI.update(id, data), "Failed to update teacher"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(variables.id) });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) =>
      getApiPayload(await teacherAPI.delete(id), "Failed to delete teacher"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teacherKeys.lists() }),
  });
};

