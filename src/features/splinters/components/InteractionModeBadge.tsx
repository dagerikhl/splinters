import { Badge } from "@/common/components/badges/Badge";
import {
  formatInteractionMode,
  InteractionMode,
} from "@/features/splinters/enums/InteractionMode";

export interface InteractionModeBadgeProps {
  value?: InteractionMode;
}

export const InteractionModeBadge = ({ value }: InteractionModeBadgeProps) => (
  <Badge title="Interaction mode">{formatInteractionMode(value)}</Badge>
);
