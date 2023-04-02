import Error from "next/error";

const Page = props => {
  return <Error {...props} />;
};

Page.getInitialProps = async () => ({
  namespacesRequired: ["common"]
});

export default Page;
