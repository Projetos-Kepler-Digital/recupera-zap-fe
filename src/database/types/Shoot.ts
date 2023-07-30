export type Shoot = {
  index: number;
  startAt: number;

  message: string | null;
  delayMessage: number;

  audio: string | null;
  delayAudio: number;

  image: {
    url: string;
    caption: string;
  } | null;

  video: {
    url: string;
    caption: string;
  } | null;

  doc: {
    url: string;
    filename: string;
  } | null;
};
