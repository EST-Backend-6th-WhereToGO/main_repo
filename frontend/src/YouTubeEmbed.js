import React from "react";

const YouTubeEmbed = ({ videoId }) => {
  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <iframe
        width="560" // 비디오 너비
        height="315" // 비디오 높이
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
