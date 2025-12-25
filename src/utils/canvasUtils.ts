import type { Canvas as FabricCanvas, FabricObject, IText } from 'fabric';

// Maximum font size for AI-generated text (HARD CONSTRAINT: never above 18px)
export const MAX_FONT_SIZE = 18;

// Typography scale for different text types (all capped at 18px max)
export const TYPOGRAPHY_SCALE = {
  headline: 18,
  subheadline: 16,
  body: 14,
  caption: 12,
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

// Tracks Y position for center-stack layout
let centerStackNextY = 0;

/**
 * Resets the center-stack Y tracker (call when starting a new layout)
 */
export function resetCenterStack(canvas: FabricCanvas, formatId: string = 'instagram-feed'): void {
  const safeZone = SAFE_ZONES[formatId as keyof typeof SAFE_ZONES] || SAFE_ZONES['instagram-feed'];
  centerStackNextY = safeZone.top + 40;
}

/**
 * Gets the next center-stack Y position
 */
export function getNextCenterStackY(): number {
  return centerStackNextY;
}

/**
 * Advances the center-stack Y position
 */
export function advanceCenterStackY(height: number, spacing: number = 20): void {
  centerStackNextY += height + spacing;
}

/**
 * Centers an object on the canvas (exact center)
 */
export function centerObjectOnCanvas(canvas: FabricCanvas, obj: FabricObject): void {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  
  obj.set({
    left: canvasWidth / 2,
    top: canvasHeight / 2,
    originX: 'center',
    originY: 'center',
    selectable: true,
    evented: true,
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
    selectable: true,
    evented: true,
  });
  obj.setCoords();
}

/**
 * CORE CENTER-STACK LAYOUT: Places object centered horizontally + stacked vertically
 * This is the PRIMARY layout function for AI-generated elements
 */
export function placeCenterStacked(
  canvas: FabricCanvas,
  obj: FabricObject,
  formatId: string = 'instagram-feed',
  spacing: number = 24
): void {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const safeZone = SAFE_ZONES[formatId as keyof typeof SAFE_ZONES] || SAFE_ZONES['instagram-feed'];
  
  // Enforce max font size for text
  if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
    const textObj = obj as IText;
    if ((textObj.fontSize || 0) > MAX_FONT_SIZE) {
      textObj.set({ fontSize: MAX_FONT_SIZE });
    }
  }
  
  // Get object dimensions
  const objHeight = obj.getBoundingRect().height || 40;
  
  // If centerStackNextY would overflow, reset to top
  if (centerStackNextY + objHeight > canvasHeight - safeZone.bottom) {
    centerStackNextY = safeZone.top + 40;
  }
  
  obj.set({
    left: canvasWidth / 2,
    top: centerStackNextY + objHeight / 2,
    originX: 'center',
    originY: 'center',
    selectable: true,
    evented: true,
    lockMovementX: false,
    lockMovementY: false,
  });
  
  obj.setCoords();
  
  // Advance Y for next element
  centerStackNextY += objHeight + spacing;
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
  
  // Enforce max font size
  if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
    const textObj = obj as IText;
    if ((textObj.fontSize || 0) > MAX_FONT_SIZE) {
      textObj.set({ fontSize: MAX_FONT_SIZE });
    }
  }
  
  let top = canvasHeight / 2;
  
  switch (verticalPosition) {
    case 'top':
      top = safeZone.top + 60;
      break;
    case 'bottom':
      top = canvasHeight - safeZone.bottom - 60;
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
    selectable: true,
    evented: true,
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
 * Enforces maximum font size for AI-generated text (HARD LIMIT: 18px)
 * Returns true if font size was clamped
 */
export function enforceMaxFontSize(obj: FabricObject, maxSize: number = MAX_FONT_SIZE): boolean {
  if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
    const textObj = obj as IText;
    if ((textObj.fontSize || 0) > maxSize) {
      textObj.set({ fontSize: maxSize });
      return true;
    }
  }
  return false;
}

/**
 * Enforces max font size on ALL text objects in canvas
 */
export function enforceMaxFontSizeAll(canvas: FabricCanvas, maxSize: number = MAX_FONT_SIZE): number {
  let clampedCount = 0;
  canvas.getObjects().forEach(obj => {
    if (enforceMaxFontSize(obj, maxSize)) {
      clampedCount++;
    }
  });
  if (clampedCount > 0) {
    canvas.renderAll();
  }
  return clampedCount;
}

/**
 * Gets the appropriate font size based on text type (max 18px)
 */
export function getFontSizeForType(type: 'headline' | 'subheadline' | 'body' | 'caption'): number {
  return TYPOGRAPHY_SCALE[type] || TYPOGRAPHY_SCALE.body;
}

/**
 * Makes all objects on canvas draggable
 */
export function makeAllDraggable(canvas: FabricCanvas): void {
  canvas.getObjects().forEach(obj => {
    obj.set({
      selectable: true,
      evented: true,
      lockMovementX: false,
      lockMovementY: false,
    });
  });
  canvas.renderAll();
}

/**
 * Centers all objects horizontally on canvas and enforces max font size
 */
export function centerAndEnforceAll(canvas: FabricCanvas): void {
  const canvasWidth = canvas.getWidth();
  
  canvas.getObjects().forEach(obj => {
    // Center horizontally
    obj.set({
      left: canvasWidth / 2,
      originX: 'center',
      selectable: true,
      evented: true,
    });
    
    // Enforce max font size
    enforceMaxFontSize(obj);
    
    obj.setCoords();
  });
  
  canvas.renderAll();
}

/**
 * Applies typography harmony to all text on canvas
 */
export function applyTypographyHarmony(
  canvas: FabricCanvas,
  headingFont: string,
  bodyFont: string,
  captionFont: string = bodyFont,
  options: {
    applyToAll?: boolean;
    selectedOnly?: boolean;
    maxFontSize?: number;
  } = {}
): number {
  const { applyToAll = true, selectedOnly = false, maxFontSize = MAX_FONT_SIZE } = options;
  
  let updatedCount = 0;
  const objects = selectedOnly
    ? canvas.getActiveObjects()
    : canvas.getObjects();
  
  objects.forEach((obj) => {
    if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
      const textObj = obj as IText;
      const fontSize = textObj.fontSize || 14;
      
      // Enforce maximum font size (18px max for AI-generated text)
      if (fontSize > maxFontSize) {
        textObj.set({ fontSize: maxFontSize });
      }
      
      // Apply font based on relative size (headings vs body vs caption)
      if (fontSize >= 16) {
        textObj.set({ fontFamily: headingFont });
      } else if (fontSize >= 13) {
        textObj.set({ fontFamily: bodyFont });
      } else {
        textObj.set({ fontFamily: captionFont });
      }
      
      // Make draggable
      textObj.set({
        selectable: true,
        evented: true,
        lockMovementX: false,
        lockMovementY: false,
      });
      
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
