import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, X, Zap, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { detectGameFromImage } from "../services/gemini";
import { Game } from "../types";
import { cn } from "../lib/utils";

interface ImageDetectionProps {
  onDetected: (game: Game) => void;
}

export default function ImageDetection({ onDetected }: ImageDetectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback to basic constraints if high-res fails
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (fallbackErr) {
        alert("Impossible d'accéder à l'appareil photo. Vérifiez les permissions.");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL("image/jpeg");
        setPreview(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!preview) return;
    setIsLoading(true);
    try {
      const game = await detectGameFromImage(preview);
      if (game) {
        onDetected(game);
        handleClose();
      } else {
        alert("Désolé, je n'ai pas pu identifier le jeu dans cette image.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setPreview(null);
    setIsOpen(false);
    setIsCameraActive(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-brand-primary text-white shadow-2xl shadow-brand-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <Camera className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl glass-dark border border-white/10 shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-primary" />
                  Détection Intelligente
                </h2>
                <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="relative aspect-video rounded-2xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center">
                  {isCameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                        <ImageIcon className="w-10 h-10 text-zinc-600" />
                      </div>
                      <p className="text-zinc-500">Prenez une photo ou importez une image</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                      <p className="text-white font-bold animate-pulse">Analyse en cours...</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {!preview && !isCameraActive ? (
                    <>
                      <button
                        onClick={startCamera}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                      >
                        <Camera className="w-8 h-8 text-brand-primary" />
                        <span className="font-bold">Appareil Photo</span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                      >
                        <ImageIcon className="w-8 h-8 text-brand-secondary" />
                        <span className="font-bold">Galerie</span>
                      </button>
                    </>
                  ) : isCameraActive ? (
                    <button
                      onClick={capturePhoto}
                      className="col-span-2 h-16 rounded-2xl bg-brand-primary text-white font-bold text-lg hover:bg-brand-secondary transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-6 h-6" />
                      Prendre la photo
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => { setPreview(null); startCamera(); }}
                        className="h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Recommencer
                      </button>
                      <button
                        onClick={handleDetect}
                        disabled={isLoading}
                        className="h-14 rounded-2xl bg-brand-primary text-white font-bold hover:bg-brand-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Zap className="w-5 h-5" />
                        Identifier le jeu
                      </button>
                    </>
                  )}
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
