/**
 * Color System Example
 * 
 * Demonstrates the theme-aware color system utilities
 */

import { 
  getD3Colors, 
  getD3Color, 
  d3ColorScales,
  getD3TextColor,
  getD3GridColor,
  getSemanticColor 
} from '../colors';

export const ColorSystemExample = () => {
  const allColors = getD3Colors();
  const crisisColor = getSemanticColor('crisis');
  const hopeColor = getSemanticColor('hope');
  const textColor = getD3TextColor('light');
  const gridColor = getD3GridColor('dark');

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Color System Examples</h2>
      
      {/* All Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-3">All Chart Colors</h3>
        <div className="flex gap-2">
          {allColors.map((color, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded"
              style={{ backgroundColor: color }}
              title={`Color ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Semantic Colors</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded"
              style={{ backgroundColor: crisisColor }}
            />
            <span className="text-sm">Crisis</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded"
              style={{ backgroundColor: hopeColor }}
            />
            <span className="text-sm">Hope</span>
          </div>
        </div>
      </div>

      {/* Color Scales */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Crisis Scale</h3>
        <div className="flex gap-2">
          {d3ColorScales.crisis.map((color, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Theme Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Theme-Aware Colors</h3>
        <div className="space-y-2 text-sm">
          <div>Text Color (light): <code className="bg-muted px-2 py-1 rounded">{textColor}</code></div>
          <div>Grid Color (dark): <code className="bg-muted px-2 py-1 rounded">{gridColor}</code></div>
        </div>
      </div>
    </div>
  );
};
