import { useCountryList, useCreateOrganization, useStateList } from "@/src/api";
import OrganizationFormDetails from "@/src/features/organization/forms/OrganizationFormDetails";
import React from "react";

function CreateOrganizationForm() {
  const [countryId, setCountryId] = React.useState<string | null>(null);
  const { data } = useCountryList();
  const { isLoading: isStatesLoading, data: statesData } = useStateList(
    { countryId: countryId || "" },
    {
      query: {
        enabled: !!countryId,
        queryKey: ["states", countryId],
      },
    }
  );
  const { mutate, error, isPending } = useCreateOrganization();
  return (
    <OrganizationFormDetails
      countries={data || []}
      states={statesData || []}
      setCountryId={setCountryId}
      customForm={{
        error,
        api: {
          onSubmit: (data) => mutate({ data }),
          isLoading: isPending,
        },
      }}
    />
  );
}

export default CreateOrganizationForm;
