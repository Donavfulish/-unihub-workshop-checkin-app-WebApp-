"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { Navbar } from "@/components/navbar";
import { useMyWorkshops } from "@/components/my-workshops-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { PaymentService } from "@/services/modules/payment/payment.service";
import { RegistrationService } from "@/services/modules/registration/registration.service";
import { WorkshopService } from "@/services/modules/workshop/workshop.service";
import type { PaymentDTO, RegistrationDTO, WorkshopResponse } from "@/types";

interface WorkshopDetailClientProps {
  workshopId: number;
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString();
}

function createIdempotencyKey(prefix: string) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

export function WorkshopDetailClient({
  workshopId,
}: WorkshopDetailClientProps) {
  const router = useRouter();
  const { accessToken, user, isReady } = useAuth();
  const { getWorkshopFlowByWorkshopId, upsertWorkshopFlow } = useMyWorkshops();
  const canRegisterOrPay = user?.role === "student";
  const [workshop, setWorkshop] = useState<WorkshopResponse | null>(null);
  const [registration, setRegistration] = useState<RegistrationDTO | null>(
    null,
  );
  const [payment, setPayment] = useState<PaymentDTO | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!accessToken) {
      setIsLoading(false);
      router.replace(`/login?next=/workshops/${workshopId}`);
      return;
    }

    async function loadWorkshop() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await WorkshopService.getById(String(workshopId), {
          token: accessToken,
        });

        if (response.error || !response.data) {
          throw new Error(response.error?.message || "Workshop not found.");
        }

        setWorkshop(response.data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load workshop details.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadWorkshop();
  }, [workshopId, accessToken, isReady, router]);

  useEffect(() => {
    const storedFlow = getWorkshopFlowByWorkshopId(workshopId);
    if (!storedFlow) {
      return;
    }

    setRegistration(storedFlow.registration);
    setPayment(storedFlow.payment ?? null);
    setQrCode(storedFlow.qrCode ?? null);
  }, [getWorkshopFlowByWorkshopId, workshopId]);

  const amount = useMemo(() => {
    if (!workshop?.fee) {
      return 0;
    }

    return Number(workshop.fee);
  }, [workshop]);

  async function handleRegister() {
    if (!workshop) {
      return;
    }

    if (!accessToken || !canRegisterOrPay) {
      toast.error("Chỉ tài khoản sinh viên mới có thể đăng ký workshop.");
      return;
    }

    try {
      setIsRegistering(true);
      const response = await RegistrationService.create(
        {
          workshopId: workshop.id,
          idempotencyKey: createIdempotencyKey("registration"),
        },
        { token: accessToken },
      );

      if (response.error || !response.data) {
        throw new Error(response.error?.message || "Registration failed.");
      }

      setRegistration(response.data);
      upsertWorkshopFlow({
        workshop,
        registration: response.data,
        qrCode: response.data.qr_code_hash ?? null,
      });
      toast.success("Registration created. Continue to payment.");
    } catch (registerError) {
      toast.error(
        registerError instanceof Error
          ? registerError.message
          : "Failed to register.",
      );
    } finally {
      setIsRegistering(false);
    }
  }

  async function handlePay() {
    if (!workshop || !registration) {
      return;
    }

    if (!accessToken || !canRegisterOrPay) {
      toast.error("Chỉ tài khoản sinh viên mới có thể thanh toán.");
      return;
    }

    try {
      setIsPaying(true);
      const response = await PaymentService.create(
        {
          registrationId: registration.id,
          amount,
          idempotencyKey: createIdempotencyKey("payment"),
        },
        { token: accessToken },
      );

      if (response.error || !response.data) {
        throw new Error(response.error?.message || "Payment failed.");
      }

      const backendQrCode =
        response.data.registration?.qr_code_hash ??
        registration.qr_code_hash ??
        null;

      setPayment(response.data);
      setQrCode(backendQrCode);
      upsertWorkshopFlow({
        workshop,
        registration,
        payment: response.data,
        qrCode: backendQrCode,
      });

      toast.success("Payment completed.");
    } catch (paymentError) {
      toast.error(
        paymentError instanceof Error
          ? paymentError.message
          : "Payment failed.",
      );
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          Back
        </Button>

        {isLoading ? (
          <Card>
            <CardContent className="pt-6 text-muted-foreground">
              Loading workshop detail...
            </CardContent>
          </Card>
        ) : error || !workshop ? (
          <Card>
            <CardContent className="pt-6 text-destructive">
              {error || "Workshop not found."}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <p className="text-sm text-muted-foreground">
                  Workshop #{workshop.id}
                </p>
                <CardTitle className="text-3xl">{workshop.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {workshop.description || "No description available."}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Fee</p>
                    <p className="font-medium">{workshop.fee ?? "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Slots</p>
                    <p className="font-medium">
                      {workshop.total_slots ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Remaining Slots
                    </p>
                    <p className="font-medium">
                      {workshop.remaining_slots ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Time</p>
                    <p className="font-medium">
                      {formatDateTime(workshop.start_time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Time</p>
                    <p className="font-medium">
                      {formatDateTime(workshop.end_time)}
                    </p>
                  </div>
                </div>

                {!registration ? (
                  <div className="space-y-2">
                    <Button
                      onClick={handleRegister}
                      disabled={isRegistering || !canRegisterOrPay}
                    >
                      {isRegistering ? "Registering..." : "Register Now"}
                    </Button>
                    {!canRegisterOrPay ? (
                      <p className="text-sm text-muted-foreground">
                        Đăng ký workshop chỉ khả dụng với tài khoản vai trò <strong>student</strong>.
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-md border border-border p-4">
                    <p className="font-medium">Registration created</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {registration && !payment && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This is a temporary payment screen for the workshop flow.
                  </p>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fee</p>
                    <Input value={String(amount)} readOnly />
                  </div>
                  <Button onClick={handlePay} disabled={isPaying}>
                    {isPaying ? "Processing..." : "Thanh toan"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {payment && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <span className="text-muted-foreground">Payment ID:</span>{" "}
                    {payment.id}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Transaction:</span>{" "}
                    {payment.transaction_no ?? "N/A"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    {payment.status ?? "N/A"}
                  </p>
                </CardContent>
              </Card>
            )}

            {payment && qrCode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Check-in QR</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <QRCodeCanvas
                      value={qrCode}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </div>
                  {/* <div className="w-full rounded-md bg-muted p-4 font-mono text-xs break-all text-center">
                    {qrCode}
                  </div> */}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
