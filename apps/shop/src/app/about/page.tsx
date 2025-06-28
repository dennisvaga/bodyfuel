import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import aboutBodyfuel from "@media/about-bodyfuel.png";
import { SectionContainer } from "@repo/ui/components/SectionContainer";
import { Button } from "@repo/ui/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | BodyFuel",
  description:
    "Learn about BodyFuel's mission to help you achieve your fitness goals with premium nutrition products.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <SectionContainer className="py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Our Mission</h1>
          <p className="text-lg text-center max-w-2xl mx-auto mb-8 text-muted-foreground">
            At BodyFuel, we're committed to providing clean, powerful
            supplements that support your fitness goals with science-backed
            formulas and uncompromising quality.
          </p>

          <div className="mb-12 flex justify-center">
            <Image
              src={aboutBodyfuel}
              alt="BodyFuel Team"
              width={600}
              height={400}
              className="rounded-xl max-w-full h-auto"
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
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/contact-us">Contact Us</Link>
              </Button>
            </div>
          </section>
        </div>
      </SectionContainer>
    </main>
  );
}
