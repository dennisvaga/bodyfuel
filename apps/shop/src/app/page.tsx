import React from "react";
import HeroSection from "@components/home-page/HeroSection";
import NewArrivalsSection from "../components/home-page/NewArrivalsSection";
import FeaturesSection from "../components/home-page/FeaturesSection";
import CategoriesSection from "../components/home-page/CategoriesSection";
import BestSellersSection from "../components/home-page/BestSellersSection";
import StatsSection from "../components/home-page/StatsSection";
import TestimonialsSection from "../components/home-page/TestimonialsSection";
import SaleItemsSection from "../components/home-page/SaleItemsSection";
import NewsletterSection from "../components/home-page/NewsletterSection";
import CTASection from "../components/home-page/CTASection";

const Home = () => {
  return (
    <main>
      <HeroSection />
      <NewArrivalsSection />
      <FeaturesSection />
      {/* <CategoriesSection /> */}
      <BestSellersSection />
      <StatsSection />
      <TestimonialsSection />
      <SaleItemsSection />
      <NewsletterSection />
      {/* <CTASection /> */}
    </main>
  );
};

export default Home;
