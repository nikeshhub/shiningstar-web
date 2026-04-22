import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feeAPI } from "../services/api";
import { getApiPayload, makeDomainKeys } from "./useApiHelpers";

export const feeKeys = makeDomainKeys("fee");

export const useFamilyLedger = (familyId, params = {}, options = {}) =>
  useQuery({
    queryKey: [...feeKeys.all, "ledger", familyId, params],
    queryFn: async () =>
      getApiPayload(await feeAPI.getLedger(familyId, params), "Failed to fetch ledger"),
    enabled: !!familyId,
    ...options,
  });

export const useFeeTransaction = (id, options = {}) =>
  useQuery({
    queryKey: [...feeKeys.all, "transaction", id],
    queryFn: async () =>
      getApiPayload(await feeAPI.getTransaction(id), "Failed to fetch transaction"),
    enabled: !!id,
    ...options,
  });

export const useDuesList = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...feeKeys.all, "dues", params],
    queryFn: async () => getApiPayload(await feeAPI.getDuesList(params), "Failed to fetch dues"),
    ...options,
  });

export const useCollectionSummary = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...feeKeys.all, "collection-summary", params],
    queryFn: async () =>
      getApiPayload(await feeAPI.getCollectionSummary(params), "Failed to fetch collection summary"),
    ...options,
  });

export const useGeneratedBillNumber = (options = {}) =>
  useQuery({
    queryKey: [...feeKeys.all, "bill-number"],
    queryFn: async () =>
      getApiPayload(await feeAPI.generateBillNumber(), "Failed to generate bill number"),
    ...options,
  });

export const useCreateCharge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await feeAPI.createCharge(data), "Failed to create charge"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feeKeys.all }),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      getApiPayload(await feeAPI.createPayment(data), "Failed to create payment"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feeKeys.all }),
  });
};

