/**
 * Aid Tracker Placeholder
 * Shown until real HDX/OCHA FTS data is integrated
 */

import { ComingSoonPlaceholder } from './ComingSoonPlaceholder';

export const AidTrackerPlaceholder = () => {
  return (
    <ComingSoonPlaceholder
      title="Humanitarian Aid Tracker"
      description="Monitoring aid delivery, distribution, and access restrictions"
      requiredDataSources={[
        {
          name: 'HDX (Humanitarian Data Exchange)',
          url: 'https://data.humdata.org/',
          status: 'in-progress',
          description: 'Humanitarian datasets including aid delivery, access restrictions, and needs assessments'
        },
        {
          name: 'UN OCHA Financial Tracking Service (FTS)',
          url: 'https://fts.unocha.org/',
          status: 'planned',
          description: 'Detailed tracking of humanitarian funding flows, aid deliveries by source, and funding gaps'
        },
        {
          name: 'WFP (World Food Programme)',
          url: 'https://www.wfp.org/',
          status: 'planned',
          description: 'Food aid deliveries, distribution points, and beneficiary data'
        },
        {
          name: 'UNRWA',
          url: 'https://www.unrwa.org/',
          status: 'planned',
          description: 'Aid distribution to Palestinian refugees, shelter assistance, and service delivery'
        }
      ]}
      estimatedCompletion="Phase 3 - 2-3 weeks"
    />
  );
};

export default AidTrackerPlaceholder;
