"use client";

import { SectionContainer } from "@repo/ui/components/SectionContainer";
import React from "react";

const stats = [
  {
    number: "50K+",
    label: "Happy Customers",
    description: "Athletes worldwide trust BodyFuel",
  },
  {
    number: "98%",
    label: "Satisfaction Rate",
    description: "Customer satisfaction guaranteed",
  },
  {
    number: "100+",
    label: "Premium Products",
    description: "Science-backed formulations",
  },
  {
    number: "5 Years",
    label: "Industry Experience",
    description: "Proven track record of excellence",
  },
];

const StatsSection = () => {
  return (
    <div className="bg-gradient-to-r from-primary dark:to-primary/80 to-primary/100 text-white">
      <SectionContainer>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Champions
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Our commitment to quality and results speaks for itself
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4">
                <div className="text-4xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold mb-2 text-white/90">
                  {stat.label}
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default StatsSection;
