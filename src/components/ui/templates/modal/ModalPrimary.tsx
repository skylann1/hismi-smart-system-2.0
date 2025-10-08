"use client";

import { MouseEventHandler, useRef } from "react";
import { useDispatch } from "react-redux";
import { modalIsClose } from "@/features/modal/modalSlice";
import { RiCloseCircleFill } from "react-icons/ri";

export default function ModalPrimary({
  children,
}: {
  children: React.ReactElement | React.ReactNode;
}) {
  const overlay = useRef(null);
  const dispatch = useDispatch();

  const closeModal: MouseEventHandler = (e) => {
    if (e.target === overlay.current) {
      dispatch(modalIsClose());
    }
  };

  const handleCLickClose = () => {
    dispatch(modalIsClose());
  }

  return (
    <div
      ref={overlay}
      onClick={closeModal}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-hidden">
      <div className="bg-white rounded-lg p-4 min-lg:p-8 shadow-2xl shadow-white/50 relative">
        {children}
        <div className="absolute right-1 top-1 cursor-pointer">
          <RiCloseCircleFill className="text-3xl text-black" onClick={handleCLickClose}/>
        </div>
      </div>
    </div>
  );
}
