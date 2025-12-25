import type { Canvas as FabricCanvas, FabricObject, IText } from 'fabric';

// Minimum font size for AI-generated text
export const MIN_FONT_SIZE = 24;

// Typography scale for different text types
export const TYPOGRAPHY_SCALE = {
  headline: 64,
  subheadline: 48,
  body: 32,
  caption: 24,
};

// Safe zone configurations by platform
export const SAFE_ZONES = {
  'instagram-feed': { top: 40, bottom: 40, left: 40, right: 40 },
  'instagram-story': { top: 120, bottom: 180, left: 40, right: 40 },
  'facebook-feed': { top: 30, bottom: 30, left: 30, right: 30 },
  'facebook-cover': { top: 20, bottom: 20, left: 20, right: 20 },
  'instore-banner': { top: 50, bottom: 50, left: 80, right: 80 },
  'instore-poster': { top: 60, bottom: 60, left: 60, right: 60 },
};

/**
 * Centers an object on the canvas
 */
export function centerObjectOnCanvas(canvas: FabricCanvas, obj: FabricObject): void {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  
  obj.set({
    left: canvasWidth / 2,
    top: canvasHeight / 2,
    originX: 'center',
    originY: 'center',
  });
  
  obj.setCoords();
}

/**
 * Centers an object horizontally on the canvas
 */
export function centerHorizontally(canvas: FabricCanvas, obj: FabricObject): void {
  const canvasWidth = canvas.getWidth();
  obj.set({
    left: canvasWidth / 2,
    originX: 'center',
  });
  obj.setCoords();
}

/**
 * Positions text with proper centering and safe zone awareness
 */
export function positionTextCentered(
  canvas: FabricCanvas,
  obj: FabricObject,
  verticalPosition: 'top' | 'center' | 'bottom' = 'center',
  formatId: string = 'instagram-feed'
): void {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const safeZone = SAFE_ZONES[formatId as keyof typeof SAFE_ZONES] || SAFE_ZONES['instagram-feed'];
  
  let top = canvasHeight / 2;
  
  switch (verticalPosition) {
    case 'top':
      top = safeZone.top + 80;
      break;
    case 'bottom':
      top = canvasHeight - safeZone.bottom - 80;
      break;
    case 'center':
    default:
      top = canvasHeight / 2;
  }
  
  obj.set({
    left: canvasWidth / 2,
    top,
    originX: 'center',
    originY: 'center',
  });
  
  obj.setCoords();
}

/**
 * Ensures text doesn't overflow the canvas boundaries
 */
export function autoCorrectOverflow(
  canvas: FabricCanvas,
  obj: FabricObject,
  formatId: string = 'instagram-feed'
): boolean {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const safeZone = SAFE_ZONES[formatId as keyof typeof SAFE_ZONES] || SAFE_ZONES['instagram-feed'];
  
  const boundingRect = obj.getBoundingRect();
  let corrected = false;
  
  // Check left boundary
  if (boundingRect.left < safeZone.left) {
    obj.set({ left: (obj.left || 0) + (safeZone.left - boundingRect.left) });
    corrected = true;
  }
  
  // Check right boundary
  if (boundingRect.left + boundingRect.width > canvasWidth - safeZone.right) {
    obj.set({
      left: (obj.left || 0) - ((boundingRect.left + boundingRect.width) - (canvasWidth - safeZone.right)),
    });
    corrected = true;
  }
  
  // Check top boundary
  if (boundingRect.top < safeZone.top) {
    obj.set({ top: (obj.top || 0) + (safeZone.top - boundingRect.top) });
    corrected = true;
  }
  
  // Check bottom boundary
  if (boundingRect.top + boundingRect.height > canvasHeight - safeZone.bottom) {
    obj.set({
      top: (obj.top || 0) - ((boundingRect.top + boundingRect.height) - (canvasHeight - safeZone.bottom)),
    });
    corrected = true;
  }
  
  if (corrected) {
    obj.setCoords();
  }
  
  return corrected;
}

/**
 * Applies minimum font size to text objects
 */
export function enforceMinFontSize(obj: FabricObject, minSize: number = MIN_FONT_SIZE): boolean {
  if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
    const textObj = obj as IText;
    if ((textObj.fontSize || 0) < minSize) {
      textObj.set({ fontSize: minSize });
      return true;
    }
  }
  return false;
}

/**
 * Gets the appropriate font size based on text type
 */
