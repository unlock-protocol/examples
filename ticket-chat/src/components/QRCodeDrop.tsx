import { useDropzone } from "react-dropzone";
import QrScanner from "qr-scanner";
import toast from "react-hot-toast";
import { parseTicket } from "../utils/ticket";
import { useLocation } from "wouter";
import { useUser } from "../hooks/useUser";
import { useState } from "react";
import { CgSpinnerAlt as LoadingIcon } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

export function QRCodeDrop() {
  const navigate = useNavigate();
  const { signIn } = useUser();
  const [isSigning, setIsSigning] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpeg", ".gif", ".jpg"],
    },
    onDrop: async ([file]) => {
      try {
        setIsSigning(true);
        const url = URL.createObjectURL(file);
        const result = await QrScanner.scanImage(url, {});
        const ticketURL = new URL(result as unknown as string);
        const ticket = parseTicket({
          data: ticketURL.searchParams.get("data"),
          sig: ticketURL.searchParams.get("sig"),
        });
        if (!ticket) {
          throw new Error("Invalid Ticket");
        }
        const user = {
          address: ticket.data.account,
        };
        signIn(user);
        setIsSigning(false);
        navigate(`/rooms/${ticket.data.lockAddress}`);
      } catch (error) {
        setIsSigning(false);
        toast.error("Invalid Ticket");
      }
    },
  });
  return (
    <section className="mt-12 cursor-pointer">
      <div
        {...getRootProps({
          className:
            "flex items-center cursor-pointer group border-2 border-dashed border-zinc-400 hover:border-brand-secondary justify-center p-6 bg-white rounded-xl h-36",
        })}
      >
        <input {...getInputProps()} />
        {isSigning ? (
          <LoadingIcon className="animate-spin" />
        ) : (
          <p className="font-medium text-zinc-500 group-hover:text-brand-secondary">
            Drop Unlock Ticket QR Code
          </p>
        )}
      </div>
    </section>
  );
}
