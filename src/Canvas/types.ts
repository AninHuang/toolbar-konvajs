export interface Point {
  x: number;
  y: number;
}

export enum CanvasMode {
  Pen = "pen",
  Eraser = "eraser",
  View = "view"
}

export interface AnnotationLine {
  points: number[];
  type: "source-over" | "destination-out";
  color: string;
  width: number;
}

export type Annotation = AnnotationLine[];

export interface CanvasProps {
  width: number;
  height: number;
  backgroundImageSource: string;
  backgroundAnnotations: Annotation[];
  foregroundAnnotation: Annotation;
  mode: CanvasMode;
  penColor: string;
  penWidth: number;
  position: Point;
  scale: number;
  onForegroundAnnotationChange: (annotation: Annotation) => void;
  onViewChange: (position: Point, scale: number) => void;
}

