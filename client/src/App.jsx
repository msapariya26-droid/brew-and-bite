import React, { useState } from 'react';
import { MotionConfig } from 'motion/react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';
import MobileMenu from './components/layout/MobileMenu';
import Hero from './components/sections/Hero';
import Story from './components/sections/Story';
import Specials from './components/sections/Specials';
import MenuSection from './components/sections/MenuSection';
import Booking from './components/sections/Booking';
import Visit from './components/sections/Visit';
import Toast from './components/ui/Toast';
import { PreorderProvider } from './context/PreorderContext';
import { useScrollSpy } from './hooks/useScrollSpy';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useScrollSpy(['home', 'story', 'specials', 'menu', 'book', 'visit'], 150);

  return (
    <PreorderProvider>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen flex flex-col">
          <Header activeSection={activeSection} onMenuClick={() => setIsMobileMenuOpen(true)} />
          <main className="flex-1 flex flex-col relative w-full pt-20">
            <Hero />
            <Story />
            <Specials />
            <MenuSection />
            <Booking />
            <Visit />
          </main>
          <Footer />
          <BottomNav activeSection={activeSection} />
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} activeSection={activeSection} />
          <Toast message="Item Added" visible={false} />
        </div>
      </MotionConfig>
    </PreorderProvider>
  );
}

export default App;
