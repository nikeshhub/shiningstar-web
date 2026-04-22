import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const settingsKeys = makeDomainKeys("settings");

export const useSettings = (options = {}) =>
  useQuery({
    queryKey: settingsKeys.all,
    queryFn: async () => getApiPayload(await settingsAPI.get(), "Failed to fetch settings"),
    ...options,
  });

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await settingsAPI.update(data), "Failed to update settings"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.all }),
  });
};

