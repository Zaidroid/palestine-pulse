/**
 * Test Component to Verify Frosted Glass Effect
 * 
 * This component tests that the frosted glass effect is working
 * on both Dialog and HoverCard components.
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const FrostedGlassTest = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8 space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Frosted Glass Effect Test</h2>
        <p className="text-muted-foreground mb-6">
          Test the frosted glass effect on dialogs and hover cards.
          The background should be semi-transparent with a blur effect.
        </p>

        <div className="space-y-4">
          {/* Dialog Test */}
          <div>
            <h3 className="font-semibold mb-2">Dialog Test:</h3>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Open Dialog (Should have frosted glass)</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Frosted Glass Dialog</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>This dialog should have:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Semi-transparent background</li>
                    <li>Blur effect (backdrop-blur-xl)</li>
                    <li>No border</li>
                    <li>Deep shadow</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Look at the content behind this dialog - it should be blurred.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* HoverCard Test */}
          <div>
            <h3 className="font-semibold mb-2">HoverCard Test:</h3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline">Hover Me (Should show frosted glass)</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">Frosted Glass HoverCard</h4>
                  <p className="text-sm">This hover card should have:</p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li>Semi-transparent background</li>
                    <li>Blur effect</li>
                    <li>No border</li>
                    <li>Deep shadow</li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <p className="text-white text-center">
            This colorful background helps you see the frosted glass effect better
          </p>
        </div>
      </Card>
    </div>
  );
};
