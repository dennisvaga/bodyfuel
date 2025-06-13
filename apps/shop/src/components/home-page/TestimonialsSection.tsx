"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { SectionContainer } from "@repo/ui/components/SectionContainer";
import { Card } from "@repo/ui/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Personal Trainer",
    content:
      "BodyFuel's protein has been a game-changer for my clients. The quality is outstanding and the results speak for themselves.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Mike Chen",
    role: "Marathon Runner",
    content:
      "I've tried many supplements, but BodyFuel's recovery formula actually works. I feel the difference in my training.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Fitness Enthusiast",
    content:
      "Clean ingredients, great taste, and real results. BodyFuel has become an essential part of my daily routine.",
    rating: 5,
    avatar: "ER",
  },
];

const TestimonialsSection = () => {
  return (
    <div className="bg-muted/30 dark:bg-muted/10">
      <SectionContainer>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="primary-text-gradient">Athletes</span> Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust BodyFuel for their
            fitness nutrition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 group"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8">
                <div className="bg-primary text-white p-3 rounded-full shadow-lg">
                  <Quote size={20} fill="currentColor" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center font-semibold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default TestimonialsSection;
