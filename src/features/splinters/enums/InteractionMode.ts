export enum InteractionMode {
  Initial = "initial",
  Manual = "manual",
  OnTimeline = "on-timeline",
}

export const formatInteractionMode = (
  value: InteractionMode | undefined
): string | undefined => {
  switch (value) {
    case InteractionMode.Initial:
      return undefined;
    case InteractionMode.Manual:
      return "Manual";
    case InteractionMode.OnTimeline:
      return "Timeline";
    default:
      return value;
  }
};
