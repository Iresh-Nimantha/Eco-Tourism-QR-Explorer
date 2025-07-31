// components/HowItWorksSection.tsx

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="w-full max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center gap-10 md:flex-row md:gap-8 xl:gap-12">
          {/* Step 1 */}
          <div className="flex max-w-xs flex-1 flex-col items-center min-w-[230px]">
            {/* --- FIX: Changed aspect ratio to be taller --- */}
            <div className="mb-5 aspect-[4/5] w-full overflow-hidden rounded-xl shadow-md">
              <img
                src="/how-1.jpg"
                alt="Spot the Code"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">
              Spot the Code
            </h3>
            <p className="text-center text-lg leading-8 text-gray-600">
              Find our QR markers at landmarks, beaches, and sites of interest.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex max-w-xs flex-1 flex-col items-center min-w-[230px]">
            {/* --- FIX: Changed aspect ratio to be taller --- */}
            <div className="mb-5 aspect-[4/5] w-full overflow-hidden rounded-xl shadow-md">
              <img
                src="/how-2.jpg"
                alt="Point and Scan"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">
              Point and Scan
            </h3>
            <p className="text-center text-lg leading-8 text-gray-600">
              Use your phone's camera. No app, no hassle.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex max-w-xs flex-1 flex-col items-center min-w-[230px]">
            {/* --- FIX: Changed aspect ratio to be taller --- */}
            <div className="mb-5 aspect-[4/5] w-full overflow-hidden rounded-xl shadow-md">
              <img
                src="/how-3.jpg"
                alt="Discover the Story"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">
              Discover the Story
            </h3>
            <p className="text-center text-lg leading-8 text-gray-600">
              Uncover curated details and insights on your screen, instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;