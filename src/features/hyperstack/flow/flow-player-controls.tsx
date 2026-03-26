import { Button, Chip } from "@/components/ui";
import { flowSemantics } from "@/features/hyperstack/flow/flow-semantics";
import type { FlowId } from "@/types/hyperstack";

interface FlowPlayerControlsProps {
  currentFlowId: FlowId;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  playbackSpeed: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const speedOptions = [0.75, 1, 1.5, 2];

export function FlowPlayerControls({
  currentFlowId,
  isPlaying,
  currentStep,
  totalSteps,
  playbackSpeed,
  onPlayPause,
  onPrevious,
  onNext,
  onReset,
  onSpeedChange,
}: FlowPlayerControlsProps) {
  const progress = totalSteps <= 1 ? 1 : currentStep / (totalSteps - 1);
  const semanticFlow = flowSemantics[currentFlowId];

  return (
    <div className="hs-panel p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" onClick={onPlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
          <Button onClick={onPrevious}>Previous</Button>
          <Button onClick={onNext}>Next</Button>
          <Button onClick={onReset}>Reset</Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Chip>{semanticFlow.badge}</Chip>
          <Chip>Step {currentStep + 1} / {Math.max(totalSteps, 1)}</Chip>
          <Chip>Speed {playbackSpeed.toFixed(2)}x</Chip>
          {speedOptions.map((speed) => {
            const active = playbackSpeed === speed;
            return (
              <button
                key={speed}
                type="button"
                onClick={() => onSpeedChange(speed)}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  active
                    ? "text-white shadow-[0_14px_34px_rgba(0,0,0,0.18)]"
                    : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/18 hover:text-white"
                }`}
                style={active ? { borderColor: `${semanticFlow.accent}55`, background: `${semanticFlow.accent}1c` } : undefined}
              >
                {speed}x
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${Math.max(progress, 0.06) * 100}%`,
            background: `linear-gradient(90deg, ${semanticFlow.accent} 0%, rgba(255,255,255,0.92) 100%)`,
            boxShadow: `0 0 24px ${semanticFlow.glow}`,
          }}
        />
      </div>
    </div>
  );
}