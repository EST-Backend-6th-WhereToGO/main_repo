import React from "react";

const YouTubeEmbed = ({ videoId }) => {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                paddingBottom: "56.25%",  // 16:9 비율을 유지하기 위한 패딩 (100% * 9 / 16 = 56.25%)
                height: 0,
                marginBottom: "20px",
            }}
        >
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%", // 100% 높이로 맞추어 비율을 유지
                    borderRadius: "8px", // 모서리를 둥글게
                }}
            ></iframe>
        </div>
    );
};

export default YouTubeEmbed;
