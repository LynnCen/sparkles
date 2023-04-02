import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Table } from "antd";
import step1 from "../../../public/images/chat-1.png";
import step2 from "../../../public/images/chat-2.png";
import step3 from "../../../public/images/chat-3.png";
import step4 from "../../../public/images/chat-4.png";
import Image from "next/image";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const columns = [
    {
      title: t("is-konw-send-table-title"),
      dataIndex: "title",
      key: "title",
      render: (src) => <Image src={src} width={250} height={60} />,
    },
    {
      title: t("is-konw-send-table-status"),
      dataIndex: "status",
      key: "status",
    },
    {
      title: t("is-konw-send-table-explain"),
      dataIndex: "explain",
      key: "explain",
    },
  ];
  const data = [
    {
      key: "1",
      title: step1,
      status: t("is-konw-send-table-pedding"),
      explain: t("is-konw-send-table-pedding-explain"),
    },
    {
      key: "2",
      title: step2,
      status: t("is-konw-send-table-success"),
      explain: t("is-konw-send-table-success-explain"),
    },
    {
      key: "3",
      title: step3,
      status: t("is-konw-send-table-read"),
      explain: t("is-konw-send-table-read-explain"),
    },
    {
      key: "4",
      title: step4,
      status: t("is-konw-send-table-fail"),
      explain: t("is-konw-send-table-fail-explain"),
    },
  ];
  return (
    <>
      <TDK title={`${t("is-konw-send")} | ${t("fa")}`} />
      <h2>{t("is-konw-send")}</h2>
      <h3>{t("is-konw-send-status")}</h3>
      <Table columns={columns} dataSource={data} pagination={false} />
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
  },
});
export default A;
