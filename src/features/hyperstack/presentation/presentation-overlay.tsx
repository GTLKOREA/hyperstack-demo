import { motion } from "framer-motion";

interface PresentationOverlayProps {
  title: string;
  headline: string;
  caption: string;
  stepLabel: string;
  narrativeSteps: string[];
  activeNarrativeLabel: string;
  timestamp: string;
  isPlaying: boolean;
  isFullscreen: boolean;
  playbackSpeed: number;
  currentStep: number;
  totalSteps: number;
  openingMessage?: string | null;
  closingMessage?: string | null;
}

function getCaptionSupport(caption: string, headline: string) {
  if (caption === headline) {
    return caption;
  }

  return caption;
}

export function PresentationOverlay({
  title,
  headline,
  caption,
  stepLabel,
  narrativeSteps,
  activeNarrativeLabel,
  timestamp,
  isPlaying,
  isFullscreen,
  playbackSpeed,
  currentStep,
  totalSteps,
  openingMessage,
  closingMessage,
}: PresentationOverlayProps) {
  const progress = totalSteps <= 1 ? 1 : currentStep / Math.max(totalSteps - 1, 1);
  const captionSupport = getCaptionSupport(caption, headline);
  const isOpeningStep = Boolean(openingMessage);
  const isClosingStep = Boolean(closingMessage);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,24,0.78)_0%,rgba(4,8,14,0.82)_100%)] px-5 py-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl md:px-6"
        >
          <p className="text-[10px] uppercase tracking-[0.32em] text-cyan/72">Guided Presentation</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/56">
            <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-2 text-cyan/88">{title}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2">{stepLabel}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2">{timestamp}</span>
          </div>
          {isOpeningStep ? (
            <p className="mt-4 max-w-xl font-display text-[clamp(1.6rem,2.8vw,3.2rem)] leading-[1.08] tracking-[-0.05em] text-white">
              {openingMessage}
            </p>
          ) : (
            <>
              <p className="mt-4 text-[11px] uppercase tracking-[0.32em] text-white/46">Narrative Focus</p>
              <p className="mt-2 font-display text-[clamp(1.45rem,2.4vw,2.6rem)] leading-[1.12] tracking-[-0.045em] text-white">
                {headline}
              </p>
            </>
          )}
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 md:text-[0.96rem]">{captionSupport}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="hidden max-w-md rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,24,0.74)_0%,rgba(4,8,14,0.82)_100%)] px-5 py-5 shadow-[0_28px_90px_rgba(0,0,0,0.36)] backdrop-blur-2xl lg:block"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/46">Presenter Status</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.24em] text-white/58">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">{isPlaying ? "Autoplay Active" : "Paused"}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">{isFullscreen ? "Fullscreen" : "Windowed"}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">Speed {playbackSpeed.toFixed(1)}x</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/62">
            Space or K play and pause. Arrows move between narrative steps. F enters fullscreen. Home resets the story.
          </p>
        </motion.div>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,14,24,0.34)_0%,rgba(0,0,0,0.72)_100%)] px-5 py-5 shadow-[0_34px_110px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:px-7 md:py-6">
          <div className="absolute inset-x-12 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]" />

          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(57,230,210,0.95)_0%,rgba(87,184,255,0.92)_48%,rgba(244,201,93,0.92)_100%)]"
              animate={{ width: `${Math.max(progress, 0.05) * 100}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.45fr_0.95fr] xl:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/42">Story Flow</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {narrativeSteps.map((step, index) => {
                  const isActive = step === activeNarrativeLabel || index === currentStep;
                  const isComplete = index < currentStep;

                  return (
                    <motion.div
                      key={`${step}-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`rounded-[22px] border px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? "border-cyan/40 bg-cyan/12 shadow-[0_0_32px_rgba(57,230,210,0.14)]"
                          : isComplete
                            ? "border-white/12 bg-white/[0.055]"
                            : "border-white/8 bg-white/[0.03]"
                      }`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">Stage {index + 1}</p>
                      <p className={`mt-2 text-sm font-medium leading-6 ${isActive ? "text-white" : "text-white/66"}`}>{step}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.02)_100%)] px-5 py-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/42">Step Caption</p>
              <p className="mt-3 font-display text-[clamp(1.2rem,2vw,1.8rem)] leading-[1.15] tracking-[-0.04em] text-white">
                {headline}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/70">{captionSupport}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.24em] text-white/56">
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">{activeNarrativeLabel}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">Step {currentStep + 1} / {Math.max(totalSteps, 1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isClosingStep ? (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mx-auto w-full max-w-4xl rounded-[38px] border border-[#f4c95d]/24 bg-[radial-gradient(circle_at_top,rgba(244,201,93,0.16),transparent_32%),linear-gradient(180deg,rgba(12,16,24,0.92)_0%,rgba(4,7,12,0.96)_100%)] px-7 py-8 text-center shadow-[0_36px_120px_rgba(0,0,0,0.62)] backdrop-blur-2xl md:px-10 md:py-10"
          >
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#f4c95d]/72">Closing Message</p>
            <p className="mt-4 font-display text-[clamp(2rem,4vw,4.4rem)] leading-[1.04] tracking-[-0.06em] text-white">
              HyperStack turns infrastructure into financial assets.
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/74 md:text-lg">
              {closingMessage}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/58">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">Verified KPIs</span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">Auditable Settlement</span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">Investor-Grade Visibility</span>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
