import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const notificationKeys = makeDomainKeys("notifications");

export const useNotifications = (params = {}, options = {}) =>
  useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: async () =>
      getApiPayload(await notificationAPI.getAll(params), "Failed to fetch notifications"),
    ...options,
  });

export const useNotification = (id, options = {}) =>
  useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: async () =>
      getApiPayload(await notificationAPI.getById(id), "Failed to fetch notification"),
    enabled: !!id,
    ...options,
  });

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await notificationAPI.create(data), "Failed to create notification"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await notificationAPI.update(id, data), "Failed to update notification"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.detail(variables.id) });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) =>
      getApiPayload(await notificationAPI.delete(id), "Failed to delete notification"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useSendNotification = () =>
  useMutation({
    mutationFn: async (id) =>
      getApiPayload(await notificationAPI.send(id), "Failed to send notification"),
  });

export const useSendFeeReminder = () =>
  useMutation({
    mutationFn: async (data) =>
      getApiPayload(await notificationAPI.sendFeeReminder(data), "Failed to send fee reminder"),
  });

export const useSendAbsenceAlert = () =>
  useMutation({
    mutationFn: async (data) =>
      getApiPayload(await notificationAPI.sendAbsenceAlert(data), "Failed to send absence alert"),
  });

