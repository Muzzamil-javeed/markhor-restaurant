import { z } from "zod";
import { isEnabledPaymentMethod } from "@/lib/payment";
import { isValidPkPhone, normalisePkPhone } from "@/lib/pk-phone";
import { fromDatetimeLocalValue, isValidScheduledTime } from "@/lib/schedule";

export const orderTypes = ["delivery", "pickup", "dinein"] as const;
export const timingModes = ["asap", "scheduled"] as const;

export const checkoutCartLineSchema = z.object({
  key: z.string().min(1),
  itemId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
  variantId: z.string().nullable().optional(),
  choiceIds: z.array(z.string()).optional(),
  addOnIds: z.array(z.string()).optional(),
  note: z.string().max(200).optional(),
  name: z.string().optional(),
  summary: z.string().optional(),
  unitPrice: z.number().int().optional(),
});

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone is required.")
  .refine(isValidPkPhone, {
    message: "Use 03XXXXXXXXX or +923XXXXXXXXX.",
  })
  .transform((value) => normalisePkPhone(value)!);

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "")
  .refine((value) => value === "" || z.email().safeParse(value).success, {
    message: "Enter a valid email.",
  });

const optionalPartySize = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "number" && Number.isNaN(value)) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : value;
  }
  return value;
}, z.number().int().min(1).max(30).optional());

function refineMapPinUrl(
  value: string | undefined,
  ctx: z.RefinementCtx,
) {
  if (!value?.trim()) return;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("bad protocol");
    }
  } catch {
    ctx.addIssue({
      code: "custom",
      path: ["mapPinUrl"],
      message: "Map pin must be a valid http(s) link.",
    });
  }
}

export const checkoutFormSchema = z
  .object({
    orderType: z.enum(orderTypes),
    timing: z.enum(timingModes),
    scheduledFor: z.string().optional(),

    customerName: z
      .string()
      .trim()
      .min(2, "Name is required.")
      .max(80, "Keep the name under 80 characters."),
    customerPhone: phoneSchema,
    customerEmail: optionalEmail,

    address: z.string().trim().max(240).optional(),
    areaLandmark: z.string().trim().max(120).optional(),
    mapPinUrl: z.string().trim().max(500).optional(),
    deliveryInstructions: z.string().trim().max(240).optional(),

    tableNumber: z.string().trim().max(20).optional(),
    partySize: optionalPartySize,

    note: z.string().trim().max(300).optional(),

    paymentMethod: z.string(),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "Please accept the terms to place your order.",
    }),

    voucherCode: z.string().trim().max(40).optional().nullable(),

    /** Honeypot — must stay empty. */
    company: z.string().optional(),

    lines: z.array(checkoutCartLineSchema).min(1, "Your cart is empty."),
  })
  .superRefine((data, ctx) => {
    if (data.company && data.company.trim().length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["company"],
        message: "Unable to place order.",
      });
    }

    if (data.timing === "scheduled") {
      if (!data.scheduledFor?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["scheduledFor"],
          message: "Choose a scheduled time.",
        });
      } else {
        const when = fromDatetimeLocalValue(data.scheduledFor);
        if (!when) {
          ctx.addIssue({
            code: "custom",
            path: ["scheduledFor"],
            message: "Scheduled time is invalid.",
          });
        } else {
          const check = isValidScheduledTime(when);
          if (!check.ok) {
            ctx.addIssue({
              code: "custom",
              path: ["scheduledFor"],
              message: check.reason,
            });
          }
        }
      }
    }

    refineMapPinUrl(data.mapPinUrl, ctx);

    if (data.orderType === "delivery") {
      if (!data.address?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["address"],
          message: "Delivery address is required.",
        });
      }
      if (!data.areaLandmark?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["areaLandmark"],
          message: "Area or landmark helps our rider find you.",
        });
      }
    }

    if (!isEnabledPaymentMethod(data.paymentMethod)) {
      ctx.addIssue({
        code: "custom",
        path: ["paymentMethod"],
        message: "Choose a payment method.",
      });
    }
  });

export type CheckoutFormInput = z.input<typeof checkoutFormSchema>;
export type CheckoutFormValues = z.output<typeof checkoutFormSchema>;

export const checkoutStep1Schema = z
  .object({
    orderType: z.enum(orderTypes),
    timing: z.enum(timingModes),
    scheduledFor: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.timing !== "scheduled") return;
    if (!data.scheduledFor?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduledFor"],
        message: "Choose a scheduled time.",
      });
      return;
    }
    const when = fromDatetimeLocalValue(data.scheduledFor);
    if (!when) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduledFor"],
        message: "Scheduled time is invalid.",
      });
      return;
    }
    const check = isValidScheduledTime(when);
    if (!check.ok) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduledFor"],
        message: check.reason,
      });
    }
  });

export const checkoutStep2Schema = z
  .object({
    orderType: z.enum(orderTypes),
    customerName: z.string().trim().min(2, "Name is required.").max(80),
    customerPhone: phoneSchema,
    customerEmail: optionalEmail,
    address: z.string().trim().max(240).optional(),
    areaLandmark: z.string().trim().max(120).optional(),
    mapPinUrl: z.string().trim().max(500).optional(),
    deliveryInstructions: z.string().trim().max(240).optional(),
    tableNumber: z.string().trim().max(20).optional(),
    partySize: optionalPartySize,
    note: z.string().trim().max(300).optional(),
  })
  .superRefine((data, ctx) => {
    refineMapPinUrl(data.mapPinUrl, ctx);
    if (data.orderType !== "delivery") return;
    if (!data.address?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message: "Delivery address is required.",
      });
    }
    if (!data.areaLandmark?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["areaLandmark"],
        message: "Area or landmark helps our rider find you.",
      });
    }
  });

export const STEP1_FIELDS = [
  "orderType",
  "timing",
  "scheduledFor",
] as const satisfies readonly (keyof CheckoutFormInput)[];

export const STEP2_FIELDS = [
  "orderType",
  "customerName",
  "customerPhone",
  "customerEmail",
  "address",
  "areaLandmark",
  "mapPinUrl",
  "deliveryInstructions",
  "tableNumber",
  "partySize",
  "note",
] as const satisfies readonly (keyof CheckoutFormInput)[];
