import type { ComponentPropsWithoutRef } from "react";

type ResponsiveImageProps = ComponentPropsWithoutRef<"img">;

export function ResponsiveImage(props: ResponsiveImageProps) {
  return <img {...props} />;
}
