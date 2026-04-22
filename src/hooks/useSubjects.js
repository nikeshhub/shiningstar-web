import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectAPI } from '../services/api';
import { getApiPayload } from './useApiHelpers';

// Query Keys
export const subjectKeys = {
  all: ['subjects'],
  lists: () => [...subjectKeys.all, 'list'],
  list: (filters) => [...subjectKeys.lists(), { filters }],
  details: () => [...subjectKeys.all, 'detail'],
  detail: (id) => [...subjectKeys.details(), id],
};

// Get all subjects
export const useSubjects = (options = {}) => {
  return useQuery({
    queryKey: subjectKeys.lists(),
    queryFn: async () => getApiPayload(await subjectAPI.getAll(), 'Failed to fetch subjects'),
    ...options,
  });
};

// Get subject by ID
export const useSubject = (id, options = {}) => {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: async () => getApiPayload(await subjectAPI.getById(id), 'Failed to fetch subject'),
    enabled: !!id,
    ...options,
  });
};

// Create subject mutation
export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await subjectAPI.create(data), 'Failed to create subject'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
};

// Update subject mutation
export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) =>
      getApiPayload(await subjectAPI.update(id, data), 'Failed to update subject'),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(variables.id) });
    },
  });
};

// Delete subject mutation
export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) =>
      getApiPayload(await subjectAPI.delete(id), 'Failed to delete subject'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
};
