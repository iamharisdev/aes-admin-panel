"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import { userService } from "@/lib/services/user.service";
import { roleService } from "@/lib/services/role.service";
import { hospitalService } from "@/lib/services/hospital.service";
import { createUserSchema, updateUserSchema } from "@/lib/validations/user.schema";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import { X } from "lucide-react";
import type { Role, Hospital, User } from "@/types";

interface UserFormModalProps {
  initial?: User;
  onClose: () => void;
  onSaved: () => void;
}

export default function UserFormModal({ initial, onClose, onSaved }: UserFormModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: initial?.name ?? "",
      email: initial?.email ?? "",
      phoneNumber: initial?.phoneNumber ?? "",
      password: "",
      roleId: initial?.roleId ?? "",
      hospitalId: initial?.hospitalId ?? "",
      isActive: (initial?.isActive ?? "Y") as "Y" | "N",
    },
    validationSchema: initial ? updateUserSchema : createUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");
      try {
        if (initial) {
          await userService.update(initial.id, {
            name: values.name,
            email: values.email,
            phoneNumber: values.phoneNumber || undefined,
            roleId: values.roleId,
            hospitalId: values.hospitalId || undefined,
            isActive: values.isActive,
          });
        } else {
          await userService.create({
            name: values.name,
            email: values.email,
            phoneNumber: values.phoneNumber || undefined,
            password: values.password,
            roleId: values.roleId,
            hospitalId: values.hospitalId || undefined,
            isActive: values.isActive,
          });
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

  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    try {
      const { data } = await roleService.getAll({ limit: 100 });
      setRoles(data.data);
    } catch {
      setApiError("Failed to load roles.");
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const loadHospitals = useCallback(async () => {
    setHospitalsLoading(true);
    try {
      const { data } = await hospitalService.getAll({ limit: 100, isActive: "Y" });
      setHospitals(data.data);
    } catch {
      setApiError("Failed to load hospitals.");
    } finally {
      setHospitalsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
    loadHospitals();
  }, [loadRoles, loadHospitals]);

  const roleOptions = roles
    .filter((r) => r.name.toLowerCase() !== "super_admin")
    .map((r) => ({ value: r.id, label: r.name }));

  const hospitalOptions = hospitals.map((h) => ({
    value: h.id,
    label: h.name,
  }));

  const err = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? "Edit User" : "New User"}
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
            <Input
              label="Full name"
              placeholder="e.g. John Smith"
              {...formik.getFieldProps("name")}
              error={err("name")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="e.g. john@example.com"
              {...formik.getFieldProps("email")}
              error={err("email")}
            />

            <Input
              label="Phone number"
              type="tel"
              placeholder="e.g. +923001234567"
              {...formik.getFieldProps("phoneNumber")}
              error={err("phoneNumber")}
            />

            {!initial && (
              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 chars, 1 uppercase, 1 number, 1 special"
                {...formik.getFieldProps("password")}
                error={err("password")}
              />
            )}

            <Dropdown
              label="Role"
              required
              loading={rolesLoading}
              placeholder="Select a role…"
              options={roleOptions}
              value={formik.values.roleId}
              onChange={(v) => formik.setFieldValue("roleId", v)}
              onBlur={() => formik.setFieldTouched("roleId", true)}
              error={err("roleId")}
            />

            <Dropdown
              label="Hospital"
              loading={hospitalsLoading}
              placeholder="Select a hospital…"
              options={hospitalOptions}
              value={formik.values.hospitalId}
              onChange={(v) => formik.setFieldValue("hospitalId", v)}
              onBlur={() => formik.setFieldTouched("hospitalId", true)}
              error={err("hospitalId")}
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
