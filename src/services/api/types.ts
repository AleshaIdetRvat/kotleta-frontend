export type FindQuarriesReturnDto = {
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
    class_id: number;
    detection_id: string;
  }>;
};
