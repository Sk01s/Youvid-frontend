"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { uploadVideo } from "@/lib/api/videos/profile.api";
import { getCategories } from "@/lib/api/categories.api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UploadPage() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const isDark = theme === "dark";

  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Upload video mutation
  const uploadMutation = useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-videos"] });
      toast.success("Video uploaded successfully!");
      // Reset form after success
      setVideoFile(null);
      setFormData({
        title: "",
        description: "",
        categoryId: "",
      });
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message || "Unknown error"}`);
    },
  });

  const isLoading = uploadMutation.isPending;
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "video/*": [".mp4", ".mov", ".avi", ".mkv"] },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 500, // 500MB
    onDrop: (acceptedFiles: File[]) => {
      setVideoFile(acceptedFiles[0]);
    },
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0];
      if (file) {
        toast.error(
          `File rejected: ${file.file.name} (${formatFileSize(
            file.file.size
          )} - ${file.errors[0]?.message}`
        );
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const data = new FormData();
    data.append("video", videoFile);
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.categoryId) {
      data.append("categoryId", formData.categoryId);
    }

    uploadMutation.mutate(data);
  };

  // Helper to format file sizes
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div
      className={cn(
        "flex min-h-svh w-full items-center justify-center p-6 md:p-10",
        isDark ? "bg-zinc-900" : "bg-white"
      )}
    >
      <div className="w-full max-w-[calc(100vw-3rem)] md:max-w-2xl">
        <Card
          className={cn(
            "rounded-3xl bg-opacity-80 border",
            isDark
              ? "bg-zinc-950 border-gray-700"
              : "bg-zinc-100 border-gray-200"
          )}
        >
          <CardHeader className="text-center">
            <CardTitle
              className={cn(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-gray-900"
              )}
            >
              Upload Video
            </CardTitle>
            <CardDescription
              className={isDark ? "text-gray-300" : "text-gray-600"}
            >
              Select a file and add details below
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Drag & Drop Zone */}
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center mb-6 cursor-pointer",
                isDark
                  ? "border-zinc-700 bg-zinc-800 hover:bg-zinc-750"
                  : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100"
              )}
            >
              <input {...getInputProps()} />
              <FiUploadCloud className="mx-auto text-4xl text-zinc-500 mb-3" />
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                Drag & drop a video file, or click to browse
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                Supported formats: MP4, MOV, AVI, MKV • Max size: 500MB
              </p>
              {videoFile && (
                <div
                  className={cn(
                    "mt-4 flex items-center justify-between rounded-lg p-3",
                    isDark ? "bg-zinc-800" : "bg-zinc-100"
                  )}
                >
                  <span className="truncate">
                    {videoFile.name} ({formatFileSize(videoFile.size)})
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoFile(null);
                    }}
                    className="ml-2"
                  >
                    <FiX className="text-red-500" />
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="title"
                  className={isDark ? "text-gray-300" : "text-gray-700"}
                >
                  Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter video title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  disabled={isLoading}
                  className={cn(
                    "rounded-xl",
                    isDark
                      ? "bg-zinc-800 text-white border-gray-600 focus-visible:ring-gray-300"
                      : "bg-zinc-50 text-gray-900 border-gray-300"
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="description"
                  className={isDark ? "text-gray-300" : "text-gray-700"}
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add a description (optional)"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  className={cn(
                    "rounded-xl py-2",
                    isDark
                      ? "bg-zinc-800 text-white border-gray-600 focus-visible:ring-gray-300"
                      : "bg-zinc-50 text-gray-900 border-gray-300"
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="category"
                  className={isDark ? "text-gray-300" : "text-gray-700"}
                >
                  Category
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoryId: value }))
                  }
                  disabled={isLoading || isCategoriesLoading}
                >
                  <SelectTrigger
                    className={cn(
                      "rounded-xl",
                      isDark
                        ? "bg-zinc-800 text-white border-gray-600"
                        : "bg-zinc-50 text-gray-900 border-gray-300"
                    )}
                  >
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>
                  <SelectContent
                    className={cn(
                      isDark
                        ? "bg-zinc-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    )}
                  >
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={!videoFile || isLoading}
                className={cn(
                  "w-full rounded-xl py-6",
                  isDark
                    ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-900 disabled:opacity-50"
                    : "bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Upload Video"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
