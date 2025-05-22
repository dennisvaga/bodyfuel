import React from "react";
import HeroSection from "@components/home-page/HeroSection";
import CollectionsSection from "../components/home-page/CollectionsSection";

const Home = () => {
  return (
    <main>
      <section>
        <HeroSection></HeroSection>
      </section>
      <section>
        <CollectionsSection></CollectionsSection>
      </section>
    </main>
  );
};

export default Home;
