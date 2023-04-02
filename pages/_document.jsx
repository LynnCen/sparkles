import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <script src="/static/js/fixed-ie.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <style jsx global>{`
          body {
            margin: 0;
          }
        `}</style>
      </Html>
    );
  }
}

export default MyDocument;
