/**
 * HelpPanel Demo Component
 * Demonstrates the HelpPanel with comprehensive help content
 */

import * as React from "react";
import { HelpPanel } from "./help-panel";
import { helpCategories } from "../../data/help-content";

export const HelpPanelDemo: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Help Panel Demo</h1>
          <p className="text-muted-foreground">
            Click the help button to explore comprehensive documentation
          </p>
        </div>

        <div className="flex justify-center gap-4">
          {/* Icon variant */}
          <div className="flex flex-col items-center gap-2">
            <HelpPanel
              categories={helpCategories}
              triggerVariant="icon"
              externalDocsUrl="https://example.com/docs"
            />
            <span className="text-sm text-muted-foreground">Icon Trigger</span>
          </div>

          {/* Button variant */}
          <div className="flex flex-col items-center gap-2">
            <HelpPanel
              categories={helpCategories}
              triggerVariant="button"
              triggerLabel="Get Help"
              externalDocsUrl="https://example.com/docs"
            />
            <span className="text-sm text-muted-foreground">Button Trigger</span>
          </div>

          {/* With default article */}
          <div className="flex flex-col items-center gap-2">
            <HelpPanel
              categories={helpCategories}
              triggerVariant="button"
              triggerLabel="Quick Start"
              defaultArticleId="navigation"
              externalDocsUrl="https://example.com/docs"
            />
            <span className="text-sm text-muted-foreground">Opens to Article</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 border rounded-lg space-y-3">
            <h3 className="font-semibold">Help Content Includes:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Understanding casualty and infrastructure data</li>
              <li>✓ Data sources and methodology explanations</li>
              <li>✓ Interactive chart and navigation guides</li>
              <li>✓ Accessibility features documentation</li>
              <li>✓ Frequently asked questions</li>
              <li>✓ Export and sharing instructions</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg space-y-3">
            <h3 className="font-semibold">Features:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Searchable article library</li>
              <li>✓ Categorized content organization</li>
              <li>✓ Related articles suggestions</li>
              <li>✓ Tag-based filtering</li>
              <li>✓ Smooth animations and transitions</li>
              <li>✓ Mobile-responsive design</li>
            </ul>
          </div>
        </div>

        <div className="p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-3">Content Categories:</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {helpCategories.map((category) => (
              <div key={category.id} className="flex items-start gap-2">
                <div className="mt-1">{category.icon}</div>
                <div>
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {category.articles.length} articles
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

HelpPanelDemo.displayName = "HelpPanelDemo";
