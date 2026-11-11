"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ProyekSayaHeader from "@/components/mahasiswa/proyek-saya/ProyekSayaHeader";
import ProyekForm from "@/components/mahasiswa/proyek-saya/ProyekForm";
import ProyekPostCard from "@/components/mahasiswa/proyek-saya/ProyekPostCard";
import RekomendasiPanel from "@/components/mahasiswa/proyek-saya/RekomendasiPanel";
import {
  getProyekSaya,
  createProyek,
  updateProyek,
  getPelamarProyek,
  updateStatusLamaran,
  getRekomendasiMitra,
  kirimPesan,
  getAllTags,
} from "@/lib/frontend/api/mahasiswa";

export default function ProyekSayaPage() {
  const formRef = useRef(null);

  // Main data states
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState(null);

  // Tags
  const [availableTags, setAvailableTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Applicants map: { [proyekId]: array of applicants }
  const [applicantsMap, setApplicantsMap] = useState({});
  const [loadingApplicantsMap, setLoadingApplicantsMap] = useState({});
  const [applicantErrorMap, setApplicantErrorMap] = useState({});
  const [processingApplicantId, setProcessingApplicantId] = useState(null);

  // Recommendations for selected project
  const [rekomendasiList, setRekomendasiList] = useState([]);
  const [loadingRekomendasi, setLoadingRekomendasi] = useState(false);
  const [rekomendasiError, setRekomendasiError] = useState(null);

  // Form states
  const [editProject, setEditProject] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formFieldErrors, setFormFieldErrors] = useState({});
  const [formGeneralError, setFormGeneralError] = useState(null);
  const [formResetKey, setFormResetKey] = useState(0);

  // Status updating state for projects
  const [updatingStatusProjectId, setUpdatingStatusProjectId] = useState(null);

  // Fetch applicants for a specific project
  const fetchApplicants = useCallback(async (proyekId) => {
    setLoadingApplicantsMap((prev) => ({ ...prev, [proyekId]: true }));
    setApplicantErrorMap((prev) => ({ ...prev, [proyekId]: null }));
    try {
      const res = await getPelamarProyek(proyekId);
      setApplicantsMap((prev) => ({
        ...prev,
        [proyekId]: Array.isArray(res) ? res : [],
      }));
    } catch (err) {
      setApplicantErrorMap((prev) => ({
        ...prev,
        [proyekId]: err.message || "Gagal memuat daftar pelamar",
      }));
    } finally {
      setLoadingApplicantsMap((prev) => ({ ...prev, [proyekId]: false }));
    }
  }, []);

  // Fetch recommendations for selected project
  const fetchRecommendations = useCallback(async (proyekId) => {
    if (!proyekId) {
      setRekomendasiList([]);
      return;
    }
    setLoadingRekomendasi(true);
    setRekomendasiError(null);
    try {
      const res = await getRekomendasiMitra(proyekId, 3);
      setRekomendasiList(Array.isArray(res) ? res : []);
    } catch (err) {
      setRekomendasiError(err.message || "Gagal memuat rekomendasi mitra");
    } finally {
      setLoadingRekomendasi(false);
    }
  }, []);

  // Initial load
  const loadInitialData = useCallback(async () => {
    setLoadingProjects(true);
    setProjectsError(null);
    try {
      const [proyekRes, tagsRes] = await Promise.all([
        getProyekSaya(),
        getAllTags("skill"),
      ]);

      const loadedProjects = Array.isArray(proyekRes) ? proyekRes : [];
      setProjects(loadedProjects);

      if (loadedProjects.length > 0) {
        const firstId = loadedProjects[0].proyek_id;
        setSelectedProjectId(firstId);
        // Load applicants for all projects
        loadedProjects.forEach((p) => {
          fetchApplicants(p.proyek_id);
        });
        // Load recommendations for first project
        fetchRecommendations(firstId);
      }

      setAvailableTags(Array.isArray(tagsRes) ? tagsRes : []);
    } catch (err) {
      setProjectsError(err.message || "Gagal memuat data proyek");
    } finally {
      setLoadingProjects(false);
      setLoadingTags(false);
    }
  }, [fetchApplicants, fetchRecommendations]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // When selected project changes (and not on initial load)
  function handleSelectProject(proyekId) {
    if (proyekId === selectedProjectId) return;
    setSelectedProjectId(proyekId);
    if (!applicantsMap[proyekId]) {
      fetchApplicants(proyekId);
    }
    fetchRecommendations(proyekId);
  }

  // Handle Form Submit (Create or Edit)
  async function handleFormSubmit(payload, isEdit) {
    setIsSubmittingForm(true);
    setFormFieldErrors({});
    setFormGeneralError(null);

    try {
      if (isEdit && editProject) {
        const updated = await updateProyek(editProject.proyek_id, payload);

        setProjects((prev) =>
          prev.map((p) =>
            p.proyek_id === editProject.proyek_id
              ? {
                  ...p,
                  ...updated,
                  tags: payload.tag_ids
                    ? availableTags.filter((t) =>
                        payload.tag_ids.includes(t.tag_id)
                      )
                    : p.tags,
                }
              : p
          )
        );

        setEditProject(null);
        fetchRecommendations(editProject.proyek_id);
      } else {
        const created = await createProyek(payload);

        // Populate tags array for the newly created project
        const projectWithTags = {
          ...created,
          tags: payload.tag_ids
            ? availableTags.filter((t) => payload.tag_ids.includes(t.tag_id))
            : [],
          slot_terisi: 0,
        };

        setProjects((prev) => [projectWithTags, ...prev]);
        setSelectedProjectId(created.proyek_id);
        setApplicantsMap((prev) => ({ ...prev, [created.proyek_id]: [] }));
        fetchRecommendations(created.proyek_id);

        // Kosongkan formulir setelah proyek berhasil dibuat
        setFormResetKey((k) => k + 1);
      }
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorsByField = {};
        err.errors.forEach((e) => {
          if (e.field) {
            errorsByField[e.field] = e.message;
          }
        });
        setFormFieldErrors(errorsByField);
      } else {
        setFormGeneralError(
          err.message ||
            (isEdit ? "Gagal memperbarui proyek" : "Gagal memublikasikan proyek")
        );
      }
    } finally {
      setIsSubmittingForm(false);
    }
  }

  // Enter Edit mode
  function handleStartEdit(proyek) {
    setEditProject(proyek);
    setFormFieldErrors({});
    setFormGeneralError(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Cancel Edit mode
  function handleCancelEdit() {
    setEditProject(null);
    setFormFieldErrors({});
    setFormGeneralError(null);
  }

  // Toggle project status (buka / ditutup)
  async function handleToggleStatus(proyekId, newStatus) {
    setUpdatingStatusProjectId(proyekId);
    try {
      await updateProyek(proyekId, { status: newStatus });
      setProjects((prev) =>
        prev.map((p) =>
          p.proyek_id === proyekId ? { ...p, status: newStatus } : p
        )
      );
    } catch (err) {
      alert(err.message || "Gagal mengubah status proyek");
    } finally {
      setUpdatingStatusProjectId(null);
    }
  }

  // Update applicant status (diterima / ditolak)
  async function handleUpdateApplicantStatus(proyekId, aplikasiId, newStatus) {
    setProcessingApplicantId(aplikasiId);
    setApplicantErrorMap((prev) => ({ ...prev, [proyekId]: null }));

    try {
      const updatedApplicant = await updateStatusLamaran(aplikasiId, newStatus);

      // Update in applicantsMap
      setApplicantsMap((prev) => {
        const currentList = prev[proyekId] || [];
        const nextList = currentList.map((a) =>
          a.aplikasi_id === aplikasiId
            ? { ...a, status: updatedApplicant.status || newStatus }
            : a
        );
        return { ...prev, [proyekId]: nextList };
      });

      // If accepted, check if slots are now full and update project
      if (newStatus === "diterima") {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.proyek_id === proyekId) {
              const currentTerisi =
                (applicantsMap[proyekId] || []).filter(
                  (a) => a.status === "diterima"
                ).length + 1;
              const isFull = currentTerisi >= (p.slot_dibutuhkan || 1);
              return {
                ...p,
                slot_terisi: currentTerisi,
                status: isFull ? "ditutup" : p.status,
              };
            }
            return p;
          })
        );
      }
    } catch (err) {
      setApplicantErrorMap((prev) => ({
        ...prev,
        [proyekId]: err.message || "Gagal memperbarui status pelamar",
      }));
    } finally {
      setProcessingApplicantId(null);
    }
  }

  // Invite partner
  async function handleInvitePartner(penerimaId, pesan) {
    return kirimPesan(penerimaId, pesan);
  }

  // Active project for recommendations
  const activeProject =
    projects.find((p) => p.proyek_id === selectedProjectId) ||
    projects[0] ||
    null;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto gap-space-lg">
      {/* Header Section */}
      <ProyekSayaHeader />

      {/* Global Error Banner if initial fetch fails */}
      {projectsError && (
        <div className="p-4 rounded-2xl bg-error-container text-on-error-container flex items-center justify-between">
          <span className="text-body-md font-medium">{projectsError}</span>
          <button
            type="button"
            onClick={loadInitialData}
            className="px-4 py-1.5 bg-error text-on-error rounded-xl text-body-md font-semibold cursor-pointer hover:opacity-90 transition-opacity"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Two-Column Grid */}
      <div className="grid grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Form */}
        <ProyekForm
          key={editProject?.proyek_id || `new-${formResetKey}`}
          formRef={formRef}
          editProject={editProject}
          availableTags={availableTags}
          loadingTags={loadingTags}
          onSubmit={handleFormSubmit}
          onCancelEdit={handleCancelEdit}
          isSubmitting={isSubmittingForm}
          fieldErrors={formFieldErrors}
          generalError={formGeneralError}
        />

        {/* Right Column: Projects & Recommendations */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-space-xl">
          {loadingProjects ? (
            <div className="bg-surface-container-lowest rounded-[2rem] p-space-xl shadow-sm flex flex-col gap-space-md">
              <div className="h-6 w-24 bg-surface-container-low rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-surface-container-low rounded-2xl animate-pulse" />
              <div className="h-16 bg-surface-container-low rounded-2xl animate-pulse" />
              <div className="h-28 bg-surface-container-low rounded-2xl animate-pulse" />
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-[2rem] p-space-xl shadow-sm text-center flex flex-col items-center justify-center py-12 gap-2">
              <span className="material-symbols-outlined text-[48px] text-outline-variant">
                folder_open
              </span>
              <p className="text-body-lg text-on-surface-variant max-w-md">
                Belum ada postingan proyek. Buat proyek pertamamu lewat formulir
                di sebelah kiri.
              </p>
            </div>
          ) : (
            <>
              {/* List of projects */}
              {projects.map((proyek) => (
                <ProyekPostCard
                  key={proyek.proyek_id}
                  proyek={proyek}
                  applicants={applicantsMap[proyek.proyek_id] || []}
                  loadingApplicants={Boolean(
                    loadingApplicantsMap[proyek.proyek_id]
                  )}
                  applicantError={applicantErrorMap[proyek.proyek_id] || null}
                  isSelected={proyek.proyek_id === selectedProjectId}
                  totalProjects={projects.length}
                  onSelect={() => handleSelectProject(proyek.proyek_id)}
                  onEdit={handleStartEdit}
                  onToggleStatus={handleToggleStatus}
                  isUpdatingStatus={
                    updatingStatusProjectId === proyek.proyek_id
                  }
                  onUpdateApplicantStatus={(aplikasiId, newStatus) =>
                    handleUpdateApplicantStatus(
                      proyek.proyek_id,
                      aplikasiId,
                      newStatus
                    )
                  }
                  processingApplicantId={processingApplicantId}
                />
              ))}

              {/* Recommendation Panel for selected project */}
              {activeProject && (
                <RekomendasiPanel
                  rekomendasi={rekomendasiList}
                  loading={loadingRekomendasi}
                  error={rekomendasiError}
                  proyekJudul={activeProject.judul}
                  onInvite={handleInvitePartner}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

