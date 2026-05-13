"use client";

import { Badge } from "@/common/components/badges/Badge";
import {
  formatInteractionMode,
  InteractionMode,
} from "@/features/splinters/enums/InteractionMode";
import { useInteractionMode } from "@/features/splinters/store/splintersStore";

export const InteractionModeBadge = () => {
  const interactionMode = useInteractionMode();

  if (interactionMode === InteractionMode.Initial) {
    return <div />;
  }

  return (
    <Badge title="Interaction mode">
      {formatInteractionMode(interactionMode)}
    </Badge>
  );
};
