import { useEffect, useRef, useState } from "react";

import styles from "./App.module.css";

// const IMAGE_URL =
//   "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const IMAGE_URL =
  "https://images.pexels.com/photos/1467475/pexels-photo-1467475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

export const App = () => {
  const [canvasUrl, setCanvasUrl] = useState("");

  const [p, setP] = useState(0);
  const [s, setS] = useState(40);
  const [o, setO] = useState(0.5);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !isImageLoaded) return;

    const { current: image } = imageRef;
    const { current: canvas } = canvasRef;

    const ctx = canvas.getContext("2d");

    const imageAspectRatio = image.naturalWidth / image.naturalHeight;

    const [x, y] = [0, 0];
    const [w, h] =
      imageAspectRatio > 1
        ? [canvas.width, canvas.width / imageAspectRatio]
        : [canvas.height * imageAspectRatio, canvas.height];

    if (imageAspectRatio > 1) {
      canvas.height = canvas.width / imageAspectRatio;
    } else {
      canvas.width = canvas.height * imageAspectRatio;
    }

    const [dx, dy] = [p * canvas.width, p * canvas.height];

    ctx.globalAlpha = o;
    ctx.drawImage(image, x + dx, y + dy, w - dx * 2, h - dy * 2);

    try {
      setCanvasUrl(canvas.toDataURL());
    } catch (ex) {
      console.error(ex);
    }
  }, [isImageLoaded, p, s, o]);

  return (
    <>
      <img
        alt=""
        ref={imageRef}
        src={IMAGE_URL}
        className={styles.img}
        onLoad={() => setIsImageLoaded(true)}
        crossOrigin="anonymous"
      />
      <canvas width={s} height={s} ref={canvasRef} className={styles.canvas} />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={p}
        style={{ width: 200 }}
        onChange={({ target: { value } }) => setP(value)}
      />

      <input
        type="range"
        min={40}
        max={120}
        value={s}
        onChange={({ target: { value } }) => setS(value)}
      />

      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={o}
        onChange={({ target: { value } }) => setO(value)}
      />
      <div className={styles.preview}>
        <div
          className={styles.watermarkOverlay}
          style={{
            background: `url('${canvasUrl}')`
          }}
        />
      </div>
    </>
  );
};

export default App;
