import { expect, it, describe } from "vitest";
import { extractYouTubeVideoId } from "./extract-YouTube-videoId.js";

describe("extractYouTubeVideoId", () => {
  const urls_ok = [
    "https://www.youtube.com/embed/YOUTUBE_ID",
    "http://www.youtube.com/embed/YOUTUBE_ID",
    "www.youtube.com/embed/YOUTUBE_ID",
    "youtube.com/embed/YOUTUBE_ID",
    "https://www.youtube.com/watch?v=YOUTUBE_ID",
    "http://www.youtube.com/watch?v=YOUTUBE_ID",
    "www.youtube.com/watch?v=YOUTUBE_ID",
    "youtube.com/watch?v=YOUTUBE_ID",
    "https://www.youtu.be/YOUTUBE_ID",
    "http://www.youtu.be/YOUTUBE_ID",
    "www.youtu.be/YOUTUBE_ID",
    "youtu.be/YOUTUBE_ID",
  ];

  const urls_fail = [
    "https://www.youtube.com/embed",
    "http://www.youtube.com",
    "https://www.domain.com/embed/YOUTUBE_ID",
    "http://www.domain.com/watch?v=YOUTUBE_ID",
  ];

  it("extracts video id from youtube url", () => {
    urls_ok.forEach((url) => {
      expect(extractYouTubeVideoId(url)).toBe("YOUTUBE_ID");
    });
  });

  it("returns null for invalid youtube url", () => {
    urls_fail.forEach((url) => {
      expect(extractYouTubeVideoId(url)).toBeNull();
    });
  });
});
