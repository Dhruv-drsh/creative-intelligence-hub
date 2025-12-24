import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Users, MessageSquare, CheckCircle, Clock, Send, 
  UserPlus, AtSign, ThumbsUp, ThumbsDown, AlertCircle 
} from "lucide-react";
import { toast } from "sonner";

interface CollaborativeWorkflowsProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  replies?: Comment[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "editor" | "viewer" | "approver";
  avatar: string;
  status: "online" | "offline";
}

interface ApprovalRequest {
  id: string;
  requester: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewers: Array<{ name: string; status: "pending" | "approved" | "rejected" }>;
}

const mockTeam: TeamMember[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@example.com", role: "editor", avatar: "SC", status: "online" },
  { id: "2", name: "Mike Johnson", email: "mike@example.com", role: "approver", avatar: "MJ", status: "online" },
  { id: "3", name: "Emily Davis", email: "emily@example.com", role: "viewer", avatar: "ED", status: "offline" },
];

const mockComments: Comment[] = [
  { 
    id: "1", 
    author: "Sarah Chen", 
    avatar: "SC", 
    text: "Love the color scheme! Can we make the CTA button more prominent?", 
    timestamp: "2 hours ago" 
  },
  { 
    id: "2", 
    author: "Mike Johnson", 
    avatar: "MJ", 
    text: "The logo placement looks great. Approved for the next stage.", 
    timestamp: "1 hour ago" 
  },
];

const mockApproval: ApprovalRequest = {
  id: "1",
  requester: "You",
  status: "pending",
  createdAt: "Today at 2:30 PM",
  reviewers: [
    { name: "Mike Johnson", status: "approved" },
    { name: "Lisa Wong", status: "pending" },
  ]
};

export function CollaborativeWorkflows({ isOpen, onClose, projectName }: CollaborativeWorkflowsProps) {
  const [activeTab, setActiveTab] = useState<"team" | "comments" | "approvals">("team");
  const [newComment, setNewComment] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [comments, setComments] = useState(mockComments);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      avatar: "YO",
      text: newComment,
      timestamp: "Just now"
    };
    setComments([...comments, comment]);
    setNewComment("");
    toast.success("Comment added!");
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
  };

  const handleRequestApproval = () => {
    toast.success("Approval request sent to reviewers");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="w-5 h-5 text-blue-500" />
            Collaborative Workflows
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Team co-editing, commenting, and approvals for "{projectName}"
          </p>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-2">
          {[
            { id: "team", label: "Team", icon: Users },
            { id: "comments", label: "Comments", icon: MessageSquare },
            { id: "approvals", label: "Approvals", icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <ScrollArea className="max-h-[calc(85vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Team Tab */}
            {activeTab === "team" && (
              <div className="space-y-4">
                {/* Invite */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email to invite..."
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleInvite} size="icon">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Team Members */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Team Members</h4>
                  {mockTeam.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-medium">
                            {member.avatar}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                            member.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        member.role === "editor" ? "bg-blue-500/10 text-blue-600" :
                        member.role === "approver" ? "bg-green-500/10 text-green-600" :
                        "bg-gray-500/10 text-gray-600"
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div className="space-y-4">
                {/* Comment Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment... Use @ to mention"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    className="flex-1"
                  />
                  <Button onClick={handleAddComment} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-lg bg-muted/50 border space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-xs font-medium">
                            {comment.avatar}
                          </div>
                          <span className="text-sm font-medium">{comment.author}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                      <div className="flex gap-2">
                        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                          <AtSign className="w-3 h-3" /> Reply
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Like
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approvals Tab */}
            {activeTab === "approvals" && (
              <div className="space-y-4">
                {/* Request Approval */}
                <Button onClick={handleRequestApproval} className="w-full" variant="default">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Request Approval
                </Button>

                {/* Current Approval Status */}
                <div className="p-4 rounded-xl bg-muted/50 border space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Pending Approval</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{mockApproval.createdAt}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Reviewers</span>
                    {mockApproval.reviewers.map((reviewer, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background">
                        <span className="text-sm">{reviewer.name}</span>
                        <span className={`flex items-center gap-1 text-xs ${
                          reviewer.status === "approved" ? "text-green-600" :
                          reviewer.status === "rejected" ? "text-red-600" :
                          "text-yellow-600"
                        }`}>
                          {reviewer.status === "approved" && <ThumbsUp className="w-3 h-3" />}
                          {reviewer.status === "rejected" && <ThumbsDown className="w-3 h-3" />}
                          {reviewer.status === "pending" && <Clock className="w-3 h-3" />}
                          {reviewer.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Approval History */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Approval History</h4>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Version 1.0 Approved</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 4:30 PM • All reviewers approved</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Initial Draft Rejected</p>
                      <p className="text-xs text-muted-foreground">2 days ago • Changes requested on CTA placement</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
