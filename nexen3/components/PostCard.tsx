import React, { useState } from "react";
import { Post, PostComment, User } from "../types";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  MoreHorizontal,
  Send,
  UserPlus,
  Bookmark,
  Link as LinkIcon,
  EyeOff,
  Flag,
  Check,
  BellOff,
  Sparkles,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

interface PostCardProps {
  post: Post;
  currentUser: User;
  onRemove?: (id: string) => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onUserClick?: (user: User) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onRemove,
  isSaved = false,
  onToggleSave,
  onUserClick,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [expandedSection, setExpandedSection] = useState<
    "comments" | "reposts" | null
  >(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<PostComment[]>(
    post.commentList || [],
  );
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  if (isMuted) return null;

  const handleLike = () => {
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => {
      setCopyFeedback(false);
      setShowMoreMenu(false);
      setShowShareMenu(false);
    }, 1200);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Post by ${post.user.name}`,
      text: post.content,
      url: `${window.location.origin}/post/${post.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const shareTo = (platform: "twitter" | "linkedin" | "whatsapp" | "email") => {
    const text = encodeURIComponent(post.content);
    const url = encodeURIComponent(`${window.location.origin}/post/${post.id}`);
    const title = encodeURIComponent(`Post by ${post.user.name}`);

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
        break;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const handleMute = () => {
    setIsMuted(true);
    if (onRemove) onRemove(post.id);
  };

  const handleReport = () => {
    alert("This post has been reported for review. Content hidden.");
    handleMute();
  };

  const handleSave = () => {
    if (onToggleSave) onToggleSave();
    setShowMoreMenu(false);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setShowMoreMenu(false);
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: post.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to summarize post");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Summarization failed", error);
      alert("Failed to summarize post.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: PostComment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      text: newComment,
      timestamp: "Just now",
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div
      className={`bg-white dark:bg-white/10 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/10 mb-4 overflow-visible transition-all hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/20 relative duration-300 ${showMoreMenu || showShareMenu ? "z-30" : "z-0"}`}
    >
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-3">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onUserClick && onUserClick(post.user)}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3
                  className="font-bold text-slate-900 dark:text-white leading-tight cursor-pointer hover:underline"
                  onClick={() => onUserClick && onUserClick(post.user)}
                >
                  {post.user.name}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  @{post.user.username} • {post.timestamp}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                {post.user.role} @ {post.user.company}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`p-2 rounded-full transition-colors ${showMoreMenu ? "bg-slate-100 dark:bg-white/10 text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"}`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                  <MenuOption
                    icon={
                      <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    }
                    label="Summarize with AI"
                    onClick={handleSummarize}
                  />
                  <MenuOption
                    icon={
                      isSaved ? (
                        <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )
                    }
                    label={isSaved ? "Saved to Bookmarks" : "Save post"}
                    onClick={handleSave}
                  />
                  <MenuOption
                    icon={
                      copyFeedback ? (
                        <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                      ) : (
                        <LinkIcon className="w-4 h-4" />
                      )
                    }
                    label={copyFeedback ? "Link Copied!" : "Copy link to post"}
                    onClick={handleCopyLink}
                  />
                  <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />
                  <MenuOption
                    icon={<BellOff className="w-4 h-4" />}
                    label="Mute this thread"
                    onClick={handleMute}
                  />
                  <MenuOption
                    icon={<EyeOff className="w-4 h-4" />}
                    label="Not interested"
                    onClick={handleMute}
                  />
                  <MenuOption
                    icon={<Flag className="w-4 h-4 text-rose-500" />}
                    label="Report post"
                    onClick={handleReport}
                    danger
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="pl-[60px] mb-4">
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {isSummarizing && (
            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/20 flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                Generating summary...
              </span>
            </div>
          )}

          {summary && !isSummarizing && (
            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/20 relative group">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-300 mb-0.5">
                    AI Summary
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-200 leading-relaxed">
                    {summary}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSummary(null)}
                className="absolute top-2 right-2 p-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-500/10 ${liked ? "text-rose-500" : "text-slate-400 hover:text-rose-400"}`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            <span className="text-xs font-bold">{likesCount}</span>
          </button>
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === "comments" ? null : "comments",
              )
            }
            className={`flex items-center gap-1.5 p-2 rounded-lg ${expandedSection === "comments" ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10" : "text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-bold">{comments.length}</span>
          </button>
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === "reposts" ? null : "reposts",
              )
            }
            className={`flex items-center gap-1.5 p-2 rounded-lg ${expandedSection === "reposts" ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10" : "text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"}`}
          >
            <Repeat2 className="w-5 h-5" />
            <span className="text-xs font-bold">{post.reposts}</span>
          </button>

          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Share</span>
            </button>
            {showShareMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowShareMenu(false)}
                />
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-white/10 shadow-xl z-50 py-2 animate-in slide-in-from-bottom-2 duration-200">
                  <MenuOption
                    icon={<Twitter className="w-4 h-4 text-sky-500" />}
                    label="Twitter"
                    onClick={() => shareTo("twitter")}
                  />
                  <MenuOption
                    icon={<Linkedin className="w-4 h-4 text-blue-500" />}
                    label="LinkedIn"
                    onClick={() => shareTo("linkedin")}
                  />
                  <MenuOption
                    icon={<MessageCircle className="w-4 h-4 text-green-500" />}
                    label="WhatsApp"
                    onClick={() => shareTo("whatsapp")}
                  />
                  <MenuOption
                    icon={<Mail className="w-4 h-4 text-slate-400" />}
                    label="Email"
                    onClick={() => shareTo("email")}
                  />
                  <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />
                  <MenuOption
                    icon={
                      copyFeedback ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <LinkIcon className="w-4 h-4" />
                      )
                    }
                    label={copyFeedback ? "Copied!" : "Copy Link"}
                    onClick={handleCopyLink}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {expandedSection === "reposts" && (
        <div className="px-4 pb-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-white/5">
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 px-1">
              Reposted by
            </h4>
            {post.reposterList && post.reposterList.length > 0 ? (
              post.reposterList.map((reposter) => (
                <div
                  key={reposter.id}
                  className="flex items-center gap-3 bg-white dark:bg-white/5 p-2 rounded-xl border border-slate-100 dark:border-white/5"
                >
                  <img
                    src={reposter.avatar}
                    alt={reposter.name}
                    className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onUserClick && onUserClick(reposter)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer hover:underline"
                        onClick={() => onUserClick && onUserClick(reposter)}
                      >
                        {reposter.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        @{reposter.username}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {reposter.role} @ {reposter.company}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
                No reposts yet.
              </p>
            )}
          </div>
        </div>
      )}

      {expandedSection === "comments" && (
        <div className="bg-slate-50 dark:bg-white/5 p-4 border-t border-slate-200 dark:border-white/10 rounded-b-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onUserClick && onUserClick(comment.user)}
                />
                <div className="bg-white dark:bg-white/10 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/10 shadow-sm flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer hover:underline"
                      onClick={() => onUserClick && onUserClick(comment.user)}
                    >
                      {comment.user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full pl-4 pr-10 py-2 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const MenuOption: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}> = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors ${danger ? "text-rose-500 hover:bg-rose-500/10" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default PostCard;
