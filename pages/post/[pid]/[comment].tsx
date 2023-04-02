import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
const A = (props) => {
  const { query } = useRouter();


  return <div>hello</div>;
};
export async function getStaticPaths() {
  return {
    paths: [
      { params: { pid: "first", comment: "first-comment" } }, // See the "paths" section below
      { params: { pid: "second", comment: "second-comment" } }, // See the "paths" section below
    ],
    fallback: false, // See the "fallback" section below
  };
}
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1

  // Pass post data to the page via props
  return { props: { params } };
}
export default A;
