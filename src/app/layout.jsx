import "./globals.css";
import LayoutShell from "../components/LayoutShell";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "GoldApp Admin",
  description: "Admin panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>{children}</LayoutShell>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
