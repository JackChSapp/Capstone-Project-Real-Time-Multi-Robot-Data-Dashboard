type CameraFeedProps = {
  imageSrc: string | null;
  format: string | null;
  lastUpdated?: string;
};

export default function CameraFeed({
  imageSrc,
  format,
  lastUpdated,
}: CameraFeedProps) {
  return (
    <>
      {format ? (
        <p className="live-footnote" style={{ marginTop: 0 }}>
          Format: <code style={{ color: "#E0AA0F" }}>{format}</code>
        </p>
      ) : null}
      <div className="live-camera-frame">
        {imageSrc ? (
          <img src={imageSrc} alt="Robot camera" />
        ) : (
          <div className="live-empty">
            Waiting for <code>/out/compressed</code> (sensor_msgs/CompressedImage).
          </div>
        )}
      </div>
      <p className="live-footnote">
        Last update: {lastUpdated ?? "No frames yet"}
      </p>
    </>
  );
}
