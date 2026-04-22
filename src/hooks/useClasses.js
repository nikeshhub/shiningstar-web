import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const classKeys = makeDomainKeys("classes");

export const useClasses = (params = {}, options = {}) =>
  useQuery({
    queryKey: classKeys.list(params),
    queryFn: async () =>
      getApiPayload(await classAPI.getAll(params), "Failed to fetch classes"),
    ...options,
  });

export const useClass = (id, options = {}) =>
  useQuery({
    queryKey: classKeys.detail(id),
    queryFn: async () => getApiPayload(await classAPI.getById(id), "Failed to fetch class"),
    enabled: !!id,
    ...options,
  });

export const useClassStudents = (id, options = {}) =>
  useQuery({
    queryKey: [...classKeys.detail(id), "students"],
    queryFn: async () =>
      getApiPayload(await classAPI.getStudents(id), "Failed to fetch class students"),
    enabled: !!id,
    ...options,
  });

export const useClassTimetable = (id, options = {}) =>
  useQuery({
    queryKey: [...classKeys.detail(id), "timetable"],
    queryFn: async () =>
      getApiPayload(await classAPI.getTimetable(id), "Failed to fetch class timetable"),
    enabled: !!id,
    ...options,
  });

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await classAPI.create(data), "Failed to create class"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: classKeys.lists() }),
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await classAPI.update(id, data), "Failed to update class"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classKeys.detail(variables.id) });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) =>
      getApiPayload(await classAPI.delete(id), "Failed to delete class"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: classKeys.lists() }),
  });
};

export const useSetClassTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await classAPI.setTimetable(id, data), "Failed to set class timetable"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...classKeys.detail(variables.id), "timetable"] });
    },
  });
};

export const useUpdateSubjectBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ classId, subjectId, data }) =>
      getApiPayload(
        await classAPI.updateSubjectBook(classId, subjectId, data),
        "Failed to update subject book"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: classKeys.detail(variables.classId) });
    },
  });
};

