"use client";

import { useState } from "react";
import { ajukanLamaran } from "@/lib/frontend/api/mahasiswa";

export default function ApplyForm({
  proyek,
  onApplySuccess,
}) {
  const [pesan, setPesan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cek kondisi tombol disabled sejak awal
  const isOwner = Boolean(proyek?.is_pemilik);
  const isClosed = proyek?.status !== "buka";
  const slotTerisi = proyek?.slot_terisi !== undefined ? proyek.slot_terisi : 0;
  const isFull = slotTerisi >= (proyek?.slot_dibutuhkan || 1);
  const alreadyApplied = Boolean(proyek?.lamaran_saya) || isSuccess;

  let disabledReason = "";
  let buttonLabel = "Ajukan Diri Bergabung";
  let buttonIcon = "send";

  if (alreadyApplied) {
    disabledReason = "Kamu sudah melamar proyek ini";
    buttonLabel = "Lamaran Terkirim";
    buttonIcon = "check_circle";
  } else if (isOwner) {
    disabledReason = "Ini proyek kamu";
    buttonLabel = "Ini Proyek Kamu";
    buttonIcon = "lock";
  } else if (isClosed) {
    disabledReason = "Proyek sudah ditutup";
    buttonLabel = "Proyek Ditutup";
    buttonIcon = "block";
  } else if (isFull) {
    disabledReason = "Slot sudah penuh";
    buttonLabel = "Slot Penuh";
    buttonIcon = "group_off";
  }

  const isDisabled = isOwner || isClosed || isFull || alreadyApplied || submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (isDisabled) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const trimmedPesan = pesan.trim().slice(0, 1000);
      await ajukanLamaran(proyek.proyek_id, trimmedPesan);

      setIsSuccess(true);
      if (onApplySuccess) {
        onApplySuccess();
      }
    } catch (err) {
      if (err.status === 409) {
        setErrorMsg("Kamu sudah melamar proyek ini");
      } else {
        setErrorMsg(err.message || "Gagal mengajukan lamaran");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Input Pesan */}
      <div className="flex flex-col gap-2 pt-2">
        <label
          className="text-body-md font-semibold text-on-surface"
          htmlFor="apply-message"
        >
          Pesan untuk Pemilik Proyek{" "}
          <span className="font-normal text-outline">(opsional)</span>
        </label>
        <textarea
          disabled={alreadyApplied || submitting || isOwner || isClosed || isFull}
          className="w-full font-body-md text-body-md text-on-surface placeholder:text-outline p-4 rounded-2xl bg-surface-container-low focus:bg-surface-container-lowest outline-none shadow-inner resize-y transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          id="apply-message"
          placeholder="Ceritakan singkat ketertarikanmu, pengalaman terkait, atau peran spesifik yang ingin kamu ambil dalam proyek ini..."
          rows="4"
          maxLength={1000}
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
        />
        <div className="flex items-center gap-2 mt-1">
          <span className="material-symbols-outlined text-outline text-[16px]">
            info
          </span>
          <p className="text-label-md text-outline">
            Pemilik proyek akan meninjau profil SkillMatch kamu bersama pesan ini.
          </p>
        </div>
      </div>

      {/* Button Submit */}
      <div className="pt-4 flex flex-col items-start gap-2">
        <button
          type="submit"
          disabled={isDisabled}
          title={disabledReason || undefined}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-10 rounded-full text-title-lg font-bold transition-all shadow-md active:scale-98 ${
            isDisabled
              ? "bg-secondary-container/60 text-on-secondary-container/70 cursor-not-allowed shadow-none"
              : "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim hover:shadow-lg cursor-pointer"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {buttonIcon}
          </span>
          <span>{submitting ? "Mengirim..." : buttonLabel}</span>
        </button>

        {errorMsg && (
          <span className="text-xs text-red-600 font-medium">{errorMsg}</span>
        )}
      </div>
    </form>
  );
}

