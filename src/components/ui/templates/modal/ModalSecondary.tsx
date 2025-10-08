"use client";

import { MouseEventHandler, useRef } from "react";
import { RiCloseCircleFill } from "react-icons/ri";

export default function ModalSecondary({
  children,
  handleCLickClose
}: {
  children: React.ReactElement | React.ReactNode;
  handleCLickClose: () => void
}) {
//   const router = useRouter();
  const overlay = useRef(null);

  const closeModal: MouseEventHandler = (e) => {
    if (e.target === overlay.current) {
        handleCLickClose();
    }
  };

  const handleXClick = () => {
    handleCLickClose();
  };

  return (
    <div
      ref={overlay}
      onClick={closeModal}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-hidden"
    >
      <div className="bg-white rounded-lg p-4 min-lg:p-8 shadow-2xl shadow-white/50 relative">
        {children}
        <div className="absolute right-1 top-1 cursor-pointer">
          <RiCloseCircleFill
            className="text-3xl text-black"
            onClick={handleXClick}
          />
        </div>
      </div>
    </div>
  );
}
