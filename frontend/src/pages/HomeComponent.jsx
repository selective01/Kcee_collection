import Hero from "../components/Hero";
import NewArrivals from "../components/NewArrivals";
import Categories from "../components/Categories";
import Testimonials from "../components/Testimonial";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="Shop the latest fashion collections at Kcee Collection — hoodies, jeans, shoes, jerseys and more."
        image="https://kceecollection.com/og-image.jpg"
        url="https://kceecollection.com/"
      />
      <Hero />
      <NewArrivals />
      <Categories />
      <Testimonials />
    </>
  );
}
