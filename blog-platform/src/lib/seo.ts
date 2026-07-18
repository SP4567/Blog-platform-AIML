export const siteConfig = {
  title: "Northstar Journal",
  description: "A premium publishing experience for developers, designers, and builders.",
  url: "https://northstar-journal.dev",
  author: "Northstar Studio",
};

export function createMetadata(title: string, description = siteConfig.description) {
  return {
    title: `${title} | ${siteConfig.title}`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: siteConfig.url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  } as const;
}
