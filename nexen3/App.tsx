import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";
import PostCard from "./components/PostCard";
import CreatePost from "./components/CreatePost";
import MessagingView from "./components/MessagingView";
import PitchCard from "./components/PitchCard";
import CreatePitch from "./components/CreatePitch";
import NetworkRequestsModal from "./components/NetworkRequestsModal";
import PremiumModal from "./components/PremiumModal";
import SettingsModal from "./components/SettingsModal";
import CommunityView from "./components/CommunityView";
import DiscoverCommunitiesView from "./components/DiscoverCommunitiesView";
import LoginView from "./components/LoginView";
import SetupProfileView from "./components/SetupProfileView";
import AiAssistantView from "./components/AiAssistantView";
import ProfileView from "./components/ProfileView";
import { INITIAL_POSTS, CURRENT_USER, INITIAL_PITCHES } from "./constants";
import { Post, User, Community, Pitch } from "./types";
import { Rocket, Sparkles, TrendingUp, ChevronLeft } from "lucide-react";

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  useEffect(() => {
    console.log("🧠 App mounted");
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "home"
    | "chats"
    | "community"
    | "discover"
    | "saved"
    | "ai-assistant"
    | "profile"
    | "launchpad"
  >("home");
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(
    null,
  );
  const [activeProfileUser, setActiveProfileUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [posts, setPosts] = useState<Post[]>(() => shuffle(INITIAL_POSTS));
  const [pitches, setPitches] = useState<Pitch[]>(INITIAL_PITCHES);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Modal States
  const [pitchSort, setPitchSort] = useState<"top" | "newest" | "random">(
    "top",
  );
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Disable browser scroll restoration
  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Force scroll to top instantly when view-changing states update
  React.useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    resetScroll();
    // Secondary backup for dynamic content loading
    const timer = setTimeout(resetScroll, 0);
    const timerLong = setTimeout(resetScroll, 100); // Extra safety for slower renders

    return () => {
      clearTimeout(timer);
      clearTimeout(timerLong);
    };
  }, [
    activeTab,
    activeProfileUser,
    activeCommunity,
    isAuthenticated,
    isSetupComplete,
  ]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    u2: true,
    u4: true,
  });

  const handleToggleFollow = (userId: string) => {
    setFollowingMap((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleToggleSave = (postId: string) => {
    setSavedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId],
    );
  };

  const handlePost = (content: string) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content,
      likes: 0,
      comments: 0,
      commentList: [],
      reposts: 0,
      reposterList: [],
      timestamp: "Just now",
      tags: content.match(/#\w+/g)?.map((t) => t.slice(1)) || [],
    };
    setPosts([newPost, ...posts]);
  };

  const handleRemovePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleNewPitch = (
    title: string,
    description: string,
    category: string,
  ) => {
    const newPitch: Pitch = {
      id: `pitch${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      title,
      description,
      votes: 0,
      comments: 0,
      commentList: [],
      category,
      timestamp: "Just now",
      votedBy: [],
      supportersCount: 0,
      isTrending: false,
    };
    setPitches([newPitch, ...pitches]);
  };

  const handleVote = (id: string) => {
    setPitches((prevPitches) => {
      return prevPitches.map((pitch) => {
        if (pitch.id === id) {
          const hasVoted = pitch.votedBy.includes(currentUser.id);
          if (hasVoted) {
            return {
              ...pitch,
              votes: pitch.votes - 1,
              votedBy: pitch.votedBy.filter((uid) => uid !== currentUser.id),
            };
          } else {
            return {
              ...pitch,
              votes: pitch.votes + 1,
              votedBy: [...pitch.votedBy, currentUser.id],
            };
          }
        }
        return pitch;
      });
    });
  };

  const handlePitchComment = (pitchId: string, text: string) => {
    setPitches((prevPitches) => {
      return prevPitches.map((pitch) => {
        if (pitch.id === pitchId) {
          const newComment = {
            id: `pc-${Date.now()}`,
            userId: currentUser.id,
            user: currentUser,
            text,
            timestamp: "Just now",
          };
          return {
            ...pitch,
            comments: pitch.comments + 1,
            commentList: [newComment, ...pitch.commentList],
          };
        }
        return pitch;
      });
    });
  };

  const handleCommunitySelect = (community: Community) => {
    setActiveCommunity(community);
    setActiveTab("community");
  };

  const handleLogin = (email: string) => {
    // Basic initialization, profile setup comes next
    setCurrentUser({
      ...currentUser,
      id: `u_${Date.now()}`,
      username: "",
      bio: "",
      role: "",
      company: "",
    });
    setIsAuthenticated(true);
    window.scrollTo(0, 0);
  };

  const handleOnboardingComplete = (userData: Partial<User>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...userData,
      avatar:
        userData.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || "user"}`,
    }));
    setIsSetupComplete(true);
    setActiveTab("home");
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsSetupComplete(false);
    setActiveCommunity(null);
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (!isSetupComplete) {
    return (
      <SetupProfileView
        onComplete={handleOnboardingComplete}
        user={currentUser}
      />
    );
  }

  const handleUserClick = (user: User) => {
    setActiveProfileUser(user);
    setActiveTab("profile");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="md:col-span-12 lg:col-span-6 space-y-4">
            <CreatePost onPost={handlePost} currentUser={currentUser} />
            <div className="space-y-4 pb-20 md:pb-0">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onRemove={handleRemovePost}
                  isSaved={savedPostIds.includes(post.id)}
                  onToggleSave={() => handleToggleSave(post.id)}
                  onUserClick={handleUserClick}
                />
              ))}
            </div>
          </div>
        );
      case "community":
        return activeCommunity ? (
          <CommunityView
            community={activeCommunity}
            posts={posts.filter(
              (p) =>
                p.tags.some((t) =>
                  activeCommunity.name.toLowerCase().includes(t.toLowerCase()),
                ) || Math.random() > 0.5,
            )}
            currentUser={currentUser}
            onBack={() => setActiveTab("home")}
            savedPostIds={savedPostIds}
            onToggleSave={handleToggleSave}
            onUserClick={handleUserClick}
          />
        ) : null;
      case "discover":
        return (
          <DiscoverCommunitiesView
            onBack={() => setActiveTab("home")}
            onSelectCommunity={handleCommunitySelect}
          />
        );
      case "chats":
        return <MessagingView onBack={() => setActiveTab("home")} />;
      case "saved":
        return (
          <div className="md:col-span-12 lg:col-span-6 space-y-4">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              Saved Posts
            </h1>
            <div className="space-y-4 pb-20 md:pb-0">
              {posts.filter((p) => savedPostIds.includes(p.id)).length > 0 ? (
                posts
                  .filter((p) => savedPostIds.includes(p.id))
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onRemove={handleRemovePost}
                      isSaved={true}
                      onToggleSave={() => handleToggleSave(post.id)}
                      onUserClick={handleUserClick}
                    />
                  ))
              ) : (
                <div className="bg-white dark:bg-white/5 p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                  <p className="text-sm text-slate-400 font-bold italic">
                    No saved posts yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "ai-assistant":
        return (
          <AiAssistantView
            savedPosts={posts.filter((p) => savedPostIds.includes(p.id))}
            onBack={() => setActiveTab("home")}
          />
        );
      case "launchpad":
        const sortedPitches = [...pitches].sort((a, b) => {
          if (pitchSort === "top") return b.votes - a.votes;
          if (pitchSort === "newest") return b.id.localeCompare(a.id); // Assuming ID is sortable for newest
          return Math.random() - 0.5;
        });

        return (
          <div className="md:col-span-12 lg:col-span-6 space-y-6">
            <div className="flex items-start justify-between px-1">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  The Launchpad
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Discover and support the next big ideas
                </p>
              </div>
              <button
                onClick={() => setIsPitchModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
              >
                <Sparkles className="w-4 h-4" /> Submit Idea
              </button>
            </div>

            <div className="flex gap-4 px-1">
              <button
                onClick={() => setPitchSort("top")}
                className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                  pitchSort === "top"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Top Voted
              </button>
              <button
                onClick={() => setPitchSort("newest")}
                className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                  pitchSort === "newest"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setPitchSort("random")}
                className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                  pitchSort === "random"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Random
              </button>
            </div>

            <div className="space-y-6 pb-20 md:pb-0">
              {sortedPitches.map((pitch) => (
                <PitchCard
                  key={pitch.id}
                  pitch={pitch}
                  onVote={handleVote}
                  onAddComment={handlePitchComment}
                  currentUser={currentUser}
                  onUserClick={handleUserClick}
                />
              ))}
            </div>
          </div>
        );
      case "profile":
        return activeProfileUser ? (
          <ProfileView
            user={activeProfileUser}
            posts={posts}
            currentUser={currentUser}
            onBack={() => setActiveTab("home")}
            onRemovePost={handleRemovePost}
            savedPostIds={savedPostIds}
            onToggleSave={handleToggleSave}
            onUserClick={handleUserClick}
            isFollowing={followingMap[activeProfileUser.id]}
            onToggleFollow={handleToggleFollow}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Layout
      currentUser={currentUser}
      activeTab={
        activeTab === "community" ||
        activeTab === "discover" ||
        activeTab === "profile"
          ? "home"
          : activeTab
      }
      onTabChange={(tab) => {
        if (tab === ("profile" as any)) {
          setActiveProfileUser(currentUser);
        }
        setActiveTab(tab);
        if (tab === "home") setActiveCommunity(null);
      }}
      onLogout={handleLogout}
      posts={posts}
      theme={theme}
      toggleTheme={toggleTheme}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onOpenPremium={() => setIsPremiumOpen(true)}
      onUserClick={handleUserClick}
    >
      {activeTab !== "chats" && activeTab !== "ai-assistant" && (
        <Sidebar
          activeTab={activeTab as any}
          onTabChange={setActiveTab as any}
          currentUser={currentUser}
          onOpenNetwork={() => setIsNetworkOpen(true)}
          onOpenPremium={() => setIsPremiumOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onSelectCommunity={handleCommunitySelect}
          onDiscoverMore={() => setActiveTab("discover")}
          onLogout={handleLogout}
        />
      )}

      {renderContent()}

      {(activeTab === "home" ||
        activeTab === "discover" ||
        activeTab === "chats" ||
        activeTab === "saved" ||
        activeTab === "profile") && (
        <RightPanel
          followingMap={followingMap}
          onToggleFollow={handleToggleFollow}
        />
      )}

      {/* Modals */}
      <CreatePitch
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        onPitch={handleNewPitch}
      />
      <NetworkRequestsModal
        isOpen={isNetworkOpen}
        onClose={() => setIsNetworkOpen(false)}
        onAccept={() => {}}
      />
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={currentUser}
        onSave={setCurrentUser}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </Layout>
  );
};

export default App;
