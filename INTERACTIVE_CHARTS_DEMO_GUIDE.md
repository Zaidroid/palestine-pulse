# 🚀 Advanced Interactive Charts Demo

## Overview

A comprehensive D3.js-powered dashboard showcasing highly animated, interactive charts with advanced features including unified filters, export/share functionality, and smart tooltips.

## 🎯 Features

### Chart Types
1. **Animated Area Chart** - Casualties timeline with smooth gradients and crosshair
2. **Interactive Bar Chart** - Infrastructure damage with hover effects and sorting
3. **Advanced Donut Chart** - Casualty demographics with expanding arcs
4. **Stream Graph** - Weekly casualty distribution with flowing animations
5. **Radar Chart** - Multi-dimensional regional impact analysis
6. **Sankey Flow Diagram** - Population displacement flow visualization

### Interactive Elements

#### 🎛️ Unified Filter Tabs
Each chart card includes a filter control with time ranges:
- **7D** - Last 7 days
- **1M** - Last month
- **3M** - Last quarter
- **1Y** - Last year
- **All** - All time data

#### 📤 Export & Share Buttons
- **Export**: Download chart as PNG or CSV
- **Share**: Generate shareable link or embed code
- Animated feedback on button interactions

#### 🏷️ Data Source Badges
Hover over the data source badge to see:
- Source organization
- Last updated timestamp
- Data reliability score (High/Medium/Low)
- Methodology description
- Link to full report

#### 💡 Smart Tooltips
Rich, contextual tooltips that display:
- Precise data values
- Percentage breakdowns
- Comparative metrics
- Contextual descriptions
- Smooth animations and positioning

## 🎨 Visual Features

### Animations
- **Entrance animations**: Staggered reveals with easing functions
- **Line drawing**: SVG path animations using stroke-dasharray
- **Hover effects**: Smooth transitions and elastic bounces
- **Data updates**: Animated transitions between states

### Theme Support
- Full dark/light mode support
- Automatic color adaptation
- Consistent visual hierarchy
- Accessible contrast ratios

## 🚀 How to Access

### Development Server
```bash
npm run dev
```

Then navigate to:
```
http://localhost:5173/demo/interactive-charts
```

### Direct URL
```
/demo/interactive-charts
```

## 📊 Chart Details

### 1. Animated Area Chart
**Purpose**: Visualize casualties over time  
**Features**:
- Dual-layer area with gradient fills
- Animated line drawing
- Crosshair with data points
- Smart tooltip with totals

**Interactions**:
- Hover to see exact values
- Crosshair follows mouse
- Smooth transitions

### 2. Interactive Bar Chart
**Purpose**: Show infrastructure destruction  
**Features**:
- Stacked bars (destroyed vs total)
- Percentage labels
- Hover expansion effect
- Grid lines for reference

**Interactions**:
- Hover to highlight bar
- Click to drill down (future)
- Animated entrance

### 3. Advanced Donut Chart
**Purpose**: Demographic breakdown  
**Features**:
- Animated arc drawing
- Center statistics
- Expanding hover effect
- Color-coded categories

**Interactions**:
- Hover to expand segment
- Others dim automatically
- Elastic animation

### 4. Stream Graph
**Purpose**: Time-series distribution  
**Features**:
- Flowing stacked areas
- Smooth curves
- Layer highlighting
- Wiggle offset for aesthetics

**Interactions**:
- Hover to highlight layer
- See individual values
- Smooth transitions

### 5. Radar Chart
**Purpose**: Multi-dimensional analysis  
**Features**:
- 6-axis visualization
- Circular grid
- Animated drawing
- Interactive data points

**Interactions**:
- Hover points for details
- Elastic point expansion
- Smooth animations

### 6. Sankey Flow Diagram
**Purpose**: Population movement  
**Features**:
- Flow visualization
- Proportional link widths
- Node highlighting
- Curved paths

**Interactions**:
- Hover links to see flow
- Hover nodes for totals
- Smooth transitions

## 🎯 Best Practices Used

### D3.js Techniques
- **Scales**: Linear, time, band, and radial scales
- **Transitions**: Duration, delay, and easing functions
- **Interpolation**: Custom interpolators for smooth animations
- **Generators**: Area, line, arc, and link generators
- **Layouts**: Stack, pie, and custom layouts

### Performance
- **Efficient rendering**: Minimal DOM manipulation
- **Smooth animations**: 60fps target
- **Lazy loading**: Charts load on demand
- **Responsive**: Adapts to container size

### Accessibility
- **High contrast**: WCAG AA compliant
- **Semantic markup**: Proper SVG structure
- **Keyboard navigation**: Future enhancement
- **Screen reader support**: ARIA labels (future)

## 🔧 Customization

### Adding New Charts
1. Create chart component in `src/components/charts/demo/`
2. Import in `AdvancedInteractiveDemo.tsx`
3. Add to charts grid with ChartCard wrapper
4. Configure data source information

### Modifying Filters
Edit the `filters` array in ChartCard component:
```typescript
const filters: { id: TimeFilter; label: string }[] = [
  { id: 'custom', label: 'Custom' },
  // ... add more
];
```

### Styling
- Colors defined in theme system
- Animations in `src/index.css`
- Chart-specific styles in component files

## 📝 Technical Stack

- **D3.js v7**: Data visualization
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Vite**: Build tool

## 🎓 Learning Resources

### D3.js Concepts Used
- Scales and axes
- Transitions and animations
- Data joins and updates
- SVG path generation
- Event handling
- Custom interpolators

### Advanced Techniques
- Stacked layouts
- Radial coordinates
- Bezier curves
- Gradient fills
- Clipping paths
- Transform animations

## 🐛 Troubleshooting

### Charts not rendering
- Check browser console for errors
- Ensure D3.js is installed: `npm install d3`
- Verify data format matches interface

### Animations stuttering
- Reduce transition duration
- Simplify easing functions
- Check for memory leaks

### Tooltips not showing
- Verify pointer events
- Check z-index values
- Ensure tooltip state updates

## 🚀 Future Enhancements

- [ ] Real-time data updates
- [ ] Chart comparison mode
- [ ] Advanced filtering options
- [ ] Data export formats (PDF, Excel)
- [ ] Annotation tools
- [ ] Collaborative features
- [ ] Mobile touch gestures
- [ ] Keyboard shortcuts
- [ ] Print optimization
- [ ] Accessibility improvements

## 📄 License

Part of the humanitarian dashboard project.

---

**Created with**: D3.js, React, TypeScript, and ❤️  
**Purpose**: Demonstrate advanced data visualization techniques with humanitarian data
