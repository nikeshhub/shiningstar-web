import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const inventoryKeys = makeDomainKeys("inventory");

export const useInventoryItems = (params = {}, options = {}) =>
  useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: async () =>
      getApiPayload(await inventoryAPI.getAll(params), "Failed to fetch inventory"),
    ...options,
  });

export const useInventoryItem = (id, options = {}) =>
  useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: async () =>
      getApiPayload(await inventoryAPI.getById(id), "Failed to fetch inventory item"),
    enabled: !!id,
    ...options,
  });

export const useStudentDistributions = (studentId, options = {}) =>
  useQuery({
    queryKey: [...inventoryKeys.all, "student-distributions", studentId],
    queryFn: async () =>
      getApiPayload(
        await inventoryAPI.getStudentDistributions(studentId),
        "Failed to fetch student distributions"
      ),
    enabled: !!studentId,
    ...options,
  });

export const useAllDistributions = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...inventoryKeys.all, "all-distributions", params],
    queryFn: async () =>
      getApiPayload(
        await inventoryAPI.getAllDistributions(params),
        "Failed to fetch distributions"
      ),
    ...options,
  });

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await inventoryAPI.create(data), "Failed to create inventory item"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inventoryKeys.all }),
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await inventoryAPI.update(id, data), "Failed to update inventory item"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(variables.id) });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) =>
      getApiPayload(await inventoryAPI.delete(id), "Failed to delete inventory item"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inventoryKeys.all }),
  });
};

export const useDistributeInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await inventoryAPI.distribute(data), "Failed to distribute inventory"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inventoryKeys.all }),
  });
};

