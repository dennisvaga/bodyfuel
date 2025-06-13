"use client";

import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

const CTASection = () => {
  return (
    <div className="bg-gradient-to-br from-background via-primary/5 to-background dark:from-background dark:via-primary/10 dark:to-background">
      <SectionContainer>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Ready to <span className="primary-text-gradient">Transform</span>{" "}
            Your Fitness?
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of athletes who have achieved their goals with
            BodyFuel's premium supplements. Your transformation starts today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-xl">
              <Link href="/products" className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <span>Shop All Products</span>
                <ArrowRight size={20} />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-xl border-2 hover:bg-primary/5 dark:hover:bg-primary/10"
            >
              <Link href="/about" className="flex items-center gap-3">
                <MessageCircle size={20} />
                <span>Learn More</span>
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-border/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">✓</div>
              <p className="text-sm text-muted-foreground">
                30-Day Money Back Guarantee
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">🚚</div>
              <p className="text-sm text-muted-foreground">
                Free Shipping on Orders $50+
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">🏆</div>
              <p className="text-sm text-muted-foreground">
                Award-Winning Customer Service
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default CTASection;
