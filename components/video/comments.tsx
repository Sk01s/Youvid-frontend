"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { Comment as CommentType } from "@/lib/types";
import Comment from "./comment";
import {
  fetchComments,
  addComment,
  likeComment,
  dislikeComment,
} from "@/lib/api";

// Main CommentsSection component
export default function CommentsSection({ videoId }: { videoId: string }) {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [newComment, setNewComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // Fetch comments with React Query
  const { data: comments = [], isLoading } = useQuery<CommentType[]>({
    queryKey: ["comments", videoId],
    queryFn: () => fetchComments(videoId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: Boolean(videoId),
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (text: string) => addComment(videoId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
      setNewComment("");
      textareaRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    onError: (error) => {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment);
  };

  return (
    <section className="mt-8">
      <h2
        className={cn(
          "text-lg font-medium mb-4",
          theme === "dark" ? "text-zinc-100" : "text-zinc-800"
        )}
      >
        Comments
      </h2>

      {/* New Comment Form */}
      <div className="flex mb-6 space-x-4">
        <Avatar>
          <AvatarFallback>CU</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Add a public comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={cn(
              "resize-none",
              theme === "dark"
                ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                : ""
            )}
          />
          <div className="flex justify-end mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewComment("")}
              className={
                theme === "dark" ? "text-zinc-300 hover:bg-zinc-700" : ""
              }
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmit}
              className="ml-2"
              disabled={addCommentMutation.isPending}
            >
              {addCommentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Comment"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            theme={theme}
            videoId={videoId}
          />
        ))}
      </div>
    </section>
  );
}
