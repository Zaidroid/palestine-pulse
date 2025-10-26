/**
 * HDX (Humanitarian Data Exchange) Service
 * 
 * Generic service for querying HDX CKAN API and fetching humanitarian datasets
 */

export interface HDXResource {
  id: string;
  name: string;
  description: string;
  url: string;
  format: string;
  last_modified: string;
  size?: number;
}

export interface HDXDataset {
  id: string;
  name: string;
  title: string;
  notes: string;
  organization: string;
  resources: HDXResource[];
  tags: string[];
  last_modified: string;
}

export interface HDXSearchResult {
  count: number;
  results: HDXDataset[];
}

const HDX_API_BASE = 'https://data.humdata.org/api/3/action';

/**
 * Load HDX data from local files first, fallback to API
 */
const loadLocalHDXData = async (category: string): Promise<any> => {
  try {
    const response = await fetch(`/data/hdx/${category}/datasets.json`);
    if (response.ok) {
      const data = await response.json();
      console.log(`Loaded HDX ${category} from local cache`);
      return data;
    }
  } catch (error) {
    console.log(`Local HDX ${category} not available, will use API`);
  }
  return null;
};

/**
 * Search HDX datasets by query (with local cache fallback)
 */
export const searchHDXDatasets = async (
  query: string,
  rows: number = 10
): Promise<HDXSearchResult> => {
  // Try local catalog first
  try {
    const catalog = await fetch('/data/hdx/catalog.json');
    if (catalog.ok) {
      const data = await catalog.json();
      console.log(`Using local HDX catalog (${data.total_datasets} datasets)`);
      
      // Filter locally
      const filtered = data.datasets.filter((ds: any) =>
        ds.title.toLowerCase().includes(query.toLowerCase()) ||
        ds.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, rows);
      
      return {
        count: filtered.length,
        results: filtered,
      };
    }
  } catch (error) {
    console.log('Local catalog not available, using API');
  }
  
  // Fallback to API
  try {
    const url = `${HDX_API_BASE}/package_search?q=${encodeURIComponent(query)}&rows=${rows}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HDX search failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('HDX API returned unsuccessful response');
    }
    
    console.log(`HDX search for "${query}":`, data.result.count, 'datasets found');
    
    return {
      count: data.result.count,
      results: data.result.results.map((dataset: any) => ({
        id: dataset.id,
        name: dataset.name,
        title: dataset.title,
        notes: dataset.notes || '',
        organization: dataset.organization?.title || 'Unknown',
        resources: dataset.resources?.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description || '',
          url: r.url,
          format: r.format,
          last_modified: r.last_modified,
          size: r.size,
        })) || [],
        tags: dataset.tags?.map((t: any) => t.name) || [],
        last_modified: dataset.metadata_modified,
      })),
    };
  } catch (error) {
    console.error('Error searching HDX:', error);
    throw error;
  }
};

/**
 * Get specific dataset by ID
 */
export const getHDXDataset = async (datasetId: string): Promise<HDXDataset> => {
  try {
    const url = `${HDX_API_BASE}/package_show?id=${datasetId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dataset: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('HDX API returned unsuccessful response');
    }
    
    const dataset = data.result;
    
    return {
      id: dataset.id,
      name: dataset.name,
      title: dataset.title,
      notes: dataset.notes || '',
      organization: dataset.organization?.title || 'Unknown',
      resources: dataset.resources?.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        url: r.url,
        format: r.format,
        last_modified: r.last_modified,
        size: r.size,
      })) || [],
      tags: dataset.tags?.map((t: any) => t.name) || [],
      last_modified: dataset.metadata_modified,
    };
  } catch (error) {
    console.error('Error fetching HDX dataset:', error);
    throw error;
  }
};

/**
 * Search for humanitarian/aid-related datasets
 */
export const searchHumanitarianData = async (): Promise<HDXSearchResult> => {
  const queries = [
    'palestine humanitarian',
    'gaza aid',
    'palestinian humanitarian response',
  ];
  
  // Try multiple queries and aggregate results
  const results: HDXDataset[] = [];
  const seenIds = new Set<string>();
  
  for (const query of queries) {
    try {
      const searchResult = await searchHDXDatasets(query, 5);
      searchResult.results.forEach(dataset => {
        if (!seenIds.has(dataset.id)) {
          seenIds.add(dataset.id);
          results.push(dataset);
        }
      });
    } catch (error) {
      console.warn(`Search failed for "${query}":`, error);
    }
  }
  
  console.log('Total humanitarian datasets found:', results.length);
  
  return {
    count: results.length,
    results,
  };
};

/**
 * Get summary of available humanitarian data
 */
export const getHumanitarianDataSummary = async () => {
  try {
    const data = await searchHumanitarianData();
    
    const summary = {
      totalDatasets: data.count,
      byOrganization: {} as Record<string, number>,
      byFormat: {} as Record<string, number>,
      totalResources: 0,
      recentDatasets: data.results.slice(0, 5),
    };
    
    data.results.forEach(dataset => {
      // Count by organization
      summary.byOrganization[dataset.organization] = 
        (summary.byOrganization[dataset.organization] || 0) + 1;
      
      // Count resources by format
      dataset.resources.forEach(resource => {
        summary.byFormat[resource.format] = 
          (summary.byFormat[resource.format] || 0) + 1;
        summary.totalResources++;
      });
    });
    
    return summary;
  } catch (error) {
    console.error('Error getting humanitarian data summary:', error);
    throw error;
  }
};