import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import aboutBodyfuel from "@media/about-bodyfuel.png";

export const metadata: Metadata = {
  title: "About Us | BodyFuel",
  description:
    "Learn about BodyFuel's mission to help you achieve your fitness goals with premium nutrition products.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="layout mx-auto py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Our Mission</h1>
          <p className="text-lg text-center max-w-2xl mx-auto mb-8 text-muted-foreground">
            At BodyFuel, we're committed to providing clean, powerful
            supplements that support your fitness goals with science-backed
            formulas and uncompromising quality.
          </p>

          <div className="mb-12 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src={aboutBodyfuel}
              alt="BodyFuel Team"
              fill
              className="object-contain"
              quality={100}
              priority
            />
          </div>

          {/* Last section */}
          <section className="text-center py-[6rem]">
            <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 text-muted-foreground">
              Ready to fuel your fitness journey with products you can trust?
              Explore our collections, chat with our AI assistant for
              personalized recommendations, or reach out to our team with any
              questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/collections"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md text-center"
              >
                Browse Products
              </a>
              <a
                href="/contact-us"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md text-center"
              >
                Contact Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
