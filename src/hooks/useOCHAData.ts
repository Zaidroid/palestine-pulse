import { useQuery } from '@tanstack/react-query';

const OCHA_API_BASE = "https://data.humdata.org/api/action";

const fetchOchaData = async (endpoint: string, retries: number = 3): Promise<any> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${OCHA_API_BASE}/${endpoint}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json();
      }

      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Retry on 5xx errors (server errors)
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);

      // Wait before retrying (exponential backoff)
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    } catch (error) {
      lastError = error as Error;

      // Don't retry on network errors or aborts for the last attempt
      if (attempt === retries - 1 || error instanceof TypeError || error.name === 'AbortError') {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw lastError || new Error(`Failed to fetch OCHA data from ${endpoint} after ${retries} attempts`);
};

export const useOchaHumanitarianNeeds = () => {
    return useQuery({
        queryKey: ['ochaHumanitarianNeeds'],
        queryFn: async () => {
            try {
                const response = await fetch(`${OCHA_API_BASE}/package_search?q=humanitarian+needs`);
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`OCHA API returned ${response.status}`);
            } catch (error) {
                console.warn('OCHA humanitarian needs data not available, using fallback');
                return {};
            }
        },
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        // Return empty object as fallback if all retries fail
        placeholderData: {},
    });
};

export const useOchaSettlements = () => {
    return useQuery({
        queryKey: ['ochaSettlements'],
        queryFn: async () => {
            try {
                // Use UN OCHA package search for settlements data
                const response = await fetch(`${OCHA_API_BASE}/package_search?q=settlements`);
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`OCHA API returned ${response.status}`);
            } catch (error) {
                console.warn('OCHA settlements data not available, using fallback');
                // Return empty object to trigger fallback mechanisms in components
                return {};
            }
        },
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
        retry: 2,
        retryDelay: 500,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        // Return empty object immediately as placeholder
        placeholderData: {},
    });
};