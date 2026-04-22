import { useMutation, useQuery } from "@tanstack/react-query";
import { progressReportAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const progressReportKeys = makeDomainKeys("progress-reports");

export const useProgressReports = (params = {}, options = {}) =>
  useQuery({
    queryKey: progressReportKeys.list(params),
    queryFn: async () =>
      getApiPayload(await progressReportAPI.get(params), "Failed to fetch progress reports"),
    ...options,
  });

export const useProgressReportsByClass = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...progressReportKeys.all, "class", params],
    queryFn: async () =>
      getApiPayload(
        await progressReportAPI.getByClass(params),
        "Failed to fetch progress reports by class"
      ),
    ...options,
  });

export const useGenerateProgressReport = () =>
  useMutation({
    mutationFn: async (data) =>
      getApiPayload(await progressReportAPI.generate(data), "Failed to generate progress report"),
  });

export const useBulkGenerateProgressReport = () =>
  useMutation({
    mutationFn: async (data) =>
      getApiPayload(
        await progressReportAPI.bulkGenerate(data),
        "Failed to generate progress reports"
      ),
  });

export const useGenerateProgressReportPdf = () =>
  useMutation({
    mutationFn: async (params) =>
      getApiPayload(
        await progressReportAPI.generatePDF(params),
        "Failed to generate progress report PDF"
      ),
  });

export const useDownloadProgressReportPdf = () =>
  useMutation({
    mutationFn: async (params) => progressReportAPI.downloadPDF(params),
  });

