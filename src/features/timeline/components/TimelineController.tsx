"use client";

import { Button } from "@/common/components/buttons/Button";
import { Slider } from "@/common/components/form/Slider";
import { TIMELINE_EVENTS, tagToTime } from "@/features/cms/cosmere/timeline";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { useEffect } from "react";
import styles from "./TimelineController.module.scss";

const PLAY_SPEED = 1 / 30;
const EPS = 0.0005;

const eventTimes = TIMELINE_EVENTS.map((e) => tagToTime(e.tag));

const findPrevEventTime = (current: number): number | undefined => {
  for (let i = eventTimes.length - 1; i >= 0; i--) {
    if (eventTimes[i] < current - EPS) return eventTimes[i];
  }

  return undefined;
};

const findNextEventTime = (current: number): number | undefined => {
  for (let i = 0; i < eventTimes.length; i++) {
    if (eventTimes[i] > current + EPS) return eventTimes[i];
  }

  return undefined;
};

const findCurrentEvent = (current: number) => {
  let best = TIMELINE_EVENTS[0];
  let bestDiff = Math.abs(eventTimes[0] - current);

  for (let i = 1; i < eventTimes.length; i++) {
    const diff = Math.abs(eventTimes[i] - current);

    if (diff < bestDiff) {
      best = TIMELINE_EVENTS[i];
      bestDiff = diff;
    }
  }

  return { event: best, distance: bestDiff };
};

export const TimelineController = () => {
  const time = useSplintersStore((s) => s.time);
  const setTime = useSplintersStore((s) => s.setTime);
  const isPlaying = useSplintersStore((s) => s.isPlaying);
  const setIsPlaying = useSplintersStore((s) => s.setIsPlaying);

  useEffect(() => {
    if (!isPlaying) return;

    let frame: number;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = (now - last) / 1000;

      last = now;

      const current = useSplintersStore.getState().time;
      const next = current + delta * PLAY_SPEED;

      if (next >= 1) {
        useSplintersStore.getState().setTime(1);
        useSplintersStore.getState().setIsPlaying(false);

        return;
      }

      useSplintersStore.getState().setTime(next);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleSkipBack = () => {
    const prev = findPrevEventTime(time);

    setIsPlaying(false);
    setTime(prev ?? 0);
  };

  const handleSkipForward = () => {
    const next = findNextEventTime(time);

    setIsPlaying(false);
    setTime(next ?? 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  const { event: nearestEvent, distance } = findCurrentEvent(time);
  const isAtEvent = distance < 0.01;

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <Button onClick={handleReset} title="Reset to start">
          ⏮
        </Button>
        <Button onClick={handleSkipBack} title="Skip to previous event">
          ◀◀
        </Button>
        <Button
          onClick={handlePlayPause}
          title={isPlaying ? "Pause" : "Play"}
          className={styles.playButton}
        >
          {isPlaying ? "⏸" : "▶"}
        </Button>
        <Button onClick={handleSkipForward} title="Skip to next event">
          ▶▶
        </Button>
      </div>

      <div className={styles.sliderWrap}>
        <Slider
          value={time}
          minValue={0}
          maxValue={1}
          step={0.001}
          onChange={(v) => {
            setIsPlaying(false);
            setTime(v);
          }}
        />

        <div className={styles.ticks}>
          {TIMELINE_EVENTS.map((event) => {
            const t = tagToTime(event.tag);
            const isCurrent = Math.abs(t - time) < 0.005;

            return (
              <button
                key={event.tag}
                type="button"
                className={`${styles.tick} ${isCurrent ? styles.tickActive : ""}`}
                style={{ left: `${t * 100}%` }}
                title={`${event.tag} — ${event.label}`}
                onClick={() => {
                  setIsPlaying(false);
                  setTime(t);
                }}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.label}>
        {isAtEvent ? (
          <a
            href={nearestEvent.citation}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.eventLink}
            title={nearestEvent.label}
          >
            {nearestEvent.tag}: {nearestEvent.label}
          </a>
        ) : (
          <span className={styles.scrubbing}>
            t = {time.toFixed(3)} (between {nearestEvent.tag})
          </span>
        )}
      </div>
    </div>
  );
};
