// admin-upload-publish.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { AppFormData } from "@/types";
import { createURLManager, registerManager, unregisterManager } from "@/lib/url-manager";

const defaultTexts = {
  upload: "Upload",
  uploadTitle: "Upload App (Published)",
  uploadDescription: "This app will be published immediately.",
  appName: "App Name",
  appNamePlaceholder: "Enter app name",
  developer: "Developer",
  developerPlaceholder: "Enter developer name",
  description: "Description",
  descriptionPlaceholder: "Enter app description",
  tags: "Tags",
  tagsPlaceholder: "Comma-separated",
  tagsExample: "e.g., game, utility",
  cancel: "Cancel",
};

export function AdminUploadPublishDialog({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [urlManager] = useState(() => createURLManager());

  const [formData, setFormData] = useState<AppFormData>({
    name: "",
    developer: "",
    description: "",
    store: "google-play",
    status: "published", // ✅ 고정
    tags: "",
    rating: 4.5,
    downloads: "1K+",
    version: "1.0.0",
    size: "50MB",
    category: "",
    storeUrl: "",
    appCategory: "normal", // ✅ 고정
  });

  useEffect(() => {
    registerManager(urlManager);
    return () => {
      unregisterManager(urlManager);
      urlManager.dispose();
    };
  }, [urlManager]);

  useEffect(() => {
    if (iconUrl) {
      urlManager.revokeObjectURL(iconUrl);
      setIconUrl(null);
    }
    if (iconFile && !urlManager.isDisposed()) {
      const url = urlManager.createObjectURL(iconFile);
      if (url) setIconUrl(url);
    }
  }, [iconFile, urlManager]);

  const handleSubmit = async () => {
    if (!iconFile) {
      alert("Select an app icon");
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", iconFile);
      formDataToSend.append("title", formData.name);
      formDataToSend.append("content", formData.description);
      formDataToSend.append("author", formData.developer);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("isPublished", "true");
      formDataToSend.append("store", formData.store);
      formDataToSend.append("storeUrl", formData.storeUrl);

      const response = await fetch("/api/gallery?type=gallery", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("✅ Published");
        onUploadSuccess?.();
        setIsOpen(false);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Upload error");
    }
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        <Upload className="h-4 w-4 mr-2" /> {defaultTexts.upload}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{defaultTexts.uploadTitle}</DialogTitle>
            <DialogDescription>{defaultTexts.uploadDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{defaultTexts.appName}</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={defaultTexts.appNamePlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{defaultTexts.developer}</label>
              <Input
                value={formData.developer}
                onChange={(e) => setFormData((prev) => ({ ...prev, developer: e.target.value }))}
                placeholder={defaultTexts.developerPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{defaultTexts.description}</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={defaultTexts.descriptionPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="file" accept="image/*" hidden onChange={(e) => setIconFile(e.target.files?.[0] || null)} />
                {iconUrl ? (
                  <img src={iconUrl} className="w-12 h-12 object-cover rounded" alt="Preview" />
                ) : (
                  <span className="text-sm text-gray-500">Click to upload</span>
                )}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{defaultTexts.tags}</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder={defaultTexts.tagsPlaceholder}
              />
              <p className="text-xs text-gray-400 mt-1">{defaultTexts.tagsExample}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {defaultTexts.cancel}
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.developer || !iconFile}>
              {defaultTexts.upload}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
