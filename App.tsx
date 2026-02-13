import React, { useState, useEffect, useRef } from 'react';
import { Heart, Gamepad2, Trophy } from 'lucide-react';
import { AppStage, Position } from './types';
import FloatingHearts from './components/FloatingHearts';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.PROPOSAL);
  const [noBtnPos, setNoBtnPos] = useState<Position | null>(null);
  const [yesBtnScale, setYesBtnScale] = useState(1);
  const [noHoverCount, setNoHoverCount] = useState(0);

  // Refs for button dimensions to ensure it stays in viewport
  const containerRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  // --- Logic for the Evasive "No" Button ---
  const moveNoButton = () => {
    // Get actual button dimensions if available, otherwise use estimates
    let btnWidth = 200;
    let btnHeight = 100;

    if (noBtnRef.current) {
      const rect = noBtnRef.current.getBoundingClientRect();
      btnWidth = rect.width;
      btnHeight = rect.height;
    }

    // Add padding to ensure button stays comfortably within viewport
    const padding = 20;
    const safetyMargin = 10; // Extra margin for safety

    // Calculate available space for the button to move
    const availableWidth = window.innerWidth - btnWidth - (2 * padding) - safetyMargin;
    const availableHeight = window.innerHeight - btnHeight - (2 * padding) - safetyMargin;

    // Generate random position within safe boundaries
    // Ensure we have positive space to work with
    const newLeft = padding + Math.random() * Math.max(0, availableWidth);
    const newTop = padding + Math.random() * Math.max(0, availableHeight);

    setNoBtnPos({ left: newLeft, top: newTop });

    // Make the Yes button grow slightly every time they try to click No
    setYesBtnScale(prev => Math.min(prev + 0.1, 2.0));
    setNoHoverCount(prev => prev + 1);
  };

  const handleYesClick = () => {
    setStage(AppStage.ACCEPTED);
  };

  // Handle window resize to keep button in bounds
  useEffect(() => {
    const handleResize = () => {
      if (noBtnPos && noBtnRef.current) {
        const rect = noBtnRef.current.getBoundingClientRect();
        const padding = 20;
        const safetyMargin = 10;

        let newLeft = noBtnPos.left;
        let newTop = noBtnPos.top;
        let needsUpdate = false;

        // Check if button is out of bounds horizontally
        if (newLeft + rect.width > window.innerWidth - padding) {
          newLeft = window.innerWidth - rect.width - padding - safetyMargin;
          needsUpdate = true;
        }
        if (newLeft < padding) {
          newLeft = padding;
          needsUpdate = true;
        }

        // Check if button is out of bounds vertically
        if (newTop + rect.height > window.innerHeight - padding) {
          newTop = window.innerHeight - rect.height - padding - safetyMargin;
          needsUpdate = true;
        }
        if (newTop < padding) {
          newTop = padding;
          needsUpdate = true;
        }

        if (needsUpdate) {
          setNoBtnPos({ left: newLeft, top: newTop });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [noBtnPos]);

  // --- Render Proposal Stage ---
  const renderProposal = () => {
    const isFixed = noBtnPos !== null;

    const funnyMessages = [
      "NO WAY",
      "ERROR 404",
      "TRY AGAIN",
      "LOCKED",
      "GLITCH?",
      "NICE TRY",
      "NOPE.EXE",
      "RETRY?",
    ];

    const currentNoText = funnyMessages[Math.min(noHoverCount, funnyMessages.length - 1)];

    return (
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 text-center pb-16">
        
        {/* Header Section */}
        <div className="mb-6 animate-float">
            <h1 className="font-pixel text-[#EEADAE] text-2xl md:text-4xl text-shadow-md tracking-wider mb-2 leading-tight">
                VALENTINE<br/>GAME NIGHT
            </h1>
            <div className="flex items-center justify-center gap-2">
                <div className="h-1 w-12 bg-[#EEADAE]"></div>
                <Gamepad2 className="text-[#EEADAE]" />
                <div className="h-1 w-12 bg-[#EEADAE]"></div>
            </div>
        </div>

        {/* Game Card Container */}
        <div className="bg-[#E2D5CA] border-4 border-[#620725] p-2 rounded-xl pixel-shadow max-w-lg w-full transform rotate-1 transition-transform hover:rotate-0">
            <div className="border-2 border-dashed border-[#A15668] p-6 rounded-lg bg-[#E2D5CA]">
                
                {/* Script Header */}
                <h2 className="font-script text-5xl md:text-6xl text-[#620725] mb-6 drop-shadow-sm">
                    Would You Rather
                </h2>

                {/* Question */}
                <p className="font-pixel text-xs md:text-sm text-[#A15668] mb-8 uppercase tracking-widest mt-8">
                    Player 1 Selects:
                </p>

                <div className="flex flex-col md:flex-row items-center gap-6 justify-center relative min-h-[80px]">
                
                {/* YES Card/Button */}
                <button
                    onClick={handleYesClick}
                    style={{ transform: `scale(${yesBtnScale})` }}
                    className="group relative bg-[#EEADAE] border-4 border-[#620725] px-6 py-4 rounded-lg pixel-shadow-sm hover:translate-y-1 hover:shadow-none transition-all duration-100 flex flex-col items-center min-w-[160px]"
                >
                    <span className="font-pixel text-[10px] text-[#620725] mb-1">OPTION A</span>
                    <span className="font-bold text-[#910D2B] text-lg">BE MY VALENTINE</span>
                    <Heart className="w-5 h-5 text-[#910D2B] mt-2 animate-bounce" fill="currentColor" />
                </button>

                <div className="font-pixel text-[#620725] text-xs">OR</div>

                {/* NO Card/Button (Evasive) */}
                <button
                    ref={noBtnRef}
                    onMouseEnter={moveNoButton}
                    onClick={moveNoButton}
                    style={isFixed && noBtnPos ? {
                        position: 'fixed',
                        top: noBtnPos.top,
                        left: noBtnPos.left,
                        zIndex: 50,
                        transition: 'all 0.1s ease-out'
                    } : { transition: 'all 0.1s ease-out' }}
                    className="bg-[#A15668] border-4 border-[#620725] px-6 py-4 rounded-lg pixel-shadow-sm flex flex-col items-center min-w-[160px] cursor-pointer"
                >
                    <span className="font-pixel text-[10px] text-[#E2D5CA] mb-1">OPTION B</span>
                    <span className="font-bold text-[#E2D5CA] text-lg whitespace-nowrap">{currentNoText}</span>
                </button>
                </div>
            </div>
        </div>
      </div>
    );
  };

  // --- Render Accepted Stage ---
  const renderAccepted = () => (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6 text-center animate-in fade-in duration-1000 pb-16">
        
        <div className="mb-6 animate-bounce">
            <Trophy className="text-[#EEADAE] w-16 h-16 mx-auto drop-shadow-md" />
        </div>

      <h1 className="font-pixel text-3xl md:text-5xl text-[#EEADAE] mb-2 drop-shadow-md leading-snug">
        LEVEL COMPLETE!
      </h1>
      <p className="font-pixel text-[#A15668] text-xs md:text-sm mb-8 uppercase tracking-widest">
        New Companion Unlocked
      </p>
      
      <div className="bg-[#E2D5CA] border-4 border-[#620725] p-2 rounded-xl pixel-shadow w-full max-w-2xl">
        <div className="border-2 border-dashed border-[#A15668] p-6 rounded-lg bg-[#E2D5CA]">
            
            <p className="text-2xl md:text-3xl font-bold text-[#620725] mb-4 font-script">
            Your boyfriend will contact you soon!
            </p>
            <div className="h-1 bg-[#A15668] w-24 mx-auto mb-6 opacity-30"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-pattern overflow-x-hidden relative">
      <div className="scanlines"></div>
      <FloatingHearts />
      {stage === AppStage.PROPOSAL ? renderProposal() : renderAccepted()}
      
      {/* Signature */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-30 opacity-40 pointer-events-none">
          <p className="font-pixel text-[8px] md:text-[10px] text-[#EEADAE] tracking-widest">
            Made by Muhammad Hamdan Sikandar
          </p>
      </div>
    </div>
  );
};

export default App;