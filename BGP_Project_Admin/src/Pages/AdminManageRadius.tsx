import {
  Button,
  Input,
  Spinner,
  Card,
  CardBody,
  addToast,
} from "@heroui/react";
import { useEffect, useState } from "react";

const AdminManageRadius = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);

  const [radiusUtama, setRadiusUtama] = useState("");
  const [radiusPatroli, setRadiusPatroli] = useState("");

  const [errors, setErrors] = useState<{
    radiusUtama?: string;
    radiusPatroli?: string;
  }>({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const fetchRadiusSettings = async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/settings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();

      if (res.ok && data.userSetting) {
        setRadiusUtama(data.userSetting.radius_utama || "");
        setRadiusPatroli(data.userSetting.radius_jaga || "");
      } else {
        console.log("Gagal mengambil data radius atau data kosong");
      }
    } catch (error) {
      console.log("Error fetch radius:", error);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchRadiusSettings();
  }, []);

  const validateForm = () => {
    const newErrors: { radiusUtama?: string; radiusPatroli?: string } = {};
    let isValid = true;

    // Validasi Radius Utama
    const valUtama = parseInt(radiusUtama);
    if (!radiusUtama) {
      newErrors.radiusUtama = "Radius Utama wajib diisi.";
      isValid = false;
    } else if (isNaN(valUtama)) {
      newErrors.radiusUtama = "Harus berupa angka valid.";
      isValid = false;
    } else if (valUtama < 20) {
      newErrors.radiusUtama = "Minimal 20 meter.";
      isValid = false;
    } else if (valUtama > 1000) {
      newErrors.radiusUtama = "Maksimal 1000 meter.";
      isValid = false;
    }

    // Validasi Radius Patroli (Jaga)
    const valPatroli = parseInt(radiusPatroli);
    if (!radiusPatroli) {
      newErrors.radiusPatroli = "Radius Patroli wajib diisi.";
      isValid = false;
    } else if (isNaN(valPatroli)) {
      newErrors.radiusPatroli = "Harus berupa angka valid.";
      isValid = false;
    } else if (valPatroli < 20) {
      newErrors.radiusPatroli = "Minimal 20 meter.";
      isValid = false;
    } else if (valPatroli > 1000) {
      newErrors.radiusPatroli = "Maksimal 1000 meter.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      addToast({
        title: "Validasi Gagal",
        description: "Mohon periksa kembali inputan anda.",
        variant: "flat",
        color: "warning",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          radius_utama: parseInt(radiusUtama),
          radius_jaga: parseInt(radiusPatroli),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: "Radius berhasil diperbarui.",
          variant: "flat",
          timeout: 3000,
          color: "success",
        });
        setErrors({});
        fetchRadiusSettings();
      } else {
        throw new Error(result.message || "Gagal update");
      }
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal memperbarui radius.",
        variant: "flat",
        color: "danger",
      });
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-6">
        <div className="header-container mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Konfigurasi Radius Absensi & Patroli
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Atur jarak maksimal yang diizinkan untuk melakukan absensi dan
            patroli (dalam satuan meter).
          </p>
        </div>

        <Card className="max-w-2xl border border-gray-200 shadow-none rounded-xl">
          <CardBody className="p-8 gap-8">
            {loadingData ? (
              <div className="flex justify-center py-10">
                <Spinner label="Memuat pengaturan..." />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[#122C93]">
                    Radius Maksimum Pos Utama
                  </label>
                  <Input
                    type="number"
                    variant="bordered"
                    size="lg"
                    placeholder="Contoh: 100"
                    value={String(radiusUtama)}
                    isInvalid={!!errors.radiusUtama}
                    errorMessage={errors.radiusUtama}
                    onChange={(e) => {
                      setRadiusUtama(e.target.value);
                      if (errors.radiusUtama)
                        setErrors({ ...errors, radiusUtama: undefined });
                    }}
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">
                          meter
                        </span>
                      </div>
                    }
                    description="Jarak toleransi GPS untuk absen di Pos Utama (Min 20m, Max 1000m)."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[#122C93]">
                    Radius Maksimum Pos Patroli
                  </label>
                  <Input
                    type="number"
                    variant="bordered"
                    size="lg"
                    placeholder="Contoh: 50"
                    value={String(radiusPatroli)}
                    isInvalid={!!errors.radiusPatroli}
                    errorMessage={errors.radiusPatroli}
                    onChange={(e) => {
                      setRadiusPatroli(e.target.value);
                      if (errors.radiusPatroli)
                        setErrors({ ...errors, radiusPatroli: undefined });
                    }}
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">
                          meter
                        </span>
                      </div>
                    }
                    description="Jarak toleransi GPS untuk absen keliling di Pos Patroli (Min 20m, Max 1000m)."
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    isLoading={saving}
                    variant="solid"
                    onPress={handleUpdate}
                    className="bg-[#122C93] text-white font-semibold w-40 h-12 text-[16px] rounded-lg"
                  >
                    Update Radius
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminManageRadius;
