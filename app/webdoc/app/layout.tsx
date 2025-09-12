import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata: Metadata = {
  title: "Uplofile Webdoc",
  description: "Demo/Docs for the uplofile component library",
};

const banner = <Banner storageKey="some-key">Uplofile is in beta</Banner>;
const navbar = <Navbar logo={<b>Uplofile</b>} />;
const footer = (
  <Footer>
    By{" "}
    <b>
      <a href="#">Kristofajosh</a>
    </b>
  </Footer>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
          footer={footer}
        >
          {children}
        </Layout>
        <Analytics />
      </body>
    </html>
  );
}
