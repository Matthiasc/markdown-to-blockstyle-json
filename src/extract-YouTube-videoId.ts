// const isValidYouTubeUrl = (url) => {
//   const regex =
//     /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=([\w-]+)|embed\/([\w-]+)|v\/([\w-]+)|shorts\/([\w-]+))|youtu\.be\/([\w-]+))$/;
//   return regex.test(url);
// };

export const extractYouTubeVideoId = (url: string): string | null => {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=([\w-]+)|embed\/([\w-]+)|v\/([\w-]+)|shorts\/([\w-]+))|youtu\.be\/([\w-]+))$/;
  const match = url.match(regex);
  if (match) {
    // Find the matched group that contains the video ID
    const videoId = match[1] || match[2] || match[3] || match[4] || match[5];
    return videoId;
  }
  return null; // Return null if no valid YouTube URL found
};
