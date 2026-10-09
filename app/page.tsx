import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative">
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <Hero />
        <Footer />
      </div>
    </main>
  );
}
