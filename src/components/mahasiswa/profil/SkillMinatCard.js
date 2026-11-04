import TagChipGroup from "./TagChipGroup";

export default function SkillMinatCard({
  selectedTags = [],
  allTags = [],
  onAddTag,
  onRemoveTag,
}) {
  const skillTags = selectedTags.filter((t) => t.jenis === "skill");
  const minatTags = selectedTags.filter((t) => t.jenis === "minat");

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm p-6 flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex items-start gap-space-md">
        <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-title-lg text-on-surface font-semibold">Skill & Minat</h2>
          <p className="text-body-md text-on-surface-variant font-normal">
            Tentukan kompetensi teknis dan topik proyek yang ingin kamu eksplorasi.
          </p>
        </div>
      </div>

      {/* Group Skill */}
      <TagChipGroup
        label="Skill"
        jenis="skill"
        selectedTags={skillTags}
        allTags={allTags}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />

      {/* Group Minat */}
      <TagChipGroup
        label="Minat Bidang Proyek"
        jenis="minat"
        selectedTags={minatTags}
        allTags={allTags}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />
    </div>
  );
}

