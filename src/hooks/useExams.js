import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { examAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const examKeys = makeDomainKeys("exams");

export const useExams = (params = {}, options = {}) =>
  useQuery({
    queryKey: examKeys.list(params),
    queryFn: async () => getApiPayload(await examAPI.getAll(params), "Failed to fetch exams"),
    ...options,
  });

export const useExam = (id, options = {}) =>
  useQuery({
    queryKey: examKeys.detail(id),
    queryFn: async () => getApiPayload(await examAPI.getById(id), "Failed to fetch exam"),
    enabled: !!id,
    ...options,
  });

export const useMarksheet = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...examKeys.all, "marksheet", params],
    queryFn: async () =>
      getApiPayload(await examAPI.getMarksheet(params), "Failed to fetch marksheet"),
    ...options,
  });

export const useTerminalMarks = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...examKeys.all, "terminal-marks", params],
    queryFn: async () =>
      getApiPayload(await examAPI.getTerminalMarks(params), "Failed to fetch terminal marks"),
    ...options,
  });

export const useClassResult = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...examKeys.all, "class-result", params],
    queryFn: async () =>
      getApiPayload(await examAPI.getClassResult(params), "Failed to fetch class result"),
    ...options,
  });

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => getApiPayload(await examAPI.create(data), "Failed to create exam"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await examAPI.update(id, data), "Failed to update exam"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => getApiPayload(await examAPI.delete(id), "Failed to delete exam"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });
};

export const useGenerateExamNotice = () =>
  useMutation({
    mutationFn: async (id) =>
      getApiPayload(await examAPI.generateNotice(id), "Failed to generate exam notice"),
  });

export const useDownloadExamNotice = () =>
  useMutation({
    mutationFn: async (id) => examAPI.downloadNotice(id),
  });

export const useEnterMarks = () =>
  useMutation({
    mutationFn: async (data) =>
      getApiPayload(await examAPI.enterMarks(data), "Failed to enter marks"),
  });

export const useBulkEnterMarks = () =>
  useMutation({
    mutationFn: async (data) =>
      getApiPayload(await examAPI.bulkEnterMarks(data), "Failed to bulk enter marks"),
  });

export const useDeleteMarks = () =>
  useMutation({
    mutationFn: async (id) =>
      getApiPayload(await examAPI.deleteMarks(id), "Failed to delete marks"),
  });

