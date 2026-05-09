"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { PaymentService } from "@/services/modules/payment/payment.service";
import { RegistrationService } from "@/services/modules/registration/registration.service";
import { WorkshopService } from "@/services/modules/workshop/workshop.service";
import type { StoredWorkshopFlow } from "@/lib/my-workshops-store";
import type { PaymentDTO, RegistrationDTO, ReservationResponse, WorkshopResponse } from "@/types";
import { useMyWorkshops } from "./my-workshops-provider";

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

function isActiveReservation(reservation: ReservationResponse | null | undefined) {
  if (!reservation?.expiresAt) return false;

  const expiresAt = new Date(reservation.expiresAt).getTime();
  if (Number.isNaN(expiresAt)) return false;

  return expiresAt > Date.now();
}

export function WorkshopDetailClient({
  workshopId,
}: WorkshopDetailClientProps) {
  const router = useRouter();
  const { accessToken, user, isReady } = useAuth();
  const { getWorkshopFlowByWorkshopId, upsertWorkshopFlow } = useMyWorkshops();
  const canRegisterOrPay = user?.role === "student";
  const [workshop, setWorkshop] = useState<WorkshopResponse | null>(null);
  const [registration, setRegistration] = useState<RegistrationDTO | null>(null);
  const [reservation, setReservation] = useState<ReservationResponse | null>(
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
        const cachedFlow = getWorkshopFlowByWorkshopId(workshopId);

        const [workshopResponse, registrationsResponse, paymentsResponse] =
          await Promise.all([
            WorkshopService.getById(String(workshopId), {
              token: accessToken || undefined,
            }),
            RegistrationService.listMine({ token: accessToken || undefined }),
            PaymentService.listMine({ token: accessToken || undefined }),
          ]);

        if (workshopResponse.error || !workshopResponse.data) {
          throw new Error(workshopResponse.error?.message || "Workshop not found.");
        }

        if (registrationsResponse.error) {
          throw new Error(registrationsResponse.error.message);
        }

        if (paymentsResponse.error) {
          throw new Error(paymentsResponse.error.message);
        }

        const registrations = registrationsResponse.data?.items ?? [];
        const payments = paymentsResponse.data?.items ?? [];
        const currentRegistration =
          registrations.find((item) => Number(item.workshop_id) === workshopId) ??
          cachedFlow?.registration ??
          null;
        const currentPayment = currentRegistration
          ? payments.find((item) => item.registration_id === currentRegistration.id) ?? null
          : cachedFlow?.payment ?? null;
        const currentReservation =
          currentRegistration || currentPayment || !isActiveReservation(cachedFlow?.reservation)
            ? null
            : cachedFlow?.reservation ?? null;

        setWorkshop(workshopResponse.data);
        setRegistration(currentRegistration);
        setPayment(currentPayment);
        setReservation(currentReservation);
        setQrCode(
          currentPayment?.registration?.qr_code_hash ??
            currentRegistration?.qr_code_hash ??
            cachedFlow?.qrCode ??
            null,
        );

        const nextFlow: StoredWorkshopFlow = {
          workshop: workshopResponse.data,
          reservation: currentReservation,
          registration: currentRegistration,
          payment: currentPayment,
          qrCode:
            currentPayment?.registration?.qr_code_hash ??
            currentRegistration?.qr_code_hash ??
            cachedFlow?.qrCode ??
            null,
        };
        upsertWorkshopFlow(nextFlow);
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

  const amount = useMemo(() => {
    if (!workshop?.fee) {
      return 0;
    }

    return Number(workshop.fee);
  }, [workshop]);

  const workshopStatus = useMemo(() => {
    if (payment || registration?.status === "Paid") {
      return "paid";
    }

    if (registration || reservation) {
      return "registered";
    }

    return "not_registered";
  }, [payment, registration, reservation]);

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

      setReservation(response.data);
      setRegistration(null);
      setPayment(null);
      setQrCode(null);
      upsertWorkshopFlow({
        workshop,
        reservation: response.data,
        registration: null,
        payment: null,
        qrCode: null,
      });
      toast.success(
        `Đã giữ chỗ. Vui lòng thanh toán trước ${new Date(
          response.data.expiresAt,
        ).toLocaleTimeString()}.`,
      );
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
    if (!workshop || (!registration && !reservation)) {
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
          reservationId: reservation?.reservationId,
          registrationId: registration?.id,
          amount,
          idempotencyKey: createIdempotencyKey("payment"),
        },
        { token: accessToken },
      );

      if (response.error || !response.data) {
        throw new Error(response.error?.message || "Payment failed.");
      }

      const paymentData = response.data;
      const backendQrCode = paymentData.registration?.qr_code_hash ?? null;

      setPayment(paymentData);
      setReservation(null);
      // Reload registrations to get the newly created registration row.
      const registrationsResponse = await RegistrationService.listMine({
        token: accessToken || undefined,
      });
      let nextRegistration: RegistrationDTO | null = null;
      if (!registrationsResponse.error) {
        const registrations = registrationsResponse.data?.items ?? [];
        const currentRegistration =
          registrations.find((item) => Number(item.workshop_id) === workshopId) ?? null;
        nextRegistration = currentRegistration;
        setRegistration(currentRegistration);
      }
      setQrCode(backendQrCode);
      upsertWorkshopFlow({
        workshop,
        reservation: null,
        registration: nextRegistration ?? registration,
        payment: paymentData,
        qrCode: backendQrCode,
      });

      toast.success("Payment completed.");
    } catch (paymentError) {
      toast.error(
        paymentError instanceof Error ? paymentError.message : "Payment failed.",
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

                {!registration && !reservation ? (
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
                ) : reservation ? (
                  <div className="rounded-md border border-border p-4">
                    <p className="font-medium">Slot reserved</p>
                    <p className="text-sm text-muted-foreground">
                      Expires at{" "}
                      {new Date(reservation.expiresAt).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border border-border p-4">
                    <p className="font-medium">Registration created</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {workshopStatus === "registered" && (registration || reservation) && !payment ? (
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
            ) : null}

            {workshopStatus === "paid" && payment ? (
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
            ) : null}

            {workshopStatus === "paid" && qrCode ? (
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
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
