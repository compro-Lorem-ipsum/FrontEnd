import React, { useState, useEffect, useRef } from "react";
import { GoAlertFill } from "react-icons/go";
import { IoVolumeMuteOutline, IoVolumeHighOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import type { PanicAlertData } from "../../types/panicAlert";
import panicSoundFile from "../../assets/sound/panic_sound.mp3";

interface Props {
  alert: PanicAlertData | null;
  onClose: () => void;
}

const ActivePanicAlertModal: React.FC<Props> = ({ alert, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (alert) {
      if (!audioRef.current) {
        audioRef.current = new Audio(panicSoundFile);
        audioRef.current.loop = true;
      }
      
      // Reset muted state and play
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [alert]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#A70202]/30 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white rounded-2xl w-full max-w-[26rem] overflow-hidden shadow-2xl flex flex-col relative">
        {/* Red Header Section */}
        <div className="bg-[#A70202] text-white p-6 pt-8 pb-10 flex flex-row items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full flex-shrink-0">
            <GoAlertFill className="text-4xl text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Panic Alert</h2>
            <p className="text-sm text-white/90">Satpam menekan tombol darurat</p>
          </div>
        </div>

        {/* White Card Content (Overlapping) */}
        <div className="bg-white rounded-xl mx-4 mt-2 p-5 border border-[#A70202] flex flex-col gap-3 relative z-10">
          <div className="flex flex-row justify-between items-start w-full">
            <div className="flex flex-col">
              <h3 className="font-bold text-lg text-black">{alert.satpam.nama}</h3>
              <p className="text-xs text-gray-500 mt-0.5">NIP {alert.satpam.nip}</p>
            </div>
            <div className="border border-[#A70202] text-[#A70202] px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide">
              {alert.client}
            </div>
          </div>

          <p className="text-[#A70202] text-xs font-medium mt-1">
            {alert.lat}, {alert.lng}
          </p>

          <div className="flex flex-row gap-3 mt-3">
            <Button
              className="flex-1 bg-white border border-[#A70202] text-black font-medium rounded-xl h-11"
              onPress={onClose}
            >
              Tutup
            </Button>
            <Button
              className="flex-1 bg-[#122C93] text-white font-medium rounded-xl h-11"
              onPress={() => {
                window.open(`https://www.google.com/maps?q=${alert.lat},${alert.lng}`, "_blank");
              }}
            >
              Lihat Lokasi
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-row justify-between items-center p-4 pt-3 pb-5 px-5">
          <button
            className="flex flex-row items-center gap-2 text-gray-500 text-xs font-medium hover:text-black transition-colors"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <IoVolumeMuteOutline className="text-lg" /> : <IoVolumeHighOutline className="text-lg" />}
            {isMuted ? "Suara Dibisukan" : "Bisukan Suara"}
          </button>

          <button
            className="flex flex-row items-center gap-1.5 text-[#122C93] text-xs font-semibold hover:underline"
            onClick={() => {
              onClose();
              navigate("/AdminPanicAlert");
            }}
          >
            Lihat Semua <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivePanicAlertModal;
