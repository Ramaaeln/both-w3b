import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function CameraCapture() {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  const [selectLayouts, setSelectLayouts] = useState("3-vertikal");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("normal");
  const [countdown, setCountdown] = useState(null);

  const StartCountdown = (seconds) => {
    return new Promise((resolve) => {
      let current = seconds;
      setCountdown(current);
      const interval = setInterval(() => {
        current -= 1;
        setCountdown(current);
        if (current === 0) {
          clearInterval(interval);
          setCountdown(null);
          resolve();
        }
      }, 1000);
    });
  };

  const layoutTemplate = {
    "3-vertikal": {
      maxPhotos: 3,
      canvasSize: { width: 1200, height: 1800 },
      templates: [
        {
          name: "Toy Story",
          src: "/templates/template-toy-story.png",
          positions: [
            { x: 50, y: 66 },
            { x: 50, y: 627 },
            { x: 50, y: 1187 },
          ],
          photoSize: { width: 1100, height: 550 },
        },
        {
          name: "Default",
          src: "/templates/templates-1.png",
          positions: [
            { x: 17, y: 70 },
            { x: 17, y: 620 },
            { x: 17, y: 1190 },
          ],
          photoSize: { width: 1200, height: 560 },
        },
      ],
    },
    "4-vertikal": {
      maxPhotos: 4,
      canvasSize: { width: 1200, height: 2400 },
      templates: [
        {
          name: "Default",
          src: "/templates/template-v4-1.png",
          photoSize: { width: 1200, height: 520 },
          positions: [
            { x: 17, y: -40 },
            { x: 17, y: 480 },
            { x: 17, y: 930 },
            { x: 17, y: 1380 },
          ],
        },
      ],
    },
  };

  const generatePreview = (photos, templateData, filterMode = "normal") => {
    const canvas = document.createElement("canvas");
    canvas.width = templateData.canvasWidth || 1200;
    canvas.height = templateData.canvasHeight || 1800;
    const ctx = canvas.getContext("2d");

    const template = new Image();
    template.crossOrigin = "anonymous";
    template.src = templateData.src;

    let loadedCount = 0;
    const loadedPhotos = [];

    photos.forEach((src, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        loadedPhotos[i] = img;
        loadedCount++;

        if (loadedCount === photos.length) {
          template.onload = () => {
            loadedPhotos.forEach((img, i) => {
              const pos = templateData.positions[i];
              const size = templateData.photoSize;

              switch (filterMode) {
                case "grayscale":
                  ctx.filter = "grayscale(100%)";
                  break;
                case "sepia":
                  ctx.filter = "sepia(70%) brightness(1.1)";
                  break;
                case "pixar":
                  ctx.filter = "saturate(1.3) contrast(1.15) brightness(1.1)";
                  break;
                case "vinpixar":
                  ctx.filter = "sepia(0.1) saturate(1.2) contrast(1.05) brightness(1.05)";
                  break;
                case "greenharmony":
                  ctx.filter = "saturate(1.2) contrast(1.05) brightness(1.05) hue-rotate(15deg)";
                  break;
                default:
                  ctx.filter = "none";
              }

              ctx.drawImage(img, pos.x, pos.y, size.width, size.height);
            });

            ctx.filter = "none";
            ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

            const final = canvas.toDataURL("image/jpeg");
            setFinalImage(final);
          };
        }
      };
    });
  };

  const updatePreviewIfNeeded = (updatedImages) => {
    const currentLayout = layoutTemplate[selectLayouts];
    if (updatedImages.length === currentLayout.maxPhotos) {
      generatePreview(
        updatedImages,
        currentLayout.templates[selectedTemplate],
        selectedFilter
      );
    } else {
      setFinalImage(null);
    }
  };

  const capture = () => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    const currentLayout = layoutTemplate[selectLayouts];
    if (imageSrc.length >= currentLayout.maxPhotos) {
      alert(`Maksimal ${currentLayout.maxPhotos} foto. Hapus dulu untuk ambil baru.`);
      return;
    }

    const newImages = [...imageSrc, screenshot];
    setImageSrc(newImages);
    updatePreviewIfNeeded(newImages);
  };

  const handleDownload = () => {
    if (!finalImage) return;
    const a = document.createElement("a");
    a.href = finalImage;
    a.download = "bothw3b.jpg";
    a.click();
  };

  const handleDeletePhoto = (index) => {
    const newImages = [...imageSrc];
    newImages.splice(index, 1);
    setImageSrc(newImages);
    updatePreviewIfNeeded(newImages);
  };

  const handleResetAll = () => {
    setImageSrc([]);
    setFinalImage(null);
  };

  const getFilterStyle = (filter) => {
    switch (filter) {
      case "grayscale":
        return "grayscale(100%)";
      case "sepia":
        return "sepia(70%) brightness(1.1)";
      case "pixar":
        return "saturate(1.3) contrast(1.15) brightness(1.1)";
      case "vinpixar":
        return "sepia(0.1) saturate(1.2) contrast(1.05) brightness(1.05)";
      case "greenharmony":
        return "saturate(1.2) contrast(1.05) brightness(1.05) hue-rotate(15deg)";
      default:
        return "none";
    }
  };

  const currentLayout = layoutTemplate[selectLayouts];

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-white">
      <div className="md:w-1/2 w-full h-1/2 md:h-full p-6 flex flex-col justify-center items-center bg-gradient-to-br from-cyan-300 via-white to-cyan-100">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600">
          BOTHW3B
        </h1>

        <div className="relative w-full max-w-xl aspect-video">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{
              filter: getFilterStyle(selectedFilter),
              borderRadius: "12px",
              width: "100%",
            }}
            className="rounded-xl shadow-lg w-full h-full"
          />
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="text-6xl font-bold text-white bg-black bg-opacity-50 px-6 py-3 rounded-xl">
                {countdown}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={async () => {
              await StartCountdown(3);
              capture();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl shadow"
          >
            📸 Ambil Foto
          </button>

          <select
            value={selectLayouts}
            onChange={(e) => {
              const layout = e.target.value;
              setSelectLayouts(layout);
              setSelectedTemplate(0);
              setImageSrc([]);
              setFinalImage(null);
            }}
            className="p-2 border rounded shadow text-sm"
          >
            {Object.keys(layoutTemplate).map((layout) => (
              <option value={layout} key={layout}>
                {layout.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={selectedTemplate}
            onChange={(e) => {
              const index = parseInt(e.target.value);
              setSelectedTemplate(index);
              if (imageSrc.length === currentLayout.maxPhotos) {
                generatePreview(
                  imageSrc,
                  currentLayout.templates[index],
                  selectedFilter
                );
              }
            }}
            className="p-2 border rounded shadow text-sm"
          >
            {currentLayout.templates.map((t, idx) => (
              <option key={idx} value={idx}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={selectedFilter}
            onChange={(e) => {
              const filter = e.target.value;
              setSelectedFilter(filter);
              if (imageSrc.length === currentLayout.maxPhotos) {
                generatePreview(
                  imageSrc,
                  currentLayout.templates[selectedTemplate],
                  filter
                );
              }
            }}
            className="p-2 border rounded shadow text-sm"
          >
            <option value="normal">🌈 Normal</option>
            <option value="grayscale">🖤 Hitam Putih</option>
            <option value="sepia">🟤 Kuning Keemasan</option>
            <option value="pixar">🟤 Pixar Styles</option>
            <option value="vinpixar">🟤 Vintage Pixar</option>
            <option value="greenharmony">🟤 Green Harmony</option>
          </select>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-4 text-blue-900">📷 Hasil Foto:</h3>
          <div className="flex justify-center gap-2 flex-wrap">
            {imageSrc.map((src, i) => (
              <div key={i} className="relative inline-block">
                <img
                  src={src}
                  alt={`Foto ${i + 1}`}
                  style={{ filter: getFilterStyle(selectedFilter) }}
                  className="rounded-lg w-40 shadow-md mb-2"
                />
                <button
                  onClick={() => handleDeletePhoto(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow"
                  title="Hapus Foto Ini"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
          {imageSrc.length > 0 && (
            <button
              onClick={handleResetAll}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow text-sm"
            >
              ♻️ Reset Semua
            </button>
          )}
        </div>
      </div>

      <div className="md:w-1/2 w-full h-1/2 md:h-full flex flex-row justify-around items-start p-6 overflow-y-auto gap-6 bg-white">
        {finalImage && (
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-2 text-pink-700">🎨 Preview Final:</h4>
            <img
              src={finalImage}
              alt="Hasil Gabungan"
              className="rounded-xl shadow-lg w-1/2 mb-4"
            />
            <button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-xl shadow text-sm"
            >
              ⬇️ Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
