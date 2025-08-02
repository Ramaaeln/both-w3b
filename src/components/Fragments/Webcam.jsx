import React, { useCallback, useState } from "react";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const Webcam = React.forwardRef(({ videoConstraints, className }, ref) => {
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: videoConstraints 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        setError('Camera access denied or not available');
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  React.useImperativeHandle(ref, () => ({
    getScreenshot: () => {
      if (!videoRef.current) return null;

      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(videoRef.current, 0, 0, 720, 480);
      return canvas.toDataURL('image/jpeg');
    }
  }));

  if (error) {
    return (
      <div className={`bg-red-100 flex items-center justify-center ${className}`} style={{ width: 720, height: 480 }}>
        <div className="text-red-600 text-center">
          <div className="text-4xl mb-4">❌</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className={`bg-yellow-100 flex items-center justify-center ${className}`} style={{ width: 720, height: 480 }}>
        <div className="text-yellow-600 text-center">
          <div className="text-4xl mb-4">📷</div>
          <div>Requesting camera access...</div>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={className}
      style={{ width: 720, height: 480, objectFit: 'cover' }}
    />
  );
});

export default function WebCam() {
  const webcamRef = React.useRef(null);
  const [images, setImages] = useState([]);
  const [maxPhotos, setMaxPhotos] = useState(1);
  const [select, setSelect] = useState('/public/templates/templates-1.png');
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = useCallback(() => {
    if (images.length >= maxPhotos) return;
    setIsCapturing(true);
    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImages(prev => [...prev, imageSrc]);
      setIsCapturing(false);
    }, 100);
  }, [webcamRef, images.length, maxPhotos]);

  const reset = () => setImages([]);

  const removePhoto = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const downloadCollage = () => {
    if (images.length === 0) return;

    const canvas = document.createElement('canvas');
    let canvasWidth, canvasHeight;

    if (maxPhotos === 1) {
      canvasWidth = 720;
      canvasHeight = 480;
    } else if (maxPhotos === 3) {
      canvasWidth = 720;
      canvasHeight = 480;
    } else if (maxPhotos === 4) {
      canvasWidth = 720;
      canvasHeight = 960;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    let loadedCount = 0;
    const totalImages = images.length;

    const drawTemplate = () => {
      const templateImg = new Image();
      templateImg.onload = () => {
        ctx.drawImage(templateImg, 0, 0, canvasWidth, canvasHeight);
        const link = document.createElement('a');
        link.download = `photo-collage-${maxPhotos}photos.jpg`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      };
      templateImg.src = select;
    };

    images.forEach((imageSrc, index) => {
      const img = new Image();
      img.onload = () => {
        let x = 0, y = 0, width = 0, height = 0;

        if (maxPhotos === 1) {
          x = 0; y = 0; width = 720; height = 480;
        } else if (maxPhotos === 3) {
          const marginX = 50;
          const photoWidth = 1000;
          const photoHeight = 1000;
          const spacingY = 5;

          x = marginX;
          y = index * (photoHeight + spacingY);
          width = photoWidth;
          height = photoHeight;
        } else if (maxPhotos === 4) {
          x = (index % 2) * 360;
          y = Math.floor(index / 2) * 480;
          width = 360;
          height = 480;
        }

        ctx.drawImage(img, x, y, width, height);
        loadedCount++;

        if (loadedCount === totalImages) {
          if (maxPhotos === 1 || maxPhotos === 3) drawTemplate();
          else {
            const link = document.createElement('a');
            link.download = `photo-collage-${maxPhotos}photos.jpg`;
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
          }
        }
      };
      img.src = imageSrc;
    });
  };

  return (
    <div className="justify-center flex py-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl w-full px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Pilih Mode Foto</h2>
          <div className="flex justify-center space-x-4">
            {[1, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => { setMaxPhotos(n); setImages([]); }}
                className={`px-4 py-2 rounded-lg font-semibold ${maxPhotos === n ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'}`}
              >
                {n} Foto
              </button>
            ))}
          </div>
        </div>

        {images.length === 0 ? (
          <div className="text-center space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Pilih Template:</h3>
              <div className="flex justify-center space-x-4">
                <img
                  src="/public/templates/templates-1.png"
                  onClick={() => setSelect('/public/templates/templates-1.png')}
                  alt="Template 1"
                  className={`w-20 h-16 object-cover cursor-pointer border-2 rounded ${select === '/public/templates/templates-1.png' ? 'border-blue-500' : 'border-gray-300'}`}
                />
              </div>
            </div>

            <Webcam
              className="rounded-xl mx-auto"
              videoConstraints={videoConstraints}
              ref={webcamRef}
            />

            <button
              onClick={capture}
              disabled={isCapturing}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${isCapturing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isCapturing ? 'Mengambil Foto...' : `Ambil Foto (${images.length}/${maxPhotos})`}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              {maxPhotos === 3 && (
                <div className="relative w-[750px] h-[500px]">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Foto ${index + 1}`}
                      className="absolute left-[0px] mt-20 top-0 w-[750px] h-[500px] object-cover rounded-lg border border-white"
                      style={{ top: `${index * 505}px` }}
                    />
                  ))}
                  {images.length === 3 && (
                    <img
                      src={select}
                      alt="Template Overlay"
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    />
                  )}
                </div>
              )}
            </div>

            {images.length < maxPhotos && (
              <div className="space-y-4">
                <Webcam
                  className="rounded-xl mx-auto"
                  videoConstraints={videoConstraints}
                  ref={webcamRef}
                />
                <button
                  onClick={capture}
                  disabled={isCapturing}
                  className={`px-6 py-3 rounded-lg font-semibold text-white ${isCapturing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {isCapturing ? 'Mengambil Foto...' : `Ambil Foto Selanjutnya (${images.length}/${maxPhotos})`}
                </button>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={downloadCollage}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
              >
                Download {maxPhotos > 1 ? 'Kolase' : 'Foto'}
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}