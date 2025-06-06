"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 dark:from-primary/5 dark:via-background dark:to-primary/10">
      <SectionContainer>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 dark:bg-primary/30 text-primary mb-8">
            <Mail size={32} strokeWidth={1.5} />
          </div>

          <h2 className="text-xl md:text-5xl font-bold mb-4 text-foreground">
            Stay <span className="primary-text-gradient">Fueled</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Get exclusive access to new products, workout tips, nutrition
            guides, and special offers delivered straight to your inbox.
          </p>

          {!isSubscribed ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="h-12 px-8 rounded-xl font-semibold"
              >
                Subscribe
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400 font-medium">
              <CheckCircle size={24} />
              <span>Thanks for subscribing! Check your inbox.</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-4">
            Join 10,000+ athletes who trust our nutrition insights. Unsubscribe
            anytime.
          </p>
        </div>
      </SectionContainer>
    </div>
  );
};

export default NewsletterSection;
