/**
 * Settlement Expansion Placeholder
 * Shown until real B'Tselem/Peace Now data is integrated
 */

import { ComingSoonPlaceholder } from './ComingSoonPlaceholder';

export const SettlementExpansionPlaceholder = () => {
  return (
    <ComingSoonPlaceholder
      title="Settlement Expansion"
      description="Tracking Israeli settlement growth and impact in West Bank"
      requiredDataSources={[
        {
          name: "B'Tselem",
          url: 'https://www.btselem.org/',
          status: 'pending',
          description: 'Israeli human rights organization tracking settlements, demolitions, and violations. Partnership/API access needed.'
        },
        {
          name: 'Peace Now (Shalom Achshav)',
          url: 'https://peacenow.org.il/',
          status: 'pending',
          description: 'Settlement monitoring organization with detailed data on settlement expansion, population, and land seizure'
        },
        {
          name: 'UN OCHA oPt',
          url: 'https://www.ochaopt.org/',
          status: 'planned',
          description: 'Demolition data, displacement statistics, and humanitarian impact of settlements'
        },
        {
          name: 'Israeli Central Bureau of Statistics',
          url: 'https://www.cbs.gov.il/',
          status: 'planned',
          description: 'Official settler population statistics and demographic data'
        }
      ]}
      estimatedCompletion="Phase 3 - Pending data partnerships"
    />
  );
};

export default SettlementExpansionPlaceholder;
