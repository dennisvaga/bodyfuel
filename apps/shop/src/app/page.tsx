import React from "react";
import HeroSection from "@components/home-page/HeroSection";
import CollectionsSection from "../components/home-page/CollectionsSection";

const Home = () => {
  return (
    <main>
      <section>
        <HeroSection></HeroSection>
      </section>
      <section className="py-[6rem]">
        <CollectionsSection></CollectionsSection>
      </section>
    </main>
  );
};

export default Home;
