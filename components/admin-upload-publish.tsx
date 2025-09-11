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

interface AdminUploadPublishDialogProps {
  onUploadSuccess?: () => void;
  buttonText?: string;
  buttonProps?: {
    size?: "sm" | "lg" | "default";
    className?: string;
  };
}

export function AdminUploadPublishDialog({ onUploadSuccess, buttonText = "Upload", buttonProps }: AdminUploadPublishDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);
  const [urlManager] = useState(() => createURLManager());

  const [formData, setFormData] = useState<AppFormData>({
    name: "",
    developer: "",
    description: "",
    store: "google-play",
    status: "in-review",
    tags: "",
    rating: 4.5,
    downloads: "1K+",
    version: "1.0.0",
    size: "50MB",
    category: "",
    storeUrl: "",
    appCategory: "normal",
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

  useEffect(() => {
    screenshotUrls.forEach(url => urlManager.revokeObjectURL(url));
    const urls = screenshotFiles.map(file => urlManager.createObjectURL(file)).filter(Boolean) as string[];
    setScreenshotUrls(urls);
  }, [screenshotFiles, urlManager]);

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
      formDataToSend.append("isPublished", "false");
      formDataToSend.append("store", formData.store);
      formDataToSend.append("storeUrl", formData.storeUrl);

      const response = await fetch("/api/gallery?type=gallery", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("✅ In Review");
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
      <Button
        onClick={() => setIsOpen(true)}
        size={buttonProps?.size || "default"}
        className={buttonProps?.className}
      >
        <Upload className="h-4 w-4 mr-2" /> {buttonText}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload App (Review)</DialogTitle>
            <DialogDescription>This app will be saved for review, not published yet.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">App Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter app name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Developer</label>
              <Input
                value={formData.developer}
                onChange={(e) => setFormData((prev) => ({ ...prev, developer: e.target.value }))}
                placeholder="Enter developer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter app description"
              />
            </div>

            {/* Store 선택 */}
            <div>
              <label className="block text-sm font-medium mb-1">Store</label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start h-10 bg-white hover:bg-gray-50 border border-gray-200"
                onClick={() => {
                  const stores: AppFormData["store"][] = ["google-play", "app-store"];
                  const currentIndex = stores.indexOf(formData.store);
                  const nextIndex = (currentIndex + 1) % stores.length;
                  const newStore = stores[nextIndex];
                  setFormData(prev => ({ ...prev, store: newStore }));
                }}
              >
                {formData.store === "google-play" ? "🤖 Google Play" : "🍎 App Store"}
              </Button>
            </div>

            {/* App Icon */}
            <div>
              <label className="block text-sm font-medium mb-1">App Icon *</label>
              <label htmlFor="icon-upload" className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                {iconFile && iconUrl ? (
                  <div className="flex items-center gap-2">
                    <img src={iconUrl} alt="Icon preview" className="w-12 h-12 rounded object-cover" />
                    <span className="text-sm">{iconFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-6 h-6 mb-1 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload app icon</p>
                  </div>
                )}
                <input id="icon-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setIconFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-sm font-medium mb-1">Screenshots</label>
              <label htmlFor="screenshots-upload" className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-6 h-6 mb-1 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload screenshots</p>
                </div>
                <input id="screenshots-upload" type="file" multiple accept="image/*" className="hidden" onChange={(e) => setScreenshotFiles(Array.from(e.target.files || []))} />
              </label>

              {screenshotFiles.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {screenshotFiles.map((file, index) => (
                    screenshotUrls[index] ? (
                      <div key={index} className="relative group">
                        <img src={screenshotUrls[index]} alt={`Screenshot ${index + 1}`} className="w-full h-20 object-cover rounded" />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setScreenshotFiles(prev => prev.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : null
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Comma-separated"
              />
              <p className="text-xs text-gray-400 mt-1">e.g., game, utility</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.developer || !iconFile}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
