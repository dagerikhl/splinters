import { Badge } from "@/common/components/badges/Badge";
import {
  formatInteractionMode,
  InteractionMode,
} from "@/features/splinters/enums/InteractionMode";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";

export const InteractionModeBadge = () => {
  const { interactionMode } = useSplintersContext();

  if (interactionMode === InteractionMode.Initial) {
    return <div />;
  }

  return (
    <Badge title="Interaction mode">
      {formatInteractionMode(interactionMode)}
    </Badge>
  );
};
