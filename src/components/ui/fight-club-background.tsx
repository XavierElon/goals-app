"use client";

import React from "react";
import { BackgroundMovingCards } from "./background-moving-cards";

export function FightClubBackground() {
  return (
    <div className="relative min-h-screen">
      <BackgroundMovingCards
        items={fightClubQuotes}
        direction="left"
        speed="slow"
        pauseOnHover={false}
      />
      <div className="relative z-10">
        {/* Your main content goes here */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Your App Content
          </h1>
          <p className="text-center text-lg">
            This content will appear above the moving Fight Club quotes background.
          </p>
        </div>
      </div>
    </div>
  );
}

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