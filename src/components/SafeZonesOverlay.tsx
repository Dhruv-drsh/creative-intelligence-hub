import { motion } from "framer-motion";

interface SafeZone {
  id: string;
  name: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface SafeZonesOverlayProps {
  zones: SafeZone[];
  canvasWidth: number;
  canvasHeight: number;
  visible: boolean;
}

export const SafeZonesOverlay = ({ zones, canvasWidth, canvasHeight, visible }: SafeZonesOverlayProps) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none z-10"
    >
      {zones.map((zone) => {
        // Calculate position based on zone definition
        const style: React.CSSProperties = {
          position: "absolute",
          borderStyle: "dashed",
          borderWidth: "2px",
          borderColor: "hsl(38 92% 50% / 0.6)",
          backgroundColor: "hsl(38 92% 50% / 0.08)",
        };

        if (zone.bottom > 0 && zone.top === 0) {
          // Top zone
          style.top = 0;
          style.left = zone.left || 0;
          style.right = zone.right || 0;
          style.height = zone.bottom;
        } else if (zone.top > 0 && zone.bottom === 0) {
          // Bottom zone (measured from bottom)
          style.bottom = 0;
          style.left = zone.left || 0;
          style.right = zone.right || 0;
          style.height = zone.top;
        } else if (zone.right > 0) {
          // Right-side zone for bottom area
          style.bottom = 0;
          style.right = 0;
          style.width = zone.right;
          style.height = zone.top || canvasHeight;
        }

        return (
          <div key={zone.id} style={style}>
            <span className="absolute top-1 left-1 text-[10px] text-warning/80 font-medium bg-background/80 px-1 rounded">
              {zone.name}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
};
