"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import heroBanner1 from "@media/hero-banners/hero-banner-1.png";
import heroBanner2 from "@media/hero-banners/hero-banner-2.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@repo/ui/components/ui/carousel";

const sliderImages = [
  { src: heroBanner1, alt: "Hero Banner 1" },
  { src: heroBanner2, alt: "Hero Banner 2" },
  // Add more images as needed
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
    }, 7000); // 5 seconds interval

    // Cleanup interval on unmount
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
          {sliderImages.map((image, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="relative w-full">
                <Image
                  alt={image.alt}
                  src={image.src}
                  priority={index === 0}
                  quality={100}
                  width={1920}
                  height={450}
                  className="object-cover object-center w-full h-[250px] md:h-[350px] lg:h-[450px]"
                />
                <div
                  aria-label="Image overlay"
                  className="absolute inset-0 opacity-70"
                ></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default HeroSection;
