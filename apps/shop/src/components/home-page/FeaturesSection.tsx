"use client";

import React from "react";
import { Shield, Truck, Award, Users } from "lucide-react";
import { SectionContainer } from "@repo/ui/components/SectionContainer";
import { Card } from "@repo/ui/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Premium Quality",
    description:
      "Science-backed formulas with the highest quality ingredients, rigorously tested for purity and potency.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description:
      "Free shipping on orders over $50. Get your supplements delivered quickly and safely to your door.",
  },
  {
    icon: Award,
    title: "Proven Results",
    description:
      "Trusted by athletes and fitness enthusiasts worldwide. See real results with our effective formulations.",
  },
  {
    icon: Users,
    title: "Expert Support",
    description:
      "Our team of nutrition experts is here to help you achieve your fitness goals with personalized guidance.",
  },
];

const FeaturesSection = () => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 dark:from-primary/5 dark:via-background dark:to-primary/10">
      <SectionContainer>
        <div className="text-center mb-16 ">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="primary-text-gradient">BodyFuel</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to delivering the highest quality supplements to
            fuel your fitness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group text-center p-6 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-1"
            >
              <div className="inline-flex items-center  justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 dark:from-primary/25 dark:to-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white dark:group-hover:text-white transition-all duration-300 shadow-sm border border-primary/10 dark:border-primary/20">
                <feature.icon size={32} strokeWidth={1.8} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default FeaturesSection;
