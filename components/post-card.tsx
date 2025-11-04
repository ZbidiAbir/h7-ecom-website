"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import MarkdownRenderer from "./markdown-renderer";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function PostCard({
  post,
  showFullContent = false,
}: {
  post: Post;
  showFullContent?: boolean;
}) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [likeLoading, setLikeLoading] = useState(true);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!session?.user?.id) {
        setLikeLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/posts/${post.id}/like-status`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      } finally {
        setLikeLoading(false);
      }
    };

    fetchLikeStatus();
  }, [post.id, session?.user?.id]);

  const handleLike = async () => {
    if (!session) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });
      const data = await response.json();

      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const content = showFullContent
    ? post.content
    : post.content.slice(0, 200) + (post.content.length > 200 ? "..." : "");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.author.image || ""} />
            <AvatarFallback>{post.author.name?.[0] || "A"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <CardTitle className="text-xl">
          {showFullContent ? (
            post.title
          ) : (
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownRenderer content={content} />
      </CardContent>
      <CardFooter className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1"
          onClick={handleLike}
          disabled={!session}
        >
          <Heart
            className={`h-4 w-4 ${
              likeLoading
                ? "animate-pulse"
                : liked
                ? "fill-red-500 text-red-500"
                : ""
            }`}
          />
          <span>{likeCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post._count.comments}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
