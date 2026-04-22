import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { familyAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const familyKeys = makeDomainKeys("families");

export const useFamilies = (params = {}, options = {}) =>
  useQuery({
    queryKey: familyKeys.list(params),
    queryFn: async () =>
      getApiPayload(await familyAPI.getAll(params), "Failed to fetch families"),
    ...options,
  });

export const useFamily = (id, options = {}) =>
  useQuery({
    queryKey: familyKeys.detail(id),
    queryFn: async () => getApiPayload(await familyAPI.getById(id), "Failed to fetch family"),
    enabled: !!id,
    ...options,
  });

export const useFamilyFeeSummary = (id, options = {}) =>
  useQuery({
    queryKey: [...familyKeys.detail(id), "fee-summary"],
    queryFn: async () =>
      getApiPayload(await familyAPI.getFeeSummary(id), "Failed to fetch fee summary"),
    enabled: !!id,
    ...options,
  });

export const useGenerateFamilyId = (options = {}) =>
  useQuery({
    queryKey: [...familyKeys.all, "generate-id"],
    queryFn: async () =>
      getApiPayload(await familyAPI.generateId(), "Failed to generate family id"),
    ...options,
  });

export const useCreateFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await familyAPI.create(data), "Failed to create family"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: familyKeys.lists() }),
  });
};

export const useUpdateFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await familyAPI.update(id, data), "Failed to update family"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: familyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: familyKeys.detail(variables.id) });
    },
  });
};

export const useDeleteFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) =>
      getApiPayload(await familyAPI.delete(id), "Failed to delete family"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: familyKeys.lists() }),
  });
};

export const useLinkStudentToFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await familyAPI.linkStudent(data), "Failed to link student"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: familyKeys.detail(variables.familyId) });
    },
  });
};

export const useUnlinkStudentFromFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentId) =>
      getApiPayload(await familyAPI.unlinkStudent(studentId), "Failed to unlink student"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: familyKeys.all }),
  });
};

