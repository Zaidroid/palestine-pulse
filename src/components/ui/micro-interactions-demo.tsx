/**
 * Micro-Interactions Demo
 * Demonstrates all micro-interaction components and utilities
 */

import * as React from 'react';
import {
  InteractiveButton,
  InteractiveElement,
  FocusRing,
  useInteractionState,
  createInteractionVariants,
} from '../../lib/animation/interaction-feedback';
import { AnimatedSwitch, AnimatedSwitchWithLabel } from './animated-switch';
import {
  SimpleAnimatedTooltip,
  InfoTooltip,
  MetricTooltip,
  AnimatedTooltipProvider,
} from './animated-tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { motion } from 'framer-motion';

export const MicroInteractionsDemo: React.FC = () => {
  const [switchChecked, setSwitchChecked] = React.useState(false);
  const [switchChecked2, setSwitchChecked2] = React.useState(true);
  const [switchChecked3, setSwitchChecked3] = React.useState(false);

  return (
    <AnimatedTooltipProvider>
      <div className="container mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Micro-Interactions Demo</h1>
          <p className="text-muted-foreground">
            Explore interactive feedback utilities, animated switches, and tooltips
          </p>
        </div>

        {/* Button Press Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Button Press Animations</CardTitle>
            <CardDescription>
              Buttons with press (scale 0.95) and hover (scale 1.05) animations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <InteractiveButton
                variant="both"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
              >
                Press & Hover
              </InteractiveButton>

              <InteractiveButton
                variant="press"
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium"
              >
                Press Only
              </InteractiveButton>

              <InteractiveButton
                variant="hover"
                className="px-6 py-3 bg-accent text-accent-foreground rounded-md font-medium"
              >
                Hover Only
              </InteractiveButton>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Interactive elements (cards, links, etc.):
              </p>
              <div className="flex flex-wrap gap-4">
                <InteractiveElement
                  variant="hover"
                  className="p-4 border rounded-lg bg-card cursor-pointer"
                >
                  <p className="font-medium">Hover Card</p>
                  <p className="text-sm text-muted-foreground">
                    Scales up on hover
                  </p>
                </InteractiveElement>

                <InteractiveElement
                  variant="both"
                  className="p-4 border rounded-lg bg-card cursor-pointer"
                  onClick={() => console.log('Clicked')}
                >
                  <p className="font-medium">Interactive Element</p>
                  <p className="text-sm text-muted-foreground">
                    Hover and press animations
                  </p>
                </InteractiveElement>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Focus Ring Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Focus Ring Animations</CardTitle>
            <CardDescription>
              Animated focus indicators for accessibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <FocusRingExample />
              <CustomFocusRingExample />
            </div>
          </CardContent>
        </Card>

        {/* Toggle Switch Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle Switch Animations</CardTitle>
            <CardDescription>
              Switches with spring physics for smooth state transitions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <AnimatedSwitch
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                  size="sm"
                />
                <label className="text-sm">Small switch</label>
              </div>

              <div className="flex items-center gap-3">
                <AnimatedSwitch
                  checked={switchChecked2}
                  onCheckedChange={setSwitchChecked2}
                  size="md"
                />
                <label className="text-sm">Medium switch (default)</label>
              </div>

              <div className="flex items-center gap-3">
                <AnimatedSwitch
                  checked={switchChecked3}
                  onCheckedChange={setSwitchChecked3}
                  size="lg"
                />
                <label className="text-sm">Large switch</label>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <AnimatedSwitchWithLabel
                label="Enable notifications"
                description="Receive notifications about important updates"
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
              />

              <AnimatedSwitchWithLabel
                label="Dark mode"
                description="Switch between light and dark themes"
                labelPosition="left"
                checked={switchChecked2}
                onCheckedChange={setSwitchChecked2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tooltip Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltip Animations</CardTitle>
            <CardDescription>
              Tooltips with fade + slide animations from trigger direction (200ms delay)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-3">Directional tooltips:</p>
                <div className="flex flex-wrap gap-4">
                  <SimpleAnimatedTooltip content="Tooltip on top" side="top">
                    <Button variant="outline">Top</Button>
                  </SimpleAnimatedTooltip>

                  <SimpleAnimatedTooltip content="Tooltip on right" side="right">
                    <Button variant="outline">Right</Button>
                  </SimpleAnimatedTooltip>

                  <SimpleAnimatedTooltip content="Tooltip on bottom" side="bottom">
                    <Button variant="outline">Bottom</Button>
                  </SimpleAnimatedTooltip>

                  <SimpleAnimatedTooltip content="Tooltip on left" side="left">
                    <Button variant="outline">Left</Button>
                  </SimpleAnimatedTooltip>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Info tooltip:</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Hover for more information</span>
                  <InfoTooltip
                    content="This is additional information that helps explain the feature."
                    side="right"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Metric tooltip:</p>
                <MetricTooltip
                  title="Total Users"
                  definition="The total number of registered users in the system, including active and inactive accounts."
                  side="right"
                >
                  <div className="inline-flex items-center gap-2 p-3 border rounded-lg cursor-help">
                    <span className="text-2xl font-bold">12,345</span>
                    <span className="text-sm text-muted-foreground">users</span>
                  </div>
                </MetricTooltip>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Custom delay:</p>
                <div className="flex flex-wrap gap-4">
                  <SimpleAnimatedTooltip
                    content="No delay"
                    delayDuration={0}
                  >
                    <Button variant="outline">Instant</Button>
                  </SimpleAnimatedTooltip>

                  <SimpleAnimatedTooltip
                    content="200ms delay (default)"
                    delayDuration={200}
                  >
                    <Button variant="outline">Default</Button>
                  </SimpleAnimatedTooltip>

                  <SimpleAnimatedTooltip
                    content="500ms delay"
                    delayDuration={500}
                  >
                    <Button variant="outline">Slow</Button>
                  </SimpleAnimatedTooltip>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Interaction Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Interaction Variants</CardTitle>
            <CardDescription>
              Create custom interaction animations with different scales and durations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <CustomVariantExample
                hoverScale={1.1}
                pressScale={0.9}
                label="Exaggerated"
              />
              <CustomVariantExample
                hoverScale={1.02}
                pressScale={0.98}
                label="Subtle"
              />
              <CustomVariantExample
                hoverScale={1.15}
                pressScale={0.85}
                label="Dramatic"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedTooltipProvider>
  );
};

/**
 * Focus Ring Example Component
 */
const FocusRingExample: React.FC = () => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="relative">
      <button
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        Focus Me
      </button>
      <FocusRing isFocused={isFocused} />
    </div>
  );
};

/**
 * Custom Focus Ring Example
 */
const CustomFocusRingExample: React.FC = () => {
  const { isFocused, interactionProps } = useInteractionState();

  return (
    <div className="relative">
      <button
        className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium"
        {...interactionProps}
      >
        Custom Focus
      </button>
      <FocusRing
        isFocused={isFocused}
        color="hsl(var(--secondary))"
      />
    </div>
  );
};

/**
 * Custom Variant Example
 */
interface CustomVariantExampleProps {
  hoverScale: number;
  pressScale: number;
  label: string;
}

const CustomVariantExample: React.FC<CustomVariantExampleProps> = ({
  hoverScale,
  pressScale,
  label,
}) => {
  const variants = createInteractionVariants({ hoverScale, pressScale });

  return (
    <motion.button
      className="px-6 py-3 bg-accent text-accent-foreground rounded-md font-medium"
      variants={variants}
      initial="rest"
      whileHover="hover"
      whileTap="press"
    >
      {label}
    </motion.button>
  );
};

export default MicroInteractionsDemo;
