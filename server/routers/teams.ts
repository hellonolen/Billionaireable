import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createTeam,
  getTeamsByUserId,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  createTeamInvitation,
  getTeamInvitationByToken,
  updateTeamInvitation,
  getTeamInvitations,
  getUserByOpenId,
} from "../db";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

export const teamsRouter = router({
  /**
   * Get all teams user belongs to
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const teams = await getTeamsByUserId(ctx.user.id);
    return teams;
  }),

  /**
   * Create a new team (user becomes owner)
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create team
      const team = await createTeam({
        ownerId: ctx.user.id,
        name: input.name,
      });

      if (!team) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create team",
        });
      }

      // Add creator as owner
      await addTeamMember({
        teamId: team.id,
        userId: ctx.user.id,
        role: "owner",
        invitedBy: ctx.user.id,
      });

      return team;
    }),

  /**
   * Get members of a team
   */
  getMembers: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: Check if user has permission to view team members
      const members = await getTeamMembers(input.teamId);
      return members;
    }),

  /**
   * Invite someone to join team
   */
  invite: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
        email: z.string().email(),
        role: z.enum(["admin", "member", "viewer"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Check if user has permission to invite (must be owner or admin)

      // Generate invitation token
      const token = crypto.randomBytes(32).toString("hex");

      // Set expiration to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const invitation = await createTeamInvitation({
        teamId: input.teamId,
        email: input.email,
        role: input.role,
        token,
        invitedBy: ctx.user.id,
        expiresAt,
      });

      if (!invitation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create invitation",
        });
      }

      // TODO: Send invitation email

      return invitation;
    }),

  /**
   * Accept team invitation
   */
  acceptInvitation: protectedProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await getTeamInvitationByToken(input.token);

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      if (invitation.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invitation already used or expired",
        });
      }

      if (new Date() > invitation.expiresAt) {
        await updateTeamInvitation(invitation.id, { status: "expired" });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invitation has expired",
        });
      }

      // Check if email matches
      if (ctx.user.email !== invitation.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invitation is for a different email address",
        });
      }

      // Add user to team
      await addTeamMember({
        teamId: invitation.teamId,
        userId: ctx.user.id,
        role: invitation.role,
        invitedBy: invitation.invitedBy,
      });

      // Mark invitation as accepted
      await updateTeamInvitation(invitation.id, { status: "accepted" });

      return { success: true };
    }),

  /**
   * Remove member from team
   */
  removeMember: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
        userId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Check if user has permission to remove members (must be owner or admin)

      const success = await removeTeamMember(input.teamId, input.userId);

      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove member",
        });
      }

      return { success: true };
    }),

  /**
   * Get pending invitations for a team
   */
  getInvitations: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: Check if user has permission to view invitations
      const invitations = await getTeamInvitations(input.teamId);
      return invitations;
    }),
});
