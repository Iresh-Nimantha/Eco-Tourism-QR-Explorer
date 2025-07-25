// components/AboutUsSection.tsx

const sponsors = [
    { name: 'Lifebuoy', logo: 'lifebuoy.png' },
    { name: 'SLT Mobitel', logo: 'slt.png' },
    { name: 'Maggi', logo: 'maggi.png' },
    { name: 'Maliban', logo: 'maliban.png' },
    { name: 'Peoples Bank', logo: 'peoples-bank.png' },
];

const displaySponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

const AboutUsSection = () => {
    return (
        <section className="relative z-10 bg-white py-24 sm:py-32" id="about">
            {/* Main Content Wrapper */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    {/* Left Column: Text Content */}
                    <div className="lg:pr-4">
                        <div className="relative mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
                            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                                About Us
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Chartered in 2017, the Leo Club of the University of Colombo, Faculty of Arts, is a youth-led initiative dedicated to community enhancement and leadership development.
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Our mission is to create a more enriched society through sustainable, impactful projects. We tackle key challenges across healthcare, education, environmental stewardship, and social empowerment, turning passion into positive action. We are proud to nurture the spirit of responsible citizenship and empower the next generation of leaders.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="relative w-full max-w-xl lg:max-w-lg">
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
                            <img
                                src="/leoclub.jpg" 
                                alt="Leo Club members working on a project"
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NEW: Sponsors Section with Title --- */}
            <div className="mt-24 sm:mt-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-center text-2xl font-semibold leading-8 text-gray-900">
                        Our Partners & Sponsors
                    </h2>
                </div>
                {/* Sponsor Scroller */}
                <div className="mt-16 w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <div className="flex w-max animate-[scroll_60s_linear_infinite] items-center gap-x-10 sm:gap-x-16">
                        {displaySponsors.map((sponsor, index) => (
                            <div key={index} className="flex-none" title={sponsor.name}>
                                <img
                                    className="max-h-10 w-auto object-contain sm:max-h-16"
                                    src={`/sponsors/${sponsor.logo}`}
                                    alt={sponsor.name}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsSection;