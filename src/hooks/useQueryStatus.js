const defaultHasData = (data) => {
  if (Array.isArray(data)) {
    return data.length > 0;
  }

  return data !== undefined && data !== null;
};

export const getQueryStatus = (query, options = {}) => {
  const { hasData = defaultHasData } = options;
  const data = query?.data;
  const resolvedHasData = hasData(data);
  const isInitialLoading = Boolean(query?.isPending) && !resolvedHasData;
  const isRefreshing = Boolean(query?.isFetching) && !isInitialLoading;

  return {
    data,
    error: query?.error ?? null,
    hasData: resolvedHasData,
    isInitialLoading,
    isRefreshing,
  };
};

export const useQueryStatus = (query, options = {}) => getQueryStatus(query, options);
