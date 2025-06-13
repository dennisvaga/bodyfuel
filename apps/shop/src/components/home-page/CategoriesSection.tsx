"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

const categories = [
  {
    name: "Protein Powders",
    description:
      "Premium whey and plant-based proteins for muscle growth and recovery",
    href: "/categories/protein",
    gradient: "from-blue-500 to-purple-600",
    icon: "💪",
  },
  {
    name: "Pre-Workout",
    description:
      "Energy and focus supplements to maximize your training sessions",
    href: "/categories/pre-workout",
    gradient: "from-red-500 to-orange-500",
    icon: "⚡",
  },
  {
    name: "Vitamins & Health",
    description:
      "Essential vitamins and minerals for overall health and wellness",
    href: "/categories/vitamins",
    gradient: "from-green-500 to-teal-600",
    icon: "🌱",
  },
  {
    name: "Recovery",
    description:
      "Post-workout supplements for faster recovery and muscle repair",
    href: "/categories/recovery",
    gradient: "from-purple-500 to-pink-600",
    icon: "🔄",
  },
];

const CategoriesSection = () => {
  return (
    <div className="bg-muted/30 dark:bg-muted/10">
      <SectionContainer>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by <span className="primary-text-gradient">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect supplements for your fitness goals and lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.href} className="group">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 dark:opacity-15 dark:group-hover:opacity-25 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative p-6 text-center">
                  <div className="text-4xl mb-4 drop-shadow-sm">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors text-foreground">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default CategoriesSection;
