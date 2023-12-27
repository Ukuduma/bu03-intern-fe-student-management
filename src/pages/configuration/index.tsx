import { getApi } from "api/testapi";
import PageTitle from "components/common/PageTitle";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConfigurationRoutes } from "routes";

const Configuration = () => {
  const { t } = useTranslation()

  const getApiTest = async () => {
    const { data } = await getApi();
    console.log(data);

  }
  useEffect(() => {
    getApiTest()
  }, [])

  return <Fragment>
    <PageTitle
      breadCrumbItems={[
        {
          label: t("Configuration"),
          path: ConfigurationRoutes.Root,
          active: true
        },
      ]}
      title={t("Configuration")}
    /></Fragment>
}

export default Configuration;