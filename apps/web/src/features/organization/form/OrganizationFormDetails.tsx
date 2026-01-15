"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as CustomForm } from "@/src/components/form";

import React from "react";
import { useForm } from "react-hook-form";

import { createOrganizationBodySchema as schema } from "@avuny/api/schemas";
import { z } from "@avuny/zod";

export default function OrganizationFormDetails() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  return <div></div>;
}
