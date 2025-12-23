"use client";

import Dashboard from "@/components/ui/organisms/Dashboard";
import ModalPrimary from "@/components/ui/templates/modal/ModalPrimary";
import CardActionStatus from "@/components/ui/templates/modal/CardActionStatus";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { modalIsClose } from "@/features/modal/modalSlice";
import {
  SuccessAlert,
  FailAlert,
} from "@/components/ui/moleculs/alert/SuccessAlert";
import { useEffect } from "react";
import { alertIsClose, } from "@/features/alert/alertSlice";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);
  const alert = useAppSelector((state) => state.alert);

  useEffect(() => {
    if (alert.isOpen) {
      const timer = setTimeout(() => {
        dispatch(alertIsClose());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert, dispatch]);

  return (
    <SessionProvider>
      <Dashboard>
        <SuccessAlert title={alert.title} description={alert.message} className={alert.isOpen && alert.status ? "right-5 opacity-100" : ""} />
        <FailAlert title={alert.title} description={alert.message} className={alert.isOpen && !alert.status ? "right-5 opacity-100" : ""} />
        {/* {
          alert.isOpen && (alert.status ? <SuccessAlert title={alert.title} description={alert.message} className="right-5 opacity-100" /> : <FailAlert title={alert.title} description={alert.message} className="right-5 opacity-100" />)
        } */}
        {modal.isOpen && (
          <ModalPrimary>
            <CardActionStatus
              title={modal.modalProps?.title ?? ""}
              message={modal.modalProps?.message ?? ""}
              status={modal.modalProps?.modalStatus ?? false}
              buttonActionTitle={modal.modalProps?.buttonActionTitle ?? ""}
              onClick={() => {
                dispatch(modalIsClose());
                if (modal.modalProps?.redirectTo) {
                  router.push(modal.modalProps.redirectTo);
                } else {
                  router.refresh();
                }
              }}
            />
          </ModalPrimary>
        )}
        {children}
      </Dashboard>
    </SessionProvider>
  );
}
