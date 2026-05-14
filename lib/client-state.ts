"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  SELECTED_BODY_PART_STORAGE_KEY,
  UPLOADED_PHOTOS_STORAGE_KEY,
} from "@/lib/fitness-data";
import {
  parsePersonalPlanSettings,
  parsePersonalTrainingLogs,
  PERSONAL_PLAN_SETTINGS_EVENT,
  PERSONAL_PLAN_SETTINGS_STORAGE_KEY,
  PERSONAL_TRAINING_LOGS_EVENT,
  PERSONAL_TRAINING_LOGS_STORAGE_KEY,
  type PersonalPlanSettings,
  type PersonalTrainingLog,
} from "@/lib/personal-plan";
import type { PhotoEntry } from "@/lib/types";

const bodyPartEvent = "fitpilot-body-part-change";
const photosEvent = "fitpilot-photos-updated";

export function useSelectedBodyPart() {
  const selectedPart = useSyncExternalStore(
    subscribeBodyPart,
    getBodyPartSnapshot,
    getBodyPartServerSnapshot,
  );

  const setSelectedPart = useCallback((part: string) => {
    window.localStorage.setItem(SELECTED_BODY_PART_STORAGE_KEY, part);
    window.dispatchEvent(new CustomEvent(bodyPartEvent, { detail: part }));
  }, []);

  return [selectedPart, setSelectedPart] as const;
}

export function useUploadedPhotos() {
  const uploadedPhotosSnapshot = useSyncExternalStore(
    subscribePhotos,
    getUploadedPhotosSnapshot,
    getUploadedPhotosServerSnapshot,
  );
  const uploadedPhotos = useMemo(
    () => parseUploadedPhotos(uploadedPhotosSnapshot),
    [uploadedPhotosSnapshot],
  );

  const setUploadedPhotos = useCallback((photos: PhotoEntry[]) => {
    window.localStorage.setItem(UPLOADED_PHOTOS_STORAGE_KEY, JSON.stringify(photos));
    window.dispatchEvent(new Event(photosEvent));
  }, []);

  return [uploadedPhotos, setUploadedPhotos] as const;
}

export function usePersonalPlanSettings() {
  const settingsSnapshot = useSyncExternalStore(
    subscribePersonalPlanSettings,
    getPersonalPlanSettingsSnapshot,
    getPersonalPlanSettingsServerSnapshot,
  );
  const settings = useMemo(
    () => parsePersonalPlanSettings(settingsSnapshot),
    [settingsSnapshot],
  );

  const setSettings = useCallback((nextSettings: PersonalPlanSettings) => {
    window.localStorage.setItem(
      PERSONAL_PLAN_SETTINGS_STORAGE_KEY,
      JSON.stringify(nextSettings),
    );
    window.dispatchEvent(new Event(PERSONAL_PLAN_SETTINGS_EVENT));
  }, []);

  return [settings, setSettings] as const;
}

export function usePersonalTrainingLogs() {
  const logsSnapshot = useSyncExternalStore(
    subscribePersonalTrainingLogs,
    getPersonalTrainingLogsSnapshot,
    getPersonalTrainingLogsServerSnapshot,
  );
  const logs = useMemo(
    () => parsePersonalTrainingLogs(logsSnapshot),
    [logsSnapshot],
  );

  const setLogs = useCallback((nextLogs: PersonalTrainingLog[]) => {
    window.localStorage.setItem(
      PERSONAL_TRAINING_LOGS_STORAGE_KEY,
      JSON.stringify(nextLogs),
    );
    window.dispatchEvent(new Event(PERSONAL_TRAINING_LOGS_EVENT));
  }, []);

  return [logs, setLogs] as const;
}

function parseUploadedPhotos(snapshot: string): PhotoEntry[] {
  try {
    return JSON.parse(snapshot) as PhotoEntry[];
  } catch {
    return [];
  }
}

function subscribeBodyPart(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(bodyPartEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(bodyPartEvent, callback);
  };
}

function getBodyPartSnapshot() {
  return window.localStorage.getItem(SELECTED_BODY_PART_STORAGE_KEY) || "背部";
}

function getBodyPartServerSnapshot() {
  return "背部";
}

function subscribePhotos(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(photosEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(photosEvent, callback);
  };
}

function getUploadedPhotosSnapshot() {
  return window.localStorage.getItem(UPLOADED_PHOTOS_STORAGE_KEY) || "[]";
}

function getUploadedPhotosServerSnapshot() {
  return "[]";
}

function subscribePersonalPlanSettings(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PERSONAL_PLAN_SETTINGS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PERSONAL_PLAN_SETTINGS_EVENT, callback);
  };
}

function getPersonalPlanSettingsSnapshot() {
  return window.localStorage.getItem(PERSONAL_PLAN_SETTINGS_STORAGE_KEY) || "";
}

function getPersonalPlanSettingsServerSnapshot() {
  return "";
}

function subscribePersonalTrainingLogs(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PERSONAL_TRAINING_LOGS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PERSONAL_TRAINING_LOGS_EVENT, callback);
  };
}

function getPersonalTrainingLogsSnapshot() {
  return window.localStorage.getItem(PERSONAL_TRAINING_LOGS_STORAGE_KEY) || "[]";
}

function getPersonalTrainingLogsServerSnapshot() {
  return "[]";
}
