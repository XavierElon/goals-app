"use client";

import React from "react";
import { BackgroundMovingCards } from "@/components/ui/background-moving-cards";

export default function DemoPage() {
  const fightClubQuotes = [
    {
      quote:
        "The first rule of Fight Club is: you do not talk about Fight Club. The second rule of Fight Club is: you DO NOT talk about Fight Club!",
      name: "Tyler Durden",
      title: "Fight Club",
    },
    {
      quote:
        "We buy things we don't need with money we don't have to impress people we don't like.",
      name: "Tyler Durden",
      title: "Fight Club",
    },
    {
      quote:
        "Maybe self-improvement isn't the answer, maybe self-destruction is the answer.",
      name: "Tyler Durden",
      title: "Fight Club",
    },
    {
      quote:
        "I am Jack's complete lack of surprise. I am Jack's smirking revenge.",
      name: "Narrator",
      title: "Fight Club",
    },
    {
      quote:
        "The things you own end up owning you. It's only after you've lost everything that you're free to do anything.",
      name: "Tyler Durden",
      title: "Fight Club",
    },
    {
      quote:
        "This is your life and it's ending one minute at a time.",
      name: "Tyler Durden",
      title: "Fight Club",
    },
    {
      quote:
        "You are not your job, you're not how much money you have in the bank. You are not the car you drive. You're not the contents of your wallet.",
      name: "Tyler Durden",
      title: "Fight Club",
    },
    {
      quote:
        "I wanted to destroy everything beautiful I'd never have.",
      name: "Narrator",
      title: "Fight Club",
    },
    {
      quote:
        "We've all been raised on television to believe that one day we'd all be millionaires, and movie gods, and rock stars. But we won't. And we're slowly learning that fact. And we're very, very pissed off.",
      name: "Tyler Durden",
      title: "Fight Club",
    },
    {
      quote:
        "I am Jack's broken heart. I am Jack's wasted life. I am Jack's complete lack of surprise.",
      name: "Narrator",
      title: "Fight Club",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background moving cards */}
      <BackgroundMovingCards
        items={fightClubQuotes}
        direction="left"
        speed="slow"
        pauseOnHover={false}
      />
      
      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Fight Club Background Demo
        </h1>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">About This Demo</h2>
          <p className="text-gray-700 mb-6">
            This page demonstrates the infinite moving cards component with Fight Club quotes 
            running in the background. The cards are now centered, more visible with a dark theme, 
            and move slowly from left to right with enhanced opacity for better readability.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Infinite loop animation</li>
                <li>• Reduced opacity for background effect</li>
                <li>• Smooth scrolling motion</li>
                <li>• Responsive design</li>
                <li>• Dark mode support</li>
              </ul>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Customization</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Direction: left/right</li>
                <li>• Speed: fast/normal/slow</li>
                <li>• Pause on hover</li>
                <li>• Custom quotes and styling</li>
                <li>• Z-index control</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">How to Use</h3>
            <p className="text-sm text-blue-700">
              The background moving cards are now integrated into your main app page. 
              You can customize the quotes, speed, direction, and styling by modifying 
              the component props and CSS classes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 