"use client";

/**
 * HeroSection - Main landing carousel for BodyFuel shop
 * Features auto-rotating product banners with custom gradient backgrounds
 * Responsive layout with specific mobile/desktop configurations
 */

import Image from "next/image";
import React, { useEffect, useState } from "react";
import heroProteinImage from "@media/hero-banners/hero-image-protein.png";
import heroAthleteImage from "@media/hero-banners/hero-banner-athlete.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@repo/ui/components/ui/carousel";
import { cn } from "@repo/ui/lib/utils";
import { SectionContainer } from "@/src/layouts/SectionContainer";

/**
 * Slide content configuration for hero carousel
 * Each slide contains brand messaging, imagery, and a CTA
 * The alignment property determines layout direction (text left or right of image)
 */
const sliderImages = [
  {
    src: heroProteinImage,
    alt: "Protein Products Banner",
    heading: "FUEL YOUR POTENTIAL",
    subheading: "PREMIUM FITNESS NUTRITION",
    description:
      "Experience top-tier supplements trusted by athletes and fitness pros. Crafted for results, designed for your goals.",
    ctaText: "SHOP NOW",
    ctaLink: "/products",
    alignment: "left",
  },
  {
    src: heroAthleteImage,
    alt: "Athlete Hydration Banner",
    heading: "Real Fuel. Real Athletes.",
    subheading: "Stay hydrated. Recover faster. Perform better.",
    description:
      "Formulated for performance. Trusted by runners, lifters, and athletes who never settle.",
    ctaText: "DISCOVER MORE",
    ctaLink: "/about",
    alignment: "right",
  },
];

const HeroSection = () => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    /**
     * Auto-rotate carousel slides only when tab is visible
     * Improves performance and prevents unexpected slide changes
     * when user returns to the tab
     */
    const autoplayInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        api.scrollNext();
      }
    }, 7000); // 7 seconds interval

    return () => clearInterval(autoplayInterval);
  }, [api]);

  return (
    <div className="relative overflow-hidden">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          loop: true,
          align: "center",
        }}
      >
        <CarouselContent>
          {sliderImages.map((slide, index) => (
            <CarouselItem key={index} className="w-full">
              {/*
               * Main slide container with responsive height
               * Each slide has a unique gradient background based on product type
               */}
              <div className="relative w-full h-[600px] md:h-[400px] lg:h-[500px]">
                {/* Full-width background gradient that spans entire viewport */}
                <div
                  className={`absolute w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-full z-0 ${
                    index === 0
                      ? "bg-gradient-to-b from-amber-900/80 via-amber-950/90 to-stone-900 dark:from-amber-900/60 dark:via-amber-950/70 dark:to-stone-950"
                      : "bg-gradient-to-b from-slate-700/80 via-slate-800/90 to-slate-900 dark:from-slate-800/60 dark:via-slate-900/70 dark:to-slate-950"
                  }`}
                ></div>

                {/* Content container with layout class for content width control */}
                <SectionContainer className="!py-[0rem] relative z-10 flex flex-col gap-4 md:gap-8 md:flex-row w-full h-full justify-end">
                  {/* Product image container - order changes based on alignment */}
                  <div
                    className={cn(
                      `w-full h-[200px] md:h-full relative order-1 md:order-2`,
                      slide.alignment === "right"
                        ? "order-2 md:order-1"
                        : "order-1  md:order-2"
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        priority={index === 0}
                        quality={100}
                        width={450}
                        height={0}
                        className="object-contain pb-0"
                        style={{
                          maxWidth: "80%",
                          maxHeight: "90%",
                        }}
                      />
                    </div>
                  </div>

                  {/* Content column with marketing messaging - order changes based on alignment */}
                  <div
                    className={cn(
                      `w-full h-[300px] md:h-full flex flex-col items-center md:items-start justify-center p-6 md:p-10`,
                      slide.alignment === "right"
                        ? "order-1 md:order-2 text-right md:text-right"
                        : "order-2 md:order-1 text-left md:text-left"
                    )}
                  >
                    <h2
                      className={`text-4xl md:text-start text-center lg:text-6xl font-bold text-[#ff5c35] mb-2 md:mb-3`}
                    >
                      {slide.heading}
                    </h2>
                    <p className="text-2xl md:text-start text-center lg:text-4xl text-white font-semibold mb-2 md:mb-3">
                      {slide.subheading}
                    </p>
                    <p className="text-base md:text-start text-center text-white mb-4 md:mb-6 max-w-md">
                      {slide.description}
                    </p>
                    <button className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-bold py-2 px-8 rounded-md transition-colors uppercase">
                      {slide.ctaText}
                    </button>
                  </div>
                </SectionContainer>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation arrows only visible on tablet and larger screens */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </div>
      </Carousel>
    </div>
  );
};

export default HeroSection;
