import React from 'react';

export default function Story() {
  return (
    <section id="story" className="flex flex-col lg:flex-row lg:items-start px-margin-mobile py-space-md bg-surface-container-low xl:max-w-7xl xl:mx-auto w-full gap-space-md lg:gap-space-xl">
      <div className="flex flex-col gap-space-xs mb-space-sm text-center lg:text-left lg:w-1/2 lg:sticky lg:top-32">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">Our Craft & Passion</span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface leading-snug">
          Made by Hand. Baked with Care.
        </h2>
      </div>

      <div className="bg-surface p-space-md rounded-2xl shadow-sm flex flex-col gap-space-sm lg:w-1/2">
        <div className="flex items-center gap-space-sm">
          <img src="/images/logo.png" alt="Monogram" className="w-10 h-10 object-contain rounded-full bg-surface-container p-1" />
          <div>
            <h3 className="font-title-md text-title-md text-on-surface">The Morning Ritual</h3>
            <p className="font-label-sm text-label-sm text-secondary">Slow fermentation & dialed roasts</p>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          At Brew & Bite, we believe the best moments happen around warm tables. Every morning begins with sourdough dough stretched by hand, specialty beans dialed in for the perfect espresso pull, and locally sourced plant-based ingredients crafted to perfection.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 pt-space-xs">
          <div className="flex flex-col p-2.5 rounded-xl bg-surface-container text-center">
            <span className="font-headline-sm text-headline-sm text-secondary font-bold">72h</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Cold Sourdough Ferment</span>
          </div>
          <div className="flex flex-col p-2.5 rounded-xl bg-surface-container text-center">
            <span className="font-headline-sm text-headline-sm text-secondary font-bold">100%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Plant-Based Ingredients</span>
          </div>
          <div className="flex flex-col p-2.5 rounded-xl bg-surface-container text-center col-span-2 lg:col-span-1">
            <span className="font-headline-sm text-headline-sm text-secondary font-bold">Direct</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Ethical Trade Coffee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
