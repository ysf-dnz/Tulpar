"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
export function PanoViewTracker() { useEffect(() => track("pano_viewed"), []); return null; }
