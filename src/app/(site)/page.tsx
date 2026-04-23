import Hero from '@/components/sections/Hero';
import AgenticAI from '@/components/sections/AgenticAI';
import TailoredSoftware from '@/components/sections/TailoredSoftware';
import EngineeredYourWay from '@/components/sections/EngineeredYourWay';
import RealImpact from '@/components/sections/RealImpact';
import GlobalTalent from '@/components/sections/GlobalTalent';
import InsightsGrid from '@/components/sections/InsightsGrid';
import CTAStrip from '@/components/ui/CTAStrip';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AgenticAI />
      <TailoredSoftware />
      <EngineeredYourWay />
      <RealImpact />
      <GlobalTalent />
      <InsightsGrid />
      <CTAStrip />
    </>
  );
}
