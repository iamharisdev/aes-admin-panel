"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { hospitalService } from "@/lib/services/hospital.service";
import { hospitalSchema } from "@/lib/validations/hospital.schema";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import { X } from "lucide-react";
import type { Hospital } from "@/types";

interface HospitalFormModalProps {
  initial?: Hospital;
  onClose: () => void;
  onSaved: () => void;
}

export default function HospitalFormModal({ initial, onClose, onSaved }: HospitalFormModalProps) {
  const [apiError, setApiError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: initial?.name ?? "",
      address: initial?.address ?? "",
      phone: initial?.phone ?? "",
      email: initial?.email ?? "",
      licenseNumber: initial?.licenseNumber ?? "",
      contactPerson: initial?.contactPerson ?? "",
      contactPersonPhone: initial?.contactPersonPhone ?? "",
      city: initial?.city ?? "",
      state: initial?.state ?? "",
      pincode: initial?.pincode ?? "",
      country: initial?.country ?? "Pakistan",
      isActive: (initial?.isActive ?? "Y") as "Y" | "N",
    },
    validationSchema: hospitalSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");
      try {
        const payload = {
          ...values,
          email: values.email || undefined,
          licenseNumber: values.licenseNumber || undefined,
          contactPerson: values.contactPerson || undefined,
          contactPersonPhone: values.contactPersonPhone || undefined,
          city: values.city || undefined,
          state: values.state || undefined,
          pincode: values.pincode || undefined,
        };
        if (initial) {
          await hospitalService.update(initial.id, payload);
        } else {
          await hospitalService.create(payload);
        }
        onSaved();
        onClose();
      } catch (err: unknown) {
        setApiError(
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Something went wrong."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const err = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? "Edit Hospital" : "New Hospital"}
          </h2>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClose}
            className="text-gray-400"
            leftIcon={<X className="w-4 h-4" />}
          />
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label="Hospital name"
                  placeholder="e.g. City General Hospital"
                  {...formik.getFieldProps("name")}
                  error={err("name")}
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="Address"
                  placeholder="e.g. 123 Main Street"
                  {...formik.getFieldProps("address")}
                  error={err("address")}
                />
              </div>
              <Input
                label="Phone"
                type="tel"
                placeholder="e.g. +92-300-1234567"
                {...formik.getFieldProps("phone")}
                error={err("phone")}
              />
              <Input
                label="Email"
                type="email"
                placeholder="Optional"
                {...formik.getFieldProps("email")}
                error={err("email")}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="City"
                placeholder="Optional"
                {...formik.getFieldProps("city")}
                error={err("city")}
              />
              <Input
                label="State"
                placeholder="Optional"
                {...formik.getFieldProps("state")}
                error={err("state")}
              />
              <Input
                label="Pincode"
                placeholder="5-6 digits"
                {...formik.getFieldProps("pincode")}
                error={err("pincode")}
              />
            </div>

            <Input
              label="Country"
              placeholder="Pakistan"
              {...formik.getFieldProps("country")}
              error={err("country")}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Contact person"
                placeholder="Optional"
                {...formik.getFieldProps("contactPerson")}
                error={err("contactPerson")}
              />
              <Input
                label="Contact person phone"
                type="tel"
                placeholder="Optional"
                {...formik.getFieldProps("contactPersonPhone")}
                error={err("contactPersonPhone")}
              />
            </div>

            <Input
              label="License number"
              placeholder="Optional"
              {...formik.getFieldProps("licenseNumber")}
              error={err("licenseNumber")}
            />

            <Dropdown
              label="Status"
              options={[
                { value: "Y", label: "Active" },
                { value: "N", label: "Inactive" },
              ]}
              value={formik.values.isActive}
              onChange={(v) => formik.setFieldValue("isActive", v)}
              onBlur={() => formik.setFieldTouched("isActive", true)}
              error={err("isActive")}
            />

            {apiError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {apiError}
              </p>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-100">
            <Button type="button" variant="outline" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={formik.isSubmitting}>
              {initial ? "Update" : "Create"}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
