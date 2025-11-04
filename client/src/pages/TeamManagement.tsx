import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, UserPlus, Mail, Trash2, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { DashboardHeader } from "@/components/DashboardHeader";
import { toast } from "sonner";

export default function TeamManagement() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">("member");

  const { data: teams, refetch: refetchTeams } = trpc.teams.list.useQuery();
  const currentTeam = teams?.[0]; // For now, use first team

  const { data: members, refetch: refetchMembers } = trpc.teams.getMembers.useQuery(
    { teamId: currentTeam?.id || 0 },
    { enabled: !!currentTeam }
  );

  const { data: invitations, refetch: refetchInvitations } = trpc.teams.getInvitations.useQuery(
    { teamId: currentTeam?.id || 0 },
    { enabled: !!currentTeam }
  );

  const createTeamMutation = trpc.teams.create.useMutation({
    onSuccess: () => {
      toast.success("Team created");
      refetchTeams();
    },
  });

  const inviteMutation = trpc.teams.invite.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent");
      setShowInviteModal(false);
      setInviteEmail("");
      refetchInvitations();
    },
  });

  const removeMemberMutation = trpc.teams.removeMember.useMutation({
    onSuccess: () => {
      toast.success("Member removed");
      refetchMembers();
    },
  });

  const handleInvite = () => {
    if (!currentTeam) return;
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    inviteMutation.mutate({
      teamId: currentTeam.id,
      email: inviteEmail,
      role: inviteRole,
    });
  };

  const handleRemoveMember = (userId: number) => {
    if (!currentTeam) return;
    if (!confirm("Are you sure you want to remove this member?")) return;
    removeMemberMutation.mutate({
      teamId: currentTeam.id,
      userId,
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return { bg: "#8b5cf620", color: "#8b5cf6" };
      case "admin":
        return { bg: `${COLORS.primary}20`, color: COLORS.primary };
      case "member":
        return { bg: `${COLORS.accent}20`, color: COLORS.accent };
      case "viewer":
        return { bg: "#6b728020", color: "#6b7280" };
      default:
        return { bg: "#6b728020", color: "#6b7280" };
    }
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Page Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
              Team Management
            </h1>
            <p className="text-sm" style={{ color: COLORS.subt }}>
              Invite and manage team members with role-based access
            </p>
          </div>
          {currentTeam && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="relative text-sm font-medium group flex items-center gap-2"
              style={{ color: COLORS.primary }}
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
            </button>
          )}
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" style={{ borderColor: COLORS.border }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>Invite Team Member</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="assistant@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Role</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                  >
                    <option value="viewer">Viewer - Read-only access</option>
                    <option value="member">Member - Can view and edit</option>
                    <option value="admin">Admin - Full access</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="relative text-sm font-medium group flex-1 text-center"
                  style={{ color: COLORS.text }}
                >
                  Cancel
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                </button>
                <button
                  onClick={handleInvite}
                  disabled={inviteMutation.isPending}
                  className="relative text-sm font-medium group flex-1 text-center"
                  style={{ color: COLORS.primary }}
                >
                  {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {!currentTeam ? (
          <div className="bg-white border rounded-xl p-12 text-center" style={{ borderColor: COLORS.border }}>
            <Shield className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.subt }} />
            <h3 className="font-semibold mb-2" style={{ color: COLORS.text }}>No Team Yet</h3>
            <p className="text-sm mb-4" style={{ color: COLORS.subt }}>
              Create a team to invite assistants and collaborators
            </p>
            <button
              onClick={() => createTeamMutation.mutate({ name: "My Team" })}
              disabled={createTeamMutation.isPending}
              className="relative text-sm font-medium group inline-flex items-center gap-2"
              style={{ color: COLORS.primary }}
            >
              <Plus className="h-4 w-4" />
              Create Team
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
            </button>
          </div>
        ) : (
          <>
            {/* Team Members Table */}
            <div className="bg-white border rounded-xl overflow-hidden mb-6" style={{ borderColor: COLORS.border }}>
              <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
                <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>Team Members</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: COLORS.border, background: '#f9fafb' }}>
                      <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: COLORS.subt }}>Name</th>
                      <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: COLORS.subt }}>Email</th>
                      <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: COLORS.subt }}>Role</th>
                      <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: COLORS.subt }}>Status</th>
                      <th className="text-right px-6 py-3 text-xs font-medium" style={{ color: COLORS.subt }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members && members.length > 0 ? (
                      members.map((member, idx) => {
                        const roleColors = getRoleBadgeColor(member.role);
                        return (
                          <tr
                            key={member.id}
                            className="border-b hover:bg-gray-50 transition-colors"
                            style={{ borderColor: COLORS.border }}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: `${COLORS.primary}20`, color: COLORS.primary }}>
                                  {member.user.name?.charAt(0) || member.user.email?.charAt(0) || "?"}
                                </div>
                                <span className="font-medium text-sm" style={{ color: COLORS.text }}>
                                  {member.user.name || "Unnamed"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm" style={{ color: COLORS.text }}>
                              {member.user.email}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                                style={{ background: roleColors.bg, color: roleColors.color }}
                              >
                                {member.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {member.role !== "owner" && (
                                <button
                                  onClick={() => handleRemoveMember(member.userId)}
                                  className="relative text-sm font-medium group"
                                  style={{ color: '#ef4444' }}
                                >
                                  Remove
                                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center" style={{ color: COLORS.subt }}>
                          No team members yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Invitations Table */}
            {invitations && invitations.filter((inv) => inv.status === "pending").length > 0 && (
              <div className="bg-white border rounded-xl overflow-hidden mb-6" style={{ borderColor: COLORS.border }}>
                <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
                  <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>Pending Invitations</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: COLORS.border, background: '#f9fafb' }}>
                        <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: COLORS.subt }}>Email</th>
                        <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: COLORS.subt }}>Role</th>
                        <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: COLORS.subt }}>Expires</th>
                        <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: COLORS.subt }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations
                        .filter((inv) => inv.status === "pending")
                        .map((invitation) => {
                          const roleColors = getRoleBadgeColor(invitation.role);
                          return (
                            <tr
                              key={invitation.id}
                              className="border-b hover:bg-gray-50 transition-colors"
                              style={{ borderColor: COLORS.border }}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" style={{ color: COLORS.subt }} />
                                  <span className="text-sm" style={{ color: COLORS.text }}>
                                    {invitation.email}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                                  style={{ background: roleColors.bg, color: roleColors.color }}
                                >
                                  {invitation.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm" style={{ color: COLORS.text }}>
                                {new Date(invitation.expiresAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                  Pending
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Role Descriptions */}
        <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
              <div className="font-medium mb-2" style={{ color: COLORS.text }}>Viewer</div>
              <p className="text-sm" style={{ color: COLORS.subt }}>
                Can view all dashboard data but cannot make changes
              </p>
            </div>
            <div className="p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
              <div className="font-medium mb-2" style={{ color: COLORS.text }}>Member</div>
              <p className="text-sm" style={{ color: COLORS.subt }}>
                Can view and edit dashboard data, add metrics, and update goals
              </p>
            </div>
            <div className="p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
              <div className="font-medium mb-2" style={{ color: COLORS.text }}>Admin</div>
              <p className="text-sm" style={{ color: COLORS.subt }}>
                Full access including team management and billing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
