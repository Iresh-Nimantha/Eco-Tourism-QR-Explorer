// components/HeroSection.tsx

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { districtData as cards } from '../data/districtData';

// Reusable SVG Arrow Icon
const SliderArrowIcon = ({ direction = 'right' }: { direction: 'left' | 'right' }) => {
  if (direction === 'left') {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6 text-black"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>;
  }
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6 text-black"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;
};

const CARD_WIDTH = 220;
const CARD_MARGIN = 20;

function getVisibleDesktopCards(width: number) {
    return Math.max(1, Math.floor((width + CARD_MARGIN) / (CARD_WIDTH + CARD_MARGIN)));
}

const HeroSection = () => {
    const router = useRouter();
    const [bg, setBg] = useState(cards[0].image);
    const [current, setCurrent] = useState(0);
    const [visibleDesktop, setVisibleDesktop] = useState(4);
    const cardContainerRef = useRef<HTMLDivElement>(null);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        function handleResize() {
            let width = cardContainerRef.current?.offsetWidth || window.innerWidth - 180;
            setVisibleDesktop(getVisibleDesktopCards(width));
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        const id = setTimeout(handleResize, 50);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(id);
        };
    }, []);

    const go = (dir: number) => {
        setTransitioning(true);
        setTimeout(() => setTransitioning(false), 320);
        setCurrent((prev) => (prev + dir + cards.length) % cards.length);
    };

    const getVisibleCards = () => {
        return Array.from({ length: visibleDesktop }).map(
            (_, i) => cards[(current + i) % cards.length]
        );
    };

    useEffect(() => {
        setBg(cards[current % cards.length].image);
    }, [current]);

    useEffect(() => {
        const interval = setInterval(() => go(1), 6500);
        return () => clearInterval(interval);
    }, [visibleDesktop, current]);

    // MOBILE logic
    const CARD_COUNT = cards.length;
    const fullMobileCards = [...cards, ...cards, ...cards];
    const sliderScrollRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const container = sliderScrollRef.current;
        if (container) {
            const child = container.children[CARD_COUNT];
            if (child) (child as HTMLElement).scrollIntoView({ behavior: 'instant' });
            setBg(cards[0].image);
        }
    }, []);

    const handleMobileScroll = () => {
        if (!sliderScrollRef.current) return;
        const container = sliderScrollRef.current;
        const cardW = container.firstChild ? (container.firstChild as HTMLElement).offsetWidth + 12 : 188;
        const scroll = container.scrollLeft;
        const idx = Math.round(scroll / cardW);
        const realIdx = ((idx % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
        setBg(cards[realIdx].image);

        clearTimeout(scrollTimeout.current!);
        scrollTimeout.current = setTimeout(() => {
            if (idx < CARD_COUNT) {
                container.scrollLeft += CARD_COUNT * cardW;
            } else if (idx >= CARD_COUNT * 2) {
                container.scrollLeft -= CARD_COUNT * cardW;
            }
        }, 80);
    };

    return (
        <main
            className="relative flex min-h-screen flex-col items-center justify-center transition-all duration-500"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 z-0 bg-black/40" />
            {/* --- FIX: Added responsive top padding (pt) for better balance on larger screens --- */}
            <div className="relative z-10 flex w-full flex-col items-center gap-y-12 pt-20 pb-10 md:pt-32 lg:pt-30">
                <div className="flex w-full max-w-2xl flex-col items-center px-4 text-center">
                    <h1 className="mb-4 text-3xl font-semibold leading-tight tracking-tight text-white drop-shadow sm:text-4xl md:text-5xl lg:text-6xl">
                        Sri Lanka,
                        <br className="block md:hidden" /> Instantly Revealed
                    </h1>
                    <p className="max-w-2xl text-base leading-snug text-white drop-shadow sm:text-lg md:leading-normal">
                        Every place has a story. Scan our QR codes at destinations across the island
                        to unlock the history, culture, and beauty hidden in plain sight.
                    </p>
                    <button className="mt-8 transform rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white shadow-lg drop-shadow-md transition-all duration-300 hover:scale-105 hover:bg-emerald-700">
                        Explore places
                    </button>
                </div>

                <div className="w-full md:hidden">
                    <div
                        ref={sliderScrollRef}
                        onScroll={handleMobileScroll}
                        className="scrollbar-hide snap-x snap-mandatory flex flex-row gap-3 overflow-x-auto px-4"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {fullMobileCards.map((card, idx) => (
                            <div
                                key={`${card.title}-${idx}`}
                                onClick={() => setBg(card.image)}
                                className="group snap-center relative h-56 w-44 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent bg-white/25 shadow-2xl backdrop-blur transition hover:border-emerald-600"
                            >
                                <img src={card.image} alt={card.title} className="h-full w-full object-cover" draggable={false} />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-white">
                                            {card.title}
                                        </span>
                                        <button
                                            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition-all duration-300"
                                            onClick={(e) => { e.stopPropagation(); router.push(card.href); }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-4 w-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden w-full max-w-[1440px] grid-cols-[auto_1fr_auto] items-center justify-center gap-x-4 px-8 md:grid">
                    <button
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow outline-none transition hover:bg-blue-100"
                        onClick={() => go(-1)}
                    >
                        <SliderArrowIcon direction="left" />
                    </button>

                    <div
                        ref={cardContainerRef}
                        className={`flex items-center justify-center gap-5 overflow-hidden transition-all duration-500 ease-in-out ${
                            transitioning ? 'opacity-80' : 'opacity-100'
                        }`}
                    >
                        {getVisibleCards().map((card, idx) => (
                            <div
                                key={card.title + idx}
                                onClick={() => setBg(card.image)}
                                className="group relative h-80 w-[220px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent bg-white/20 shadow-2xl backdrop-blur transition hover:border-emerald-600"
                            >
                                <img src={card.image} alt={card.title} className="h-full w-full object-cover" draggable={false} />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg font-semibold leading-snug text-white">
                                            {card.title}
                                        </div>
                                        <button
                                            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition-all duration-300 ease-in-out md:scale-90 md:opacity-0 group-hover:scale-100 group-hover:opacity-100"
                                            onClick={(e) => { e.stopPropagation(); router.push(card.href); }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-4 w-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow outline-none transition hover:bg-blue-100"
                        onClick={() => go(1)}
                    >
                        <SliderArrowIcon direction="right" />
                    </button>
                </div>
            </div>
        </main>
    );
};

export default HeroSection;