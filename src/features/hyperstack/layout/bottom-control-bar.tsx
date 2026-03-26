import { scenarios } from "@/data/hyperstack";
import { useHyperStackStore } from "@/store/use-hyperstack-store";
import { Button, Chip } from "@/components/ui";

export function BottomControlBar({
  isFullscreen,
  onToggleFullscreen,
}: {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  const {
    selectedScenarioId,
    isPlaying,
    playbackSpeed,
    presentationMode,
    resetScenario,
    setPlaybackSpeed,
    setScenario,
    stepBackward,
    stepForward,
    togglePlayback,
    togglePresentationMode,
  } = useHyperStackStore();

  return (
    <section className={`glass-panel mt-5 flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between ${presentationMode ? "border-white/12 bg-[linear-gradient(180deg,rgba(7,14,24,0.74)_0%,rgba(4,8,14,0.82)_100%)]" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" onClick={togglePlayback}>{isPlaying ? "Pause" : "Play"}</Button>
        <Button onClick={stepBackward}>Previous</Button>
        <Button onClick={stepForward}>Next</Button>
        <Button onClick={resetScenario}>Reset</Button>
        <Button onClick={togglePresentationMode}>
          {presentationMode ? "Presentation On" : "Presentation Off"}
        </Button>
        <Button onClick={onToggleFullscreen}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
        <Chip>Playback {playbackSpeed.toFixed(1)}x</Chip>
        {presentationMode && <Chip tone="layer">Meeting Ready</Chip>}
        <div className="flex items-center gap-2">
          {[0.75, 1, 1.5, 2].map((speed) => {
            const active = playbackSpeed === speed;
            return (
              <button
                key={speed}
                type="button"
                onClick={() => setPlaybackSpeed(speed)}
                className={`rounded-full border px-3 py-2 text-sm transition-all duration-300 ${
                  active
                    ? "border-white/16 bg-white/[0.09] text-white shadow-[0_14px_34px_rgba(12,68,124,0.16)]"
                    : "border-white/8 bg-black/20 text-white/58 hover:border-white/14 hover:text-white"
                }`}
              >
                {speed}x
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario, index) => {
            const active = scenario.id === selectedScenarioId;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setScenario(scenario.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                  active
                    ? "border-white/16 bg-white/[0.09] text-white shadow-[0_14px_34px_rgba(0,0,0,0.18)]"
                    : "border-white/8 bg-black/20 text-white/58 hover:border-white/14 hover:text-white"
                }`}
              >
                {presentationMode ? `${index + 1}. ${scenario.name}` : scenario.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}