import React from "react";
import HeroSection from "@components/home-page/HeroSection";
import CollectionsSection from "../components/home-page/CollectionsSection";
import FeaturesSection from "../components/home-page/FeaturesSection";
import CategoriesSection from "../components/home-page/CategoriesSection";
import TestimonialsSection from "../components/home-page/TestimonialsSection";
import StatsSection from "../components/home-page/StatsSection";
import NewsletterSection from "../components/home-page/NewsletterSection";
import CTASection from "../components/home-page/CTASection";

const Home = () => {
  return (
    <main>
      {/* Hero Section - First impression */}
      <HeroSection />

      {/* Collections Section - Show products */}
      <CollectionsSection />

      {/* Features Section - Build trust early */}
      <FeaturesSection />

      {/* Categories Section - Easy navigation */}
      <CategoriesSection />

      {/* Stats Section - Build credibility */}
      <StatsSection />

      {/* Testimonials Section - Social proof */}
      <TestimonialsSection />

      {/* Newsletter Section - Lead capture */}
      <NewsletterSection />

      {/* CTA Section - Final conversion push */}
      <CTASection />
    </main>
  );
};

export default Home;
