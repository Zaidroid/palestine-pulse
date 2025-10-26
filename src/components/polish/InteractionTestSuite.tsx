/**
 * Interaction Test Suite
 * 
 * Development tool to test all interaction patterns.
 * Tests hover states, click feedback, and smooth transitions.
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedSwitch } from '@/components/ui/animated-switch';
import { Slider } from '@/components/ui/slider';
import { 
  buttonInteraction, 
  cardInteraction, 
  iconButtonInteraction,
  badgeInteraction,
  linkInteraction,
  createRipple,
  supportsHover,
  isTouchDevice,
} from '@/lib/interaction-polish';
import { 
  Heart, 
  Star, 
  ThumbsUp, 
  Share2, 
  Bookmark,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

export function InteractionTestSuite() {
  const [switchState, setSwitchState] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Interaction Test Suite</h1>
        <p className="text-muted-foreground">
          Test all interaction patterns for consistency and smoothness
        </p>
        <div className="flex gap-2">
          <Badge variant={supportsHover() ? 'default' : 'secondary'}>
            Hover: {supportsHover() ? 'Supported' : 'Not Supported'}
          </Badge>
          <Badge variant={isTouchDevice() ? 'default' : 'secondary'}>
            Touch: {isTouchDevice() ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
      </div>
      
      {/* Button Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Button Interactions</CardTitle>
          <CardDescription>
            Test hover scale (1.05) and tap scale (0.95) with 200ms duration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <motion.div {...buttonInteraction}>
              <Button>Primary Button</Button>
            </motion.div>
            
            <motion.div {...buttonInteraction}>
              <Button variant="secondary">Secondary Button</Button>
            </motion.div>
            
            <motion.div {...buttonInteraction}>
              <Button variant="outline">Outline Button</Button>
            </motion.div>
            
            <motion.div {...buttonInteraction}>
              <Button variant="ghost">Ghost Button</Button>
            </motion.div>
            
            <motion.div {...buttonInteraction}>
              <Button variant="destructive">Destructive Button</Button>
            </motion.div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button onClick={createRipple} className="relative overflow-hidden">
              Button with Ripple
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Icon Button Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Button Interactions</CardTitle>
          <CardDescription>
            Test hover scale (1.1) with rotation (5deg) and tap scale (0.9) with rotation (-5deg)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <motion.button
              {...iconButtonInteraction}
              className="p-2 rounded-full hover:bg-accent"
            >
              <Heart className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              {...iconButtonInteraction}
              className="p-2 rounded-full hover:bg-accent"
            >
              <Star className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              {...iconButtonInteraction}
              className="p-2 rounded-full hover:bg-accent"
            >
              <ThumbsUp className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              {...iconButtonInteraction}
              className="p-2 rounded-full hover:bg-accent"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              {...iconButtonInteraction}
              className="p-2 rounded-full hover:bg-accent"
            >
              <Bookmark className="h-5 w-5" />
            </motion.button>
          </div>
        </CardContent>
      </Card>
      
      {/* Card Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Card Interactions</CardTitle>
          <CardDescription>
            Test hover scale (1.02) with shadow elevation and tap scale (0.98)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div {...cardInteraction}>
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Interactive Card 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Hover to see elevation effect
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...cardInteraction}>
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Interactive Card 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to see tap feedback
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...cardInteraction}>
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Interactive Card 3</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Smooth 300ms transition
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>
      
      {/* Badge Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Interactions</CardTitle>
          <CardDescription>
            Test hover scale (1.05) with upward movement (-2px)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <motion.div {...badgeInteraction}>
              <Badge>Default Badge</Badge>
            </motion.div>
            
            <motion.div {...badgeInteraction}>
              <Badge variant="secondary">Secondary Badge</Badge>
            </motion.div>
            
            <motion.div {...badgeInteraction}>
              <Badge variant="outline">Outline Badge</Badge>
            </motion.div>
            
            <motion.div {...badgeInteraction}>
              <Badge variant="destructive">Destructive Badge</Badge>
            </motion.div>
            
            <motion.div {...badgeInteraction}>
              <Badge className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                With Icon
              </Badge>
            </motion.div>
          </div>
        </CardContent>
      </Card>
      
      {/* Link Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Link Interactions</CardTitle>
          <CardDescription>
            Test hover translation (2px right) with 200ms duration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <motion.a
              {...linkInteraction}
              href="#"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Primary Link →
            </motion.a>
            
            <br />
            
            <motion.a
              {...linkInteraction}
              href="#"
              className="text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-1"
            >
              Muted Link →
            </motion.a>
            
            <br />
            
            <motion.a
              {...linkInteraction}
              href="#"
              className="text-destructive hover:underline inline-flex items-center gap-1"
            >
              Destructive Link →
            </motion.a>
          </div>
        </CardContent>
      </Card>
      
      {/* Form Control Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Form Control Interactions</CardTitle>
          <CardDescription>
            Test switch spring physics and slider smooth transitions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <AnimatedSwitch
              checked={switchState}
              onCheckedChange={setSwitchState}
            />
            <span className="text-sm">
              Switch with spring physics (stiffness: 500, damping: 30)
            </span>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Slider with smooth transitions
            </label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Value: {sliderValue[0]}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Status Indicator Interactions</CardTitle>
          <CardDescription>
            Test icon animations with color transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <motion.div
              {...iconButtonInteraction}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 cursor-pointer"
            >
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium">Success</span>
            </motion.div>
            
            <motion.div
              {...iconButtonInteraction}
              className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 cursor-pointer"
            >
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium">Error</span>
            </motion.div>
            
            <motion.div
              {...iconButtonInteraction}
              className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 cursor-pointer"
            >
              <AlertCircle className="h-5 w-5 text-warning" />
              <span className="text-sm font-medium">Warning</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
      
      {/* Transition Timing Test */}
      <Card>
        <CardHeader>
          <CardTitle>Transition Timing Test</CardTitle>
          <CardDescription>
            Verify consistent timing across all interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Fast (hover/tap):</span>
              <span className="font-mono">200ms</span>
            </div>
            <div className="flex justify-between">
              <span>Normal (cards):</span>
              <span className="font-mono">300ms</span>
            </div>
            <div className="flex justify-between">
              <span>Slow (modals):</span>
              <span className="font-mono">400ms</span>
            </div>
            <div className="flex justify-between">
              <span>Easing:</span>
              <span className="font-mono">cubic-bezier(0.4, 0, 0.2, 1)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
