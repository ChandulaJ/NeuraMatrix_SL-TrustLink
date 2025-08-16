export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "SLTDA Admin Backend API",
    version: "1.0.0",
    description:
      "Express + TypeScript + Prisma backend for SLTDA Admin.\n\n" +
      "Use **Authorize** with `Bearer <JWT>` (admin/auditor).",
    contact: { name: "Backend Team" }
  },
  servers: [{ url: "http://localhost:4000", description: "Local dev" }],
  tags: [
    { name: "Auth" },
    { name: "Applications" },
    { name: "Schedules" },
    { name: "Reports" },
    { name: "Integrity Flags" },
    { name: "Notifications" },
    { name: "System" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      // ==== Auth ====
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", example: "rohan" },
          password: { type: "string", example: "admin123" }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string" }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["fullName", "username", "email", "password", "role"],
        properties: {
          fullName: { type: "string" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: ["ADMIN", "AUDITOR"] }
        }
      },

      // ==== Core entities ====
      ApplicationDocument: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          url: { type: "string", format: "uri" }
        }
      },
      AuditChecklist: {
        type: "object",
        properties: {
          fireSafety: { type: "boolean" },
          hygiene: { type: "boolean" },
          emergencyExits: { type: "boolean" }
        }
      },
      AuditReport: {
        type: "object",
        properties: {
          id: { type: "integer" },
          applicationId: { type: "integer" },
          auditorId: { type: "integer" },
          date: { type: "string", format: "date-time" },
          result: { type: "string", enum: ["PASSED", "FAILED"] },
          notes: { type: "string" },
          photoEvidenceUrl: { type: "string", format: "uri" },
          checklist: { $ref: "#/components/schemas/AuditChecklist" }
        }
      },
      Application: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          serviceId: { type: "integer" },
          type: { type: "string", enum: ["IN_PERSON", "ONLINE"] },
          status: { type: "string", enum: ["PENDING", "AUDIT_PASSED", "APPROVED", "REJECTED"] },
          scheduledAt: { type: "string", format: "date-time", nullable: true },
          notes: { type: "string", nullable: true },
          region: { type: "string", nullable: true },
          locationText: { type: "string", nullable: true },
          licenseNumber: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          documents: {
            type: "array",
            items: { $ref: "#/components/schemas/ApplicationDocument" }
          },
          auditReport: { $ref: "#/components/schemas/AuditReport" }
        }
      },
      OverlapConflict: {
        type: "object",
        properties: {
          scheduleId: { type: "integer" },
          start: { type: "string", format: "date-time" },
          end: { type: "string", format: "date-time" },
          title: { type: "string" }
        }
      },
      OverlapSummary: {
        type: "object",
        properties: {
          hasConflict: { type: "boolean" },
          durationMinutes: { type: "integer" },
          conflicts: { type: "array", items: { $ref: "#/components/schemas/OverlapConflict" } }
        }
      },
      AppointmentAcceptRequest: {
        type: "object",
        required: ["scheduledFor"],
        properties: {
          scheduledFor: { type: "string", format: "date-time" },
          force: { type: "boolean" }
        }
      },
      AppointmentAcceptResponse: {
        type: "object",
        properties: {
          appointmentId: { type: "integer" },
          accepted: { type: "boolean" },
          overlapDetected: { type: "boolean" },
          overlaps: { type: "array", items: { $ref: "#/components/schemas/OverlapConflict" } }
        }
      },
      ApproveRequest: {
        type: "object",
        properties: {
          appointment: { $ref: "#/components/schemas/AppointmentAcceptRequest" }
        }
      },
      ApproveResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "APPROVED" },
          licenseNumber: { type: "string", example: "LIC-2025-00045" },
          appointment: {
            type: "object",
            properties: {
              accepted: { type: "boolean" },
              overlapDetected: { type: "boolean" }
            },
            nullable: true
          }
        }
      },
      RejectRequest: {
        type: "object",
        required: ["reason"],
        properties: { reason: { type: "string" } }
      },
      AuditReportUpsertRequest: {
        type: "object",
        required: ["date", "result", "checklist"],
        properties: {
          date: { type: "string", format: "date-time" },
          result: { type: "string", enum: ["PASSED", "FAILED"] },
          notes: { type: "string" },
          photoEvidenceUrl: { type: "string", format: "uri" },
          checklist: { $ref: "#/components/schemas/AuditChecklist" }
        }
      },
      AdminSchedule: {
        type: "object",
        properties: {
          id: { type: "integer" },
          adminId: { type: "integer" },
          start: { type: "string", format: "date-time" },
          end: { type: "string", format: "date-time" },
          title: { type: "string" }
        }
      },
      CreateScheduleRequest: {
        type: "object",
        required: ["start", "end", "title"],
        properties: {
          start: { type: "string", format: "date-time" },
          end: { type: "string", format: "date-time" },
          title: { type: "string" }
        }
      },
      IntegrityFlag: {
        type: "object",
        properties: {
          id: { type: "integer" },
          level: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["OPEN", "RESOLVED"] },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          type: { type: "string" },
          title: { type: "string" },
          body: { type: "string" },
          read: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      SummaryMetrics: {
        type: "object",
        properties: {
          applicationsAwaitingFinalReview: { type: "integer" },
          auditsScheduledToday: { type: "integer" },
          avgApprovalTime30d: { type: "number", nullable: true }
        }
      },
      ApprovalsVsRejections: {
        type: "object",
        properties: {
          approved: { type: "integer" },
          rejected: { type: "integer" },
          rangeDays: { type: "integer" }
        }
      },
      StatusBreakdown: {
        type: "object",
        properties: {
          auditPassed: { type: "integer" },
          pending: { type: "integer" },
          approved: { type: "integer" },
          rejected: { type: "integer" }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: { "200": { description: "OK" } }
      }
    },

    // ===== Auth =====
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login (admin/auditor)",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } }
        },
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
          "401": { description: "Invalid credentials" }
        },
        security: []
      }
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } }
        },
        responses: { "200": { description: "Created" } },
        security: []
      }
    },

    // ===== Applications =====
    "/applications": {
      get: {
        tags: ["Applications"],
        summary: "List applications",
        parameters: [
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 20 } }
        ],
        responses: {
          "200": {
            description: "List",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: { type: "array", items: { $ref: "#/components/schemas/Application" } },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    pageSize: { type: "integer" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/applications/{id}": {
      get: {
        tags: ["Applications"],
        summary: "Get application detail (includes overlap summary)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/Application" },
                    {
                      type: "object",
                      properties: { requestedSlotOverlap: { $ref: "#/components/schemas/OverlapSummary" } }
                    }
                  ]
                }
              }
            }
          },
          "404": { description: "Not found" }
        }
      }
    },
    "/applications/{id}/appointment/accept": {
      post: {
        tags: ["Applications"],
        summary: "Accept requested appointment (conflict check; admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AppointmentAcceptRequest" } } }
        },
        responses: {
          "200": {
            description: "Result",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AppointmentAcceptResponse" } } }
          }
        }
      }
    },
    "/applications/{id}/approve": {
      post: {
        tags: ["Applications"],
        summary: "Approve application and mint license (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: false,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApproveRequest" } } }
        },
        responses: {
          "200": { description: "Approved", content: { "application/json": { schema: { $ref: "#/components/schemas/ApproveResponse" } } } }
        }
      }
    },
    "/applications/{id}/reject": {
      post: {
        tags: ["Applications"],
        summary: "Reject application (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RejectRequest" } } }
        },
        responses: { "200": { description: "Rejected" } }
      }
    },
    "/applications/{id}/audit-report": {
      post: {
        tags: ["Applications"],
        summary: "Create/Update audit report (auditor/admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AuditReportUpsertRequest" } } }
        },
        responses: { "200": { description: "Saved", content: { "application/json": { schema: { $ref: "#/components/schemas/AuditReport" } } } } }
      }
    },

    // ===== Schedules =====
    "/admin-schedule/my": {
      get: {
        tags: ["Schedules"],
        summary: "List my busy blocks (admin)",
        parameters: [
          { name: "from", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "to", in: "query", schema: { type: "string", format: "date-time" } }
        ],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/AdminSchedule" } } } } } }
      }
    },
    "/admin-schedule": {
      post: {
        tags: ["Schedules"],
        summary: "Create busy block (admin)",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateScheduleRequest" } } }
        },
        responses: { "200": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/AdminSchedule" } } } } }
      }
    },
    "/admin-schedule/{id}": {
      delete: {
        tags: ["Schedules"],
        summary: "Delete busy block (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Deleted" } }
      }
    },

    // ===== Reports =====
    "/reports/summary": {
      get: {
        tags: ["Reports"],
        summary: "Dashboard summary",
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/SummaryMetrics" } } } } }
      }
    },
    "/reports/approvals-vs-rejections": {
      get: {
        tags: ["Reports"],
        summary: "Approvals vs Rejections (last 30d)",
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApprovalsVsRejections" } } } } }
      }
    },
    "/reports/auditor-performance": {
      get: {
        tags: ["Reports"],
        summary: "Auditor performance (pass counts)",
        responses: { "200": { description: "OK" } }
      }
    },
    "/reports/status-breakdown": {
      get: {
        tags: ["Reports"],
        summary: "Status breakdown",
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/StatusBreakdown" } } } } }
      }
    },

    // ===== Integrity Flags =====
    "/integrity-flags": {
      get: {
        tags: ["Integrity Flags"],
        summary: "List flags",
        parameters: [{ name: "level", in: "query", schema: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] } }],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/IntegrityFlag" } } } } } }
      }
    },
    "/integrity-flags/{id}/resolve": {
      post: {
        tags: ["Integrity Flags"],
        summary: "Mark flag resolved",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/IntegrityFlag" } } } } }
      }
    },

    // ===== Notifications =====
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "List my notifications",
        parameters: [{ name: "unreadOnly", in: "query", schema: { type: "string", enum: ["0", "1"] } }],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Notification" } } } } } }
      }
    },
    "/notifications/{id}/read": {
      post: {
        tags: ["Notifications"],
        summary: "Mark notification as read",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Notification" } } } } }
      }
    }
  }
} as const;
