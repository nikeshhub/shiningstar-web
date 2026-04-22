import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { timetableAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const timetableKeys = makeDomainKeys("timetable");

export const useTimetable = (params = {}, options = {}) =>
  useQuery({
    queryKey: timetableKeys.list(params),
    queryFn: async () =>
      getApiPayload(await timetableAPI.getAll(params), "Failed to fetch timetable"),
    ...options,
  });

export const useSetTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await timetableAPI.setAll(data), "Failed to update timetable"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: timetableKeys.all }),
  });
};

