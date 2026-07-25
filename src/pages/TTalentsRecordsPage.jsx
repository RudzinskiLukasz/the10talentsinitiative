import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { usePublishedTracks } from "../hooks/useTracks.js";
import { downloadTrackFile } from "../lib/tracksApi.js";

export default function TTalentsRecordsPage() {
  const { t } = useTranslation();
  const { tracks, loading } = usePublishedTracks();
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState("");

  async function handleDownload(track) {
    setDownloadError("");
    setDownloadingId(track.id);
    try {
      await downloadTrackFile(track);
    } catch (err) {
      setDownloadError(err.message || t("tTalentsRecordsPage.downloadFailed"));
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title={t("tTalentsRecordsPage.title")}
        description={t("tTalentsRecordsPage.intro")}
      />
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        {downloadError && (
          <p className="mb-6 rounded-xl border border-border bg-surface p-3 text-sm text-red-400">
            {downloadError}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-fg-muted">{t("tTalentsRecordsPage.loading")}</p>
        ) : tracks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-fg-muted">
            {t("tTalentsRecordsPage.empty")}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track, i) => (
              <Reveal
                key={track.id}
                delay={(i % 3) * 70}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
              >
                {track.cover_url ? (
                  <div className="aspect-square overflow-hidden border-b border-border-subtle bg-bg">
                    <img
                      src={track.cover_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center border-b border-border-subtle bg-bg/80">
                    <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg-subtle/50">
                      {t("tTalentsRecordsPage.coverFallback")}
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-lg font-semibold leading-snug text-fg">
                    {track.title}
                  </h2>
                  {track.artist && (
                    <p className="mt-1 text-xs text-fg-subtle">{track.artist}</p>
                  )}
                  <p className="mt-1 text-xs text-fg-subtle">{track.date}</p>
                  {track.description && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted line-clamp-4">
                      {track.description}
                    </p>
                  )}
                  {track.audio_url && (
                    <audio
                      controls
                      preload="none"
                      src={track.audio_url}
                      className="mt-4 w-full"
                    >
                      <track kind="captions" />
                    </audio>
                  )}
                  <button
                    type="button"
                    disabled={downloadingId === track.id}
                    onClick={() => handleDownload(track)}
                    className="mt-5 inline-flex w-fit rounded-full border border-border-strong bg-bg px-5 py-2 text-sm font-semibold text-fg transition hover:bg-surface-hover disabled:opacity-50"
                  >
                    {downloadingId === track.id
                      ? t("tTalentsRecordsPage.downloading")
                      : t("common.download")}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
