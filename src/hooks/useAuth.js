import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const authKeys = makeDomainKeys("auth");

export const useProfile = (options = {}) =>
  useQuery({
    queryKey: [...authKeys.all, "profile"],
    queryFn: async () => getApiPayload(await authAPI.profile(), "Failed to fetch profile"),
    ...options,
  });

export const useSystemOverview = (options = {}) =>
  useQuery({
    queryKey: [...authKeys.all, "system-overview"],
    queryFn: async () =>
      getApiPayload(await authAPI.getSystemOverview(), "Failed to fetch system overview"),
    ...options,
  });

export const useProvisionTargets = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...authKeys.all, "provision-targets", params],
    queryFn: async () =>
      getApiPayload(await authAPI.getProvisionTargets(params), "Failed to fetch provision targets"),
    ...options,
  });

export const useUsers = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...authKeys.all, "users", params],
    queryFn: async () => getApiPayload(await authAPI.getUsers(params), "Failed to fetch users"),
    ...options,
  });

export const useLogin = () =>
  useMutation({
    mutationFn: async (data) =>
      getApiPayload(await authAPI.login(data), "Failed to login"),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: async (data) =>
      getApiPayload(await authAPI.register(data), "Failed to register"),
  });

export const useProvisionAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await authAPI.provisionAccount(data), "Failed to provision account"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.all }),
  });
};

export const useUpdatePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await authAPI.updatePermissions(data), "Failed to update permissions"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.all }),
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await authAPI.toggleUserStatus(data), "Failed to update user status"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.all }),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await authAPI.createUser(data), "Failed to create user"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.all }),
  });
};

