/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel's static-asset layer sets its own Content-Disposition on files
  // under /public (inline; filename="resume.pdf" — derived from the actual
  // on-disk name), and that server-sent filename wins over the <a download>
  // attribute in Chromium browsers. Overriding it here keeps the file named
  // resume.pdf on disk (so no links change) while making the server agree
  // with the download attribute on what the saved file should be called.
  async headers() {
    return [
      {
        source: "/resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Suraj_Gupta_CV.pdf"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
