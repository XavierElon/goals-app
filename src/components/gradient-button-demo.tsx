"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Button as StatefulButton } from "@/components/ui/stateful-button";

export default function GradientButtonDemo() {
  const handleClick = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Gradient Button Examples</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="gradient">Gradient Button</Button>
          <Button variant="gradient" size="sm">Small Gradient</Button>
          <Button variant="gradient" size="lg">Large Gradient</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Stateful Gradient Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <StatefulButton variant="gradient" onClick={handleClick}>
            Loading Gradient
          </StatefulButton>
          <StatefulButton variant="gradient" size="sm" onClick={handleClick}>
            Small Loading
          </StatefulButton>
          <StatefulButton variant="gradient" size="lg" onClick={handleClick}>
            Large Loading
          </StatefulButton>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="gradient">Gradient</Button>
        </div>
      </div>
    </div>
  );
} 