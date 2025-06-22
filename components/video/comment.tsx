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
import { Comment } from "@/lib/types";
import {
  toggleCommentDislike,
  toggleCommentLike,
} from "@/lib/api/comments.api";

// New CommentItem component
const CommentItem = ({
  comment,
  theme,
  videoId,
}: {
  comment: Comment;
  theme: "light" | "dark";
  videoId: string;
}) => {
  const queryClient = useQueryClient();
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  // Like comment mutation
  const likeMutation = useMutation({
    mutationFn: () => toggleCommentLike(comment.id),
    onMutate: () => setIsLiking(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
    onSettled: () => setIsLiking(false),
  });

  // Dislike comment mutation
  const dislikeMutation = useMutation({
    mutationFn: () => toggleCommentDislike(comment.id),
    onMutate: () => setIsDisliking(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
    onSettled: () => setIsDisliking(false),
  });

  return (
    <div className="flex space-x-4">
      <Avatar>
        {comment.avatarUrl ? (
          <AvatarImage src={comment.avatarUrl} alt={comment.username} />
        ) : (
          <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span
            className={cn(
              "font-semibold",
              theme === "dark" ? "text-zinc-100" : "text-zinc-800"
            )}
          >
            {comment.username}
          </span>
          <span
            className={cn(
              "text-sm",
              theme === "dark" ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            {comment.createdAt}
          </span>
        </div>
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed",
            theme === "dark" ? "text-zinc-300" : "text-zinc-700"
          )}
        >
          {comment.text}
        </p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <button
            className="flex items-center space-x-1"
            onClick={() => likeMutation.mutate()}
            disabled={isLiking || isDisliking}
          >
            {isLiking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ThumbsUp
                className={cn(
                  "w-4 h-4",
                  comment.isLiked ? "text-blue-500 fill-current" : ""
                )}
              />
            )}
            <span>{comment.likes}</span>
          </button>
          <button
            className="flex items-center space-x-1"
            onClick={() => dislikeMutation.mutate()}
            disabled={isLiking || isDisliking}
          >
            {isDisliking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ThumbsDown
                className={cn(
                  "w-4 h-4",
                  comment.isDisliked ? "text-blue-500 fill-current" : ""
                )}
              />
            )}
            <span>{comment.dislikes}</span>
          </button>
          <button
            className={cn(
              "hover:underline",
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            )}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};
export default CommentItem;
