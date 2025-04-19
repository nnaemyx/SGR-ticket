"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import CountdownTimer from "./components/CountdownTimer";
import { EmailDialog } from "./components/EmailDialog";
import TicketList from "./components/TicketList";
import { TicketCategory } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: "ravers",
    name: "RAVERS",
    price: 20000,
    description: "1 pass",
  },
  {
    id: "geng-of-six",
    name: "GENG OF SIX",
    price: 100000,
    description: "6 pass",
  },
];

const HERO_IMAGES = ["/hero/Frame 75.svg", "/hero/Frame 75 (1).svg"];

const LIFESTYLE_IMAGES = [
  "/lifestyle/DSC04087[1] 1.svg",
  "/lifestyle/DSC04105[1] 1.svg",
  "/lifestyle/DSC04274[1] 2.svg",
  "/lifestyle/DSC04290[1] 1.svg",
  "/lifestyle/DSC04296[1] 1.svg",
];

const SPONSORS = [
  {
    name: "BI Homes",
    logo: "/sponsors/L in P flex EI Homes 1.png",
  },
  {
    name: "EL Logistics",
    logo: "/sponsors/L in P flex EI Logistics 1.png",
  },
  {
    name: "UGO Lifestyle",
    logo: "/sponsors/L in P flex UGO Lifestyle 1.png",
  },
];

export default function Home() {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check for email in localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  const nextSlide = () => {
    setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentHeroImage(
      (prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length
    );
  };

  const handleEmailSubmit = (email: string) => {
    console.log('Email submitted:', email);
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
    setEmailDialogOpen(false);
  };

  return (
    <main className="min-h-screen bg-white ">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-2 px-[23px] ">
          <div className="flex justify-between items-center">
            <Image
              src="/images/L in P flex logo 1.svg"
              alt="Lagos in Port Harcourt"
              width={214}
              height={214}
              className=""
              priority
            />
            <button
              onClick={() => setEmailDialogOpen(true)}
              className="bg-[#067976] text-white pt-[19.55px] pb-[13.39px] pl-[10.93px] pr-[6.59px] rounded-[1000px] text-[12px] leading-3 transform rotate-[-8deg] font-bold"
            >
              Get your <br />
              Ticket <br />
              Now!
            </button>
          </div>
        </div>

        {/* Hero Images Slider */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <div className="flex gap-[18px] pl-[23px]">
              {HERO_IMAGES.map((image, index) => (
                <div
                  key={index}
                  className="relative w-[340px] min-h-[210px] flex-shrink-0 overflow-hidden scrollbar-hide"
                >
                  <Image
                    src={image}
                    alt={`Event preview ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 px-4 text-sm text-gray-500 text-center">
            Scroll to see more →
          </div>
        </div>

        <div className="mx-auto">
          {/* Countdown Timer */}
          <CountdownTimer />

          {/* Ticket Categories */}
          <div className="px-[26px] mt-8">
            <h2 className="text-[32px] text-center font-bold mb-4 ">
              Ticket Categories
            </h2>
            <TicketList 
              categories={TICKET_CATEGORIES} 
              userEmail={userEmail} 
              onEmailSubmit={handleEmailSubmit}
            />
          </div>
          <div className="w-full h-[196px] bg-black mt-[49px]">
            <Image
              src="/images/SGR LOGO MAIN copy 1.png"
              alt="Logo"
              width={233}
              height={233}
              className="object-cover mx-auto "
            />
          </div>
          {/* Lifestyle Images Marquee */}
          <div className=" ">
            <Marquee
              speed={20}
              gradient={false}
              className="h-[540px] overflow-hidden"
            >
              {LIFESTYLE_IMAGES.map((image, index) => (
                <div
                  key={index}
                  className="h-[540px] relative"
                  style={{ width: "400px" }}
                >
                  <Image
                    src={image}
                    alt={`Lifestyle preview ${index + 1}`}
                    fill
                    className="object-cover "
                  />
                </div>
              ))}
            </Marquee>
          </div>

          {/* Sponsors */}
          <div className="mt-12 px-[21.51px]">
            <h3 className="text-[32px] font-bold mb-4">
              Our Sponsors:
            </h3>
            <div className="relative overflow-hidden">
              <Marquee speed={40} gradient={false} className="py-4">
                {[...SPONSORS, ...SPONSORS].map((sponsor, index) => (
                  <div key={index} className="mx-8">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={100}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center bg-black text-sm text-white py-[17px]">
            © 2025 Lagos in Port Harcourt
          </footer>
        </div>
      </div>

      {/* Email Dialog */}
      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSubmit={handleEmailSubmit}
      />
    </main>
  );
}
