"use client";

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

    // Setup autoplay
    const autoplayInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        api.scrollNext();
      }
    }, 7000); // 7 seconds interval

    // Cleanup interval on unmount
    return () => clearInterval(autoplayInterval);
  }, [api]);

  return (
    <div className="relative overflow-hidden bg-black">
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
              <div className="layout relative flex flex-col gap-4 md:gap-8 md:flex-row w-full h-[600px] md:h-[400px] lg:h-[440px]">
                {/* Image column */}
                <div
                  className={cn(
                    `w-full h-[300px] md:h-full relative md:order-2`,
                    slide.alignment === "right" ? "md:order-1" : "md:order-2"
                  )}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    priority={index === 0}
                    quality={100}
                    fill
                    className="object-contain object-center"
                  />
                </div>

                {/* Text column */}
                <div
                  className={cn(
                    `w-full h-[300px] md:h-full flex flex-col items-center md:items-start justify-center p-6 md:p-10`,
                    slide.alignment === "right"
                      ? "md:order-2 text-right md:text-right" // When right aligned
                      : "md:order-1 text-left md:text-left" // When left aligned, change to order-1
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
                  <button className="bg-[#ff5c35] hover:bg-[#ff5c35]/90 text-white font-bold py-2 px-8 rounded-md transition-colors uppercase">
                    {slide.ctaText}
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </div>
      </Carousel>
    </div>
  );
};

export default HeroSection;