export function getFontSizeForType(type: 'headline' | 'subheadline' | 'body' | 'caption'): number {
  return TYPOGRAPHY_SCALE[type] || TYPOGRAPHY_SCALE.body;
}

/**
 * Applies typography harmony to all text on canvas
 */
export function applyTypographyHarmony(
  canvas: FabricCanvas,
  headingFont: string,
  bodyFont: string,
  options: {
    applyToAll?: boolean;
    selectedOnly?: boolean;
    minFontSize?: number;
  } = {}
): number {
  const { applyToAll = true, selectedOnly = false, minFontSize = MIN_FONT_SIZE } = options;
  
  let updatedCount = 0;
  const objects = selectedOnly
    ? canvas.getActiveObjects()
    : canvas.getObjects();
  
  objects.forEach((obj) => {
    if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
      const textObj = obj as IText;
      const fontSize = textObj.fontSize || 16;
      
      // Enforce minimum font size
      if (fontSize < minFontSize) {
        textObj.set({ fontSize: minFontSize });
      }
      
      // Apply font based on size (headings vs body)
      if (fontSize >= 32) {
        textObj.set({ fontFamily: headingFont });
      } else {
        textObj.set({ fontFamily: bodyFont });
      }
      
      updatedCount++;
    }
  });
  
  canvas.renderAll();
  return updatedCount;
}

/**
 * Applies color palette to canvas objects
 */
export function applyColorPalette(
  canvas: FabricCanvas,
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    cta?: string;
    background?: string;
  },
  options: {
    applyToShapes?: boolean;
    applyToText?: boolean;
    applyToBackground?: boolean;
  } = {}
): number {
  const {
    applyToShapes = true,
    applyToText = true,
    applyToBackground = true,
  } = options;
  
  let updatedCount = 0;
  
  // Apply background color
  if (applyToBackground && colors.background) {
    canvas.backgroundColor = colors.background;
    updatedCount++;
  }
  
  const objects = canvas.getObjects();
  
  objects.forEach((obj, index) => {
    // Apply colors to shapes
    if (applyToShapes && (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'polygon' || obj.type === 'path')) {
      // First shape gets primary, buttons/CTA get accent
      const isButton = obj.type === 'rect' && (obj.height || 0) < 100 && index > 0;
      
      if (isButton) {
        obj.set({ fill: colors.cta || colors.accent });
      } else if (index % 3 === 0) {
        obj.set({ fill: colors.primary });
      } else if (index % 3 === 1) {
        obj.set({ fill: colors.secondary });
      } else {
        obj.set({ fill: colors.accent });
      }
      updatedCount++;
    }
    
    // Apply colors to text
    if (applyToText && (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox')) {
      const textObj = obj as IText;
      const fontSize = textObj.fontSize || 16;
      
      // Headings get primary, body gets secondary or dark
      if (fontSize >= 48) {
        textObj.set({ fill: colors.primary });
      } else if (fontSize >= 32) {
        textObj.set({ fill: colors.secondary });
      }
      // Smaller text keeps its color for readability
      
      updatedCount++;
    }
  });
  
  canvas.renderAll();
  return updatedCount;
}

/**
 * Checks if object is within safe zones
 */
export function isWithinSafeZones(
  canvas: FabricCanvas,
  obj: FabricObject,
  formatId: string = 'instagram-feed'
): boolean {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const safeZone = SAFE_ZONES[formatId as keyof typeof SAFE_ZONES] || SAFE_ZONES['instagram-feed'];
  
  const boundingRect = obj.getBoundingRect();
  
  return (
    boundingRect.left >= safeZone.left &&
    boundingRect.top >= safeZone.top &&
    boundingRect.left + boundingRect.width <= canvasWidth - safeZone.right &&
    boundingRect.top + boundingRect.height <= canvasHeight - safeZone.bottom
  );
}

/**
 * Gets all text objects from canvas
 */
export function getTextObjects(canvas: FabricCanvas): IText[] {
  return canvas.getObjects().filter(
    obj => obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox'
  ) as IText[];
}

/**
 * Gets all shape objects from canvas
 */
export function getShapeObjects(canvas: FabricCanvas): FabricObject[] {
  return canvas.getObjects().filter(
    obj => obj.type === 'rect' || obj.type === 'circle' || obj.type === 'polygon' || obj.type === 'path'
  );
}
